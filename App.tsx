

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Message, Contact, Folder, ComposeFormData, SearchFilters, Account, Conversation, ChatMessage, Template } from './types';
import { MY_EMAIL as MY_EMAIL_PLACEHOLDER, sampleMessages, sampleContacts, sampleConversations, sampleChatMessages, sampleTemplates } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import MessageDetail from './components/MessageDetail';
import ComposeModal from './components/ComposeModal';
import EditContactModal from './components/EditContactModal';
import AccountSettingsModal from './components/AccountSettingsModal';
import SupportModal from './components/SupportModal';
import TemplateManagerModal from './components/TemplateManagerModal';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ConversationList from './components/ConversationList';
import ChatView from './components/ChatView';
import CallView from './components/CallView';

type AuthPage = 'login' | 'signup' | 'forgot';
export type Theme = 'light' | 'dark';
export type View = 'mail' | 'messenger';
export type Thread = Message[];

export default function App() {
  const [messages, setMessages] = useLocalStorage<Message[]>('kmails_gemini_messages', []);
  const [contacts, setContacts] = useLocalStorage<Contact[]>('kmails_gemini_contacts', []);
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('kmails_gemini_conversations', []);
  const [chatMessages, setChatMessages] = useLocalStorage<ChatMessage[]>('kmails_gemini_chat_messages', []);
  const [templates, setTemplates] = useLocalStorage<Template[]>('kmails_gemini_templates', []);

  const [signature, setSignature] = useLocalStorage<string>('kmails_gemini_signature', 'Sent from KMail');
  const [theme, setTheme] = useLocalStorage<Theme>('kmail_theme', 'light');

  const [accounts, setAccounts] = useLocalStorage<Account[]>('kmail_accounts', []);
  const [currentAccountId, setCurrentAccountId] = useLocalStorage<string | null>('kmail_current_account_id', null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  
  const [currentView, setCurrentView] = useState<View>('mail');
  const [selectedFolder, setSelectedFolder] = useState<Folder>("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({ query: "", from: "", subject: "", startDate: "", endDate: "" });
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeForm, setComposeForm] = useState<ComposeFormData>({ to: "", subject: "", body: "" });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Partial<Template> | null>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{ contact: Contact; type: 'audio' | 'video' } | null>(null);
  
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  
  const currentAccount = useMemo(() => {
    return accounts.find(acc => acc.id === currentAccountId) || null;
  }, [accounts, currentAccountId]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!currentAccountId && accounts.length > 0) {
      setCurrentAccountId(accounts[0].id);
    }
    if (currentAccountId && !accounts.find(acc => acc.id === currentAccountId)) {
      setCurrentAccountId(accounts.length > 0 ? accounts[0].id : null);
    }
  }, [accounts, currentAccountId, setCurrentAccountId]);
  
  const handleLogin = useCallback((user: {email: string, name: string}) => {
    const existing = accounts.find(acc => acc.email === user.email);
    if (existing) {
        alert("This account has already been added.");
        setCurrentAccountId(existing.id);
        setIsAddingAccount(false);
        return;
    }

    const newAccount: Account = { id: `acc_${Date.now()}`, ...user };
    setAccounts(prev => [...prev, newAccount]);
    setCurrentAccountId(newAccount.id);

    // If this is the very first account, populate it with sample data.
    if (accounts.length === 0) {
        const firstAccountMessages = sampleMessages.map(m => ({
            ...m, accountId: newAccount.id,
            to: m.to === MY_EMAIL_PLACEHOLDER ? newAccount.email : m.to,
            from: m.from === MY_EMAIL_PLACEHOLDER ? newAccount.email : m.from,
        }));
        const firstAccountContacts = sampleContacts.map(c => ({
            ...c, accountId: newAccount.id,
            email: c.email === MY_EMAIL_PLACEHOLDER ? newAccount.email : c.email,
        }));
        const firstAccountConversations = sampleConversations.map(c => ({
            ...c, accountId: newAccount.id,
            participantEmails: c.participantEmails.map(e => e === MY_EMAIL_PLACEHOLDER ? newAccount.email : e)
        }));
        const firstAccountChatMessages = sampleChatMessages.map(cm => ({
            ...cm, senderEmail: cm.senderEmail === MY_EMAIL_PLACEHOLDER ? newAccount.email : cm.senderEmail,
        }));
        const firstAccountTemplates = sampleTemplates.map(t => ({...t, accountId: newAccount.id }));

        setMessages(firstAccountMessages);
        setContacts(firstAccountContacts);
        setConversations(firstAccountConversations);
        setChatMessages(firstAccountChatMessages);
        setTemplates(firstAccountTemplates);
    }
    setIsAddingAccount(false);
  }, [accounts, setAccounts, setCurrentAccountId, setMessages, setContacts, setConversations, setChatMessages, setTemplates]);

  const handleLogout = useCallback(() => {
    if (window.confirm("Are you sure you want to log out of all accounts and clear data?")) {
      setAccounts([]);
      setCurrentAccountId(null);
      setMessages([]);
      setContacts([]);
      setConversations([]);
      setChatMessages([]);
      setTemplates([]);
    }
  }, [setAccounts, setCurrentAccountId, setMessages, setContacts, setConversations, setChatMessages, setTemplates]);

  const handleSwitchAccount = useCallback((accountId: string) => {
    if (accountId !== currentAccountId) {
      setCurrentAccountId(accountId);
      setSelectedThreadId(null);
      setSelectedConversationId(null);
      setCurrentView('mail');
      setSelectedFolder('inbox');
    }
  }, [currentAccountId, setCurrentAccountId]);

  const handleFolderSelect = useCallback((folder: Folder) => {
    setSelectedFolder(folder);
    setSelectedThreadId(null);
    setCurrentView('mail');
  }, []);

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
    setSelectedThreadId(null);
    setSelectedConversationId(null);
  }, []);

  const unreadCounts = useMemo(() => {
    if (!currentAccount) return { inbox: 0, starred: 0, archived: 0, drafts: 0, important: 0, promotions: 0, updates: 0, trash: 0 };
    return messages
        .filter(msg => msg.accountId === currentAccount.id)
        .reduce((counts, msg) => {
            if (!msg.read) {
                if (msg.isTrash) counts.trash++;
                else {
                    if (msg.starred) counts.starred++;
                    if (msg.status === 'draft') counts.drafts++;
                    if (msg.isImportant) counts.important++;
                    if (msg.isPromotion) counts.promotions++;
                    if (msg.isUpdate) counts.updates++;

                    if (msg.to === currentAccount.email) {
                        if (msg.archived) counts.archived++;
                         else counts.inbox++;
                    }
                }
            }
            return counts;
    }, { inbox: 0, starred: 0, archived: 0, drafts: 0, important: 0, promotions: 0, updates: 0, trash: 0 });
  }, [messages, currentAccount]);

  const currentAccountData = useMemo(() => {
    if (!currentAccount) return { messages: [], contacts: [], conversations: [], templates: [] };
    const accountId = currentAccount.id;
    return {
      messages: messages.filter(m => m.accountId === accountId),
      contacts: contacts.filter(c => c.accountId === accountId),
      conversations: conversations.filter(c => c.accountId === accountId),
      templates: templates.filter(t => t.accountId === accountId),
    };
  }, [messages, contacts, conversations, templates, currentAccount]);


  const visibleThreads = useMemo(() => {
    if (!currentAccount || currentView !== 'mail') return [];

    const folderFiltered = (msg: Message) => {
      switch (selectedFolder) {
        case "inbox": return !msg.archived && msg.to === currentAccount.email && !msg.isTrash && msg.status !== 'draft';
        case "sent": return msg.from === currentAccount.email && !msg.isTrash && msg.status !== 'draft';
        case "archived": return msg.archived && msg.to === currentAccount.email && !msg.isTrash;
        case "starred": return msg.starred && !msg.isTrash;
        case "drafts": return msg.status === 'draft' && !msg.isTrash;
        case "important": return msg.isImportant && !msg.isTrash;
        case "promotions": return msg.isPromotion && !msg.isTrash;
        case "updates": return msg.isUpdate && !msg.isTrash;
        case "trash": return msg.isTrash;
        default: return true;
      }
    };

    const searchFiltered = (msg: Message) => {
      const { query, from, subject, startDate, endDate } = searchFilters;
      if (!query && !from && !subject && !startDate && !endDate) return true;
      const lowerCaseQuery = query.toLowerCase();
      const lowerCaseFrom = from.toLowerCase();
      const lowerCaseSubject = subject.toLowerCase();
      const messageDate = new Date(msg.date);
      const queryMatch = !query || msg.from.toLowerCase().includes(lowerCaseQuery) || msg.to.toLowerCase().includes(lowerCaseQuery) || msg.subject.toLowerCase().includes(lowerCaseQuery) || msg.body.toLowerCase().includes(lowerCaseQuery);
      const fromMatch = !from || msg.from.toLowerCase().includes(lowerCaseFrom);
      const subjectMatch = !subject || msg.subject.toLowerCase().includes(lowerCaseSubject);
      const startDateMatch = !startDate || messageDate >= new Date(startDate);
      let endDateMatch = true;
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        endDateMatch = messageDate <= end;
      }
      return queryMatch && fromMatch && subjectMatch && startDateMatch && endDateMatch;
    };

    const filteredMessages = currentAccountData.messages.filter(folderFiltered).filter(searchFiltered);
    const threadsMap = new Map<string, Message[]>();
    filteredMessages.forEach(msg => {
      const threadId = msg.threadId || msg.id;
      if (!threadsMap.has(threadId)) {
        threadsMap.set(threadId, []);
      }
      threadsMap.get(threadId)!.push(msg);
    });
    
    const threads: Thread[] = Array.from(threadsMap.values()).map(thread => 
      thread.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    threads.sort((a, b) => {
      const lastMsgA = a[a.length - 1];
      const lastMsgB = b[b.length - 1];
      return new Date(lastMsgB.date).getTime() - new Date(lastMsgA.date).getTime();
    });

    return threads;
  }, [currentAccountData.messages, selectedFolder, searchFilters, currentAccount, currentView]);

  const openThread = useCallback((threadId: string) => {
    setSelectedThreadId(threadId);
    setMessages(prev => prev.map(m => ((m.threadId || m.id) === threadId ? { ...m, read: true } : m)));
  }, [setMessages]);

  const toggleThreadStar = useCallback((threadId: string) => {
    setMessages(prev => {
      const threadMessages = prev.filter(m => (m.threadId || m.id) === threadId);
      const shouldStar = threadMessages.some(m => !m.starred);
      const threadMessageIds = new Set(threadMessages.map(m => m.id));
      return prev.map(m => (threadMessageIds.has(m.id) ? { ...m, starred: shouldStar } : m));
    });
  }, [setMessages]);

  const toggleThreadArchive = useCallback((threadId: string) => {
    setMessages(prev => prev.map(m => ((m.threadId || m.id) === threadId ? { ...m, archived: !m.archived } : m)));
    if (selectedThreadId === threadId) setSelectedThreadId(null);
  }, [selectedThreadId, setMessages]);

  const moveThreadToTrash = useCallback((threadId: string) => {
    setMessages(prev => prev.map(m => ((m.threadId || m.id) === threadId ? { ...m, isTrash: true } : m)));
    if (selectedThreadId === threadId) setSelectedThreadId(null);
  }, [selectedThreadId, setMessages]);

  const restoreThreadFromTrash = useCallback((threadId: string) => {
    setMessages(prev => prev.map(m => ((m.threadId || m.id) === threadId ? { ...m, isTrash: false } : m)));
  }, [setMessages]);

  const deleteThreadPermanently = useCallback((threadId: string) => {
    const threadMessages = messages.filter(m => (m.threadId || m.id) === threadId);
    const subject = threadMessages[0]?.subject || 'this conversation';
    if (window.confirm(`This conversation "${subject}" (${threadMessages.length} messages) will be deleted forever. Are you sure?`)) {
        const threadMessageIds = new Set(threadMessages.map(m => m.id));
        setMessages(prev => prev.filter(m => !threadMessageIds.has(m.id)));
        if (selectedThreadId === threadId) setSelectedThreadId(null);
    }
  }, [selectedThreadId, messages, setMessages]);

  const sendMessage = useCallback((data: ComposeFormData) => {
    if (!currentAccount) return;
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      threadId: data.threadId,
      accountId: currentAccount.id,
      from: currentAccount.email,
      to: data.to,
      subject: data.subject,
      body: data.body,
      date: new Date().toISOString(),
      starred: false,
      archived: false,
      read: true,
      isImportant: false, isPromotion: false, isUpdate: false, isTrash: false,
      status: 'sent',
    };
    setMessages(prev => [newMessage, ...prev]);
  }, [setMessages, currentAccount]);
  
  const addContact = useCallback((name: string, email: string) => {
    if (!currentAccount) return;
    const id = `c_${Date.now()}`;
    setContacts(prev => [{ id, accountId: currentAccount.id, name, email }, ...prev]);
  }, [setContacts, currentAccount]);
  
  const handleUpdateContact = useCallback((updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    setEditingContact(null);
  }, [setContacts]);

  const handleUpdateAccount = useCallback((updatedAccount: Account) => {
    setAccounts(prev => prev.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    setEditingAccount(null);
  }, [setAccounts]);


  const importContactsCSV = useCallback((csv: string) => { /* ... */ }, [setContacts, currentAccount]);
  
    const handleDeviceSync = useCallback(async () => {
    if (!('contacts' in navigator && 'select' in (navigator as any).contacts)) {
      alert('Contact Picker API is not supported on this browser.');
      return;
    }
    if (!currentAccount) return;

    try {
      const contactsToSync: any[] = await (navigator as any).contacts.select(['name', 'email'], { multiple: true });
      if (!contactsToSync || contactsToSync.length === 0) return;

      const newContacts: Contact[] = [];
      const existingEmails = new Set(contacts.map(c => c.email));

      for (const contact of contactsToSync) {
        const email = contact.email?.[0];
        const name = contact.name?.[0];

        if (email && name && !existingEmails.has(email)) {
          newContacts.push({
            id: `c_${Date.now()}_${Math.random()}`,
            accountId: currentAccount.id,
            name: name,
            email: email,
          });
          existingEmails.add(email);
        }
      }

      if (newContacts.length > 0) {
        setContacts(prev => [...newContacts, ...prev]);
        alert(`Successfully imported ${newContacts.length} new contact(s).`);
      } else {
        alert('No new contacts to import. Selected contacts might already exist.');
      }
    } catch (ex) {
      console.error('Error syncing contacts:', ex);
    }
  }, [currentAccount, contacts, setContacts]);
  
  const handleCompose = useCallback((contactEmail?: string) => {
    setComposeForm({ to: contactEmail || "", subject: "", body: `\n\n--\n${signature}`, threadId: undefined });
    setComposeOpen(true);
  }, [signature]);

  const handleStartChat = useCallback((contact: Contact) => {
    if (!currentAccount) return;
    const existingConversation = conversations.find(c => c.accountId === currentAccount.id && c.participantEmails.includes(contact.email));
    if (existingConversation) {
        setSelectedConversationId(existingConversation.id);
    } else {
        const newConversation: Conversation = {
            id: `conv_${Date.now()}`,
            accountId: currentAccount.id,
            participantEmails: [currentAccount.email, contact.email],
        };
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversationId(newConversation.id);
    }
    setCurrentView('messenger');
  }, [conversations, currentAccount, setConversations]);
  
  const handleSendChatMessage = useCallback((conversationId: string, text: string) => {
    if (!currentAccount) return;
    const newMessage: ChatMessage = {
        id: `cm_${Date.now()}`,
        conversationId,
        senderEmail: currentAccount.email,
        text,
        timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, [currentAccount, setChatMessages]);

  const handleSendSupportMessage = useCallback((subject: string, body: string) => {
      console.log("Sending support message:", { subject, body, from: currentAccount?.email });
      alert("Your message has been sent to support. We will get back to you shortly.");
      setSupportModalOpen(false);
  }, [currentAccount]);

  const handleStartCall = useCallback((contact: Contact, type: 'audio' | 'video') => setActiveCall({ contact, type }), []);
  const handleEndCall = useCallback(() => setActiveCall(null), []);

  const handleSaveTemplate = useCallback((data: { name: string; subject: string; body: string; id?: string }) => {
    if (!currentAccount) return;
    if (data.id) {
        setTemplates(prev => prev.map(t => (t.id === data.id ? { ...t, name: data.name, subject: data.subject, body: data.body } : t)));
    } else {
        const newTemplate: Template = {
            id: `t_${Date.now()}`,
            accountId: currentAccount.id,
            name: data.name,
            subject: data.subject,
            body: data.body,
        };
        setTemplates(prev => [newTemplate, ...prev]);
    }
    setEditingTemplate(null);
  }, [currentAccount, setTemplates]);

  const handleDeleteTemplate = useCallback((templateId: string) => {
      const templateToDelete = templates.find(t => t.id === templateId);
      if (!templateToDelete) return;

      if (window.confirm(`Are you sure you want to delete the template "${templateToDelete.name}"?`)) {
          setTemplates(prev => prev.filter(t => t.id !== templateId));
      }
  }, [templates, setTemplates]);

  const selectedThread = useMemo(() => {
    if (!selectedThreadId) return null;
    const threadMessages = messages
      .filter(m => (m.threadId || m.id) === selectedThreadId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return threadMessages.length > 0 ? threadMessages : null;
  }, [messages, selectedThreadId]);
  
  const selectedConversation = useMemo(() => conversations.find(c => c.id === selectedConversationId) || null, [conversations, selectedConversationId]);

  if (accounts.length === 0 || isAddingAccount) { /* ... Auth Pages ... */
    const handleSuccess = (user: {email: string, name: string}) => {
      handleLogin(user);
      setIsAddingAccount(false);
      setAuthPage('login');
    }

    return (
      <div className="antialiased min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
        {authPage === 'login' && <LoginPage onLoginSuccess={handleSuccess} onSwitchToSignup={() => setAuthPage('signup')} onSwitchToForgot={() => setAuthPage('forgot')} />}
        {authPage === 'signup' && <SignupPage onSignupSuccess={handleSuccess} onSwitchToLogin={() => setAuthPage('login')} />}
        {authPage === 'forgot' && <ForgotPasswordPage onSwitchToLogin={() => setAuthPage('login')} />}
      </div>
    );
  }

  return (
    <div className="antialiased min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-2 sm:p-4">
      <div className="max-w-7xl h-[calc(100vh-2rem)] mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden grid grid-cols-12">
        <Sidebar
          accounts={accounts}
          currentAccount={currentAccount}
          onSwitchAccount={handleSwitchAccount}
          onAddAccount={() => setIsAddingAccount(true)}
          onStartEditAccount={setEditingAccount}
          currentView={currentView}
          onViewChange={handleViewChange}
          selectedFolder={selectedFolder}
          onFolderSelect={handleFolderSelect}
          onCompose={handleCompose}
          contacts={currentAccountData.contacts}
          onAddContact={addContact}
          onImportContacts={importContactsCSV}
          onDeviceSync={handleDeviceSync}
          onStartEditContact={setEditingContact}
          onStartChat={handleStartChat}
          templates={currentAccountData.templates}
          onOpenTemplateManager={setEditingTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          signature={signature}
          onSignatureChange={setSignature}
          onLogout={handleLogout}
          onOpenSupport={() => setSupportModalOpen(true)}
          unreadCounts={unreadCounts}
          theme={theme}
          onThemeChange={setTheme}
        />

        <main className="col-span-12 md:col-span-9 lg:col-span-10 grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden">
          {currentView === 'mail' ? (
            <>
              <MessageList
                threads={visibleThreads}
                allMessages={currentAccountData.messages}
                selectedThreadId={selectedThreadId}
                onThreadSelect={openThread}
                searchFilters={searchFilters}
                setSearchFilters={setSearchFilters}
                onToggleThreadStar={toggleThreadStar}
                onToggleThreadArchive={toggleThreadArchive}
              />
              <MessageDetail
                thread={selectedThread}
                selectedFolder={selectedFolder}
                onToggleThreadStar={toggleThreadStar}
                onToggleThreadArchive={toggleThreadArchive}
                onMoveThreadToTrash={moveThreadToTrash}
                onRestoreThreadFromTrash={restoreThreadFromTrash}
                onDeleteThreadPermanently={deleteThreadPermanently}
                onReply={(body, messageToReplyTo) => {
                  if (messageToReplyTo) {
                    setComposeForm({ 
                      to: messageToReplyTo.from, 
                      subject: messageToReplyTo.subject.startsWith("Re: ") ? messageToReplyTo.subject : `Re: ${messageToReplyTo.subject}`, 
                      body: `\n\n--\n${signature}\n\n\nOn ${new Date(messageToReplyTo.date).toLocaleString()}, ${messageToReplyTo.from} wrote:\n> ${messageToReplyTo.body.replace(/\n/g, '\n> ')}`,
                      threadId: messageToReplyTo.threadId || messageToReplyTo.id
                    });
                    setComposeOpen(true);
                  }
                }}
              />
            </>
          ) : (
            <>
              <ConversationList
                conversations={currentAccountData.conversations}
                chatMessages={chatMessages}
                contacts={currentAccountData.contacts}
                currentAccountEmail={currentAccount!.email}
                selectedConversationId={selectedConversationId}
                onConversationSelect={setSelectedConversationId}
              />
              <ChatView
                conversation={selectedConversation}
                messages={chatMessages.filter(m => m.conversationId === selectedConversationId)}
                contacts={currentAccountData.contacts}
                currentAccountEmail={currentAccount!.email}
                onSendMessage={handleSendChatMessage}
                onStartCall={handleStartCall}
              />
            </>
          )}
        </main>
      </div>

      {composeOpen && <ComposeModal initialData={composeForm} templates={currentAccountData.templates} contacts={currentAccountData.contacts} onClose={() => setComposeOpen(false)} onSend={sendMessage} />}
      {editingContact && <EditContactModal contact={editingContact} onClose={() => setEditingContact(null)} onSave={handleUpdateContact} />}
      {editingAccount && <AccountSettingsModal account={editingAccount} onClose={() => setEditingAccount(null)} onSave={handleUpdateAccount} />}
      {editingTemplate && <TemplateManagerModal template={editingTemplate} onClose={() => setEditingTemplate(null)} onSave={handleSaveTemplate} />}
      {supportModalOpen && <SupportModal user={currentAccount!} onClose={() => setSupportModalOpen(false)} onSend={handleSendSupportMessage} />}
      {activeCall && <CallView contact={activeCall.contact} type={activeCall.type} onEndCall={handleEndCall} />}
    </div>
  );
}