import React, { useState, useRef, useEffect } from 'react';
import type { Folder, Contact, Account, Template } from '../types';
import type { Theme, View } from '../App';
import AddContact from './AddContact';
import { InboxIcon, SendIcon, StarIcon, ArchiveIcon, EditIcon, SettingsIcon, LogOutIcon, PencilIcon, ChevronDownIcon, UserPlusIcon, UserIcon, SunIcon, MoonIcon, MessageSquareIcon, TrashIcon, TagIcon, FileEditIcon, InfoIcon, PriceTagIcon, LifeBuoyIcon, FileTextIcon, PlusIcon } from './icons';

interface SidebarProps {
  accounts: Account[];
  currentAccount: Account | null;
  onSwitchAccount: (accountId: string) => void;
  onAddAccount: () => void;
  onStartEditAccount: (account: Account) => void;
  currentView: View;
  onViewChange: (view: View) => void;
  selectedFolder: Folder;
  onFolderSelect: (folder: Folder) => void;
  onCompose: (email?: string) => void;
  contacts: Contact[];
  onAddContact: (name: string, email: string) => void;
  onImportContacts: (csv: string) => void;
  onDeviceSync: () => void;
  onStartEditContact: (contact: Contact) => void;
  onStartChat: (contact: Contact) => void;
  templates: Template[];
  onOpenTemplateManager: (template?: Partial<Template>) => void;
  onDeleteTemplate: (templateId: string) => void;
  signature: string;
  onSignatureChange: (signature: string) => void;
  onLogout: () => void;
  onOpenSupport: () => void;
  unreadCounts: {
    inbox: number;
    starred: number;
    archived: number;
    drafts: number;
    important: number;
    promotions: number;
    updates: number;
    trash: number;
  };
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  count?: number;
}> = ({ label, icon, isSelected, onClick, count }) => (
  <button
    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
      isSelected
        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      {icon}
      {label}
    </div>
    {count > 0 && (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isSelected ? 'bg-sky-200 text-sky-800 dark:bg-sky-800 dark:text-sky-200' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const AccountSwitcher: React.FC<{
  accounts: Account[];
  currentAccount: Account;
  onSwitchAccount: (id: string) => void;
  onAddAccount: () => void;
  onStartEditAccount: (account: Account) => void;
  onLogout: () => void;
}> = ({ accounts, currentAccount, onSwitchAccount, onAddAccount, onStartEditAccount, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-6" ref={switcherRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-left flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{currentAccount.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{currentAccount.email}</div>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 z-10 py-1">
          {accounts.map(acc => (
            acc.id !== currentAccount.id && (
              <button key={acc.id} onClick={() => { onSwitchAccount(acc.id); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="font-medium">{acc.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{acc.email}</div>
              </button>
            )
          ))}
          <div className="my-1 border-t border-slate-200 dark:border-slate-700"></div>
          <button onClick={() => { onStartEditAccount(currentAccount); setIsOpen(false); }} className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
            <UserIcon className="w-4 h-4" /> Manage Account
          </button>
          <button onClick={() => { onAddAccount(); setIsOpen(false); }} className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
            <UserPlusIcon className="w-4 h-4" /> Add Account
          </button>
          <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
            <LogOutIcon className="w-4 h-4" /> Logout All
          </button>
        </div>
      )}
    </div>
  );
};


const Sidebar: React.FC<SidebarProps> = ({
  accounts,
  currentAccount,
  onSwitchAccount,
  onAddAccount,
  onStartEditAccount,
  currentView,
  onViewChange,
  selectedFolder,
  onFolderSelect,
  onCompose,
  contacts,
  onAddContact,
  onImportContacts,
  onDeviceSync,
  onStartEditContact,
  onStartChat,
  templates,
  onOpenTemplateManager,
  onDeleteTemplate,
  signature,
  onSignatureChange,
  onLogout,
  onOpenSupport,
  unreadCounts,
  theme,
  onThemeChange,
}) => {
  return (
    <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col h-full overflow-y-auto">
      <div className="px-2 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">KMail</h1>
      </div>
      
      {currentAccount && <AccountSwitcher accounts={accounts} currentAccount={currentAccount} onSwitchAccount={onSwitchAccount} onAddAccount={onAddAccount} onStartEditAccount={onStartEditAccount} onLogout={onLogout} />}

      <div className="mb-6">
        <button
          onClick={() => onCompose()}
          className="w-full bg-sky-600 text-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <EditIcon className="w-4 h-4" />
          <span className="font-semibold">Compose</span>
        </button>
      </div>

      <nav className="space-y-1 mb-6">
        <NavButton
          label="Inbox"
          icon={<InboxIcon className="w-5 h-5" />}
          isSelected={currentView === 'mail' && selectedFolder === "inbox"}
          onClick={() => onFolderSelect("inbox")}
          count={unreadCounts.inbox}
        />
         <NavButton
          label="Messenger"
          icon={<MessageSquareIcon className="w-5 h-5" />}
          isSelected={currentView === 'messenger'}
          onClick={() => onViewChange("messenger")}
        />
        <div className="pt-2">
          <NavButton
            label="Sent"
            icon={<SendIcon className="w-5 h-5" />}
            isSelected={currentView === 'mail' && selectedFolder === "sent"}
            onClick={() => onFolderSelect("sent")}
          />
          <NavButton
            label="Starred"
            icon={<StarIcon className="w-5 h-5" />}
            isSelected={currentView === 'mail' && selectedFolder === "starred"}
            onClick={() => onFolderSelect("starred")}
            count={unreadCounts.starred}
          />
          <NavButton
            label="Archived"
            icon={<ArchiveIcon className="w-5 h-5" />}
            isSelected={currentView === 'mail' && selectedFolder === "archived"}
            onClick={() => onFolderSelect("archived")}
            count={unreadCounts.archived}
          />
        </div>
        <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mt-2 mb-1 px-3">Categories</h3>
            <NavButton
                label="Drafts"
                icon={<FileEditIcon className="w-5 h-5" />}
                isSelected={currentView === 'mail' && selectedFolder === "drafts"}
                onClick={() => onFolderSelect("drafts")}
                count={unreadCounts.drafts}
            />
            <NavButton
                label="Important"
                icon={<TagIcon className="w-5 h-5" />}
                isSelected={currentView === 'mail' && selectedFolder === "important"}
                onClick={() => onFolderSelect("important")}
                count={unreadCounts.important}
            />
            <NavButton
                label="Promotions"
                icon={<PriceTagIcon className="w-5 h-5" />}
                isSelected={currentView === 'mail' && selectedFolder === "promotions"}
                onClick={() => onFolderSelect("promotions")}
                count={unreadCounts.promotions}
            />
            <NavButton
                label="Updates"
                icon={<InfoIcon className="w-5 h-5" />}
                isSelected={currentView === 'mail' && selectedFolder === "updates"}
                onClick={() => onFolderSelect("updates")}
                count={unreadCounts.updates}
            />
            <NavButton
                label="Trash"
                icon={<TrashIcon className="w-5 h-5" />}
                isSelected={currentView === 'mail' && selectedFolder === "trash"}
                onClick={() => onFolderSelect("trash")}
                count={unreadCounts.trash}
            />
        </div>
      </nav>

      <div className="mb-6 space-y-4">
        <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mt-2 mb-2 px-2 flex justify-between items-center">
                <span className="flex items-center gap-2"><FileTextIcon className="w-4 h-4" /> Templates</span>
                <button onClick={() => onOpenTemplateManager({})} className="p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Create new template">
                    <PlusIcon className="w-4 h-4" />
                </button>
            </h3>
            <div className="space-y-1 max-h-24 overflow-auto pr-1">
                {templates.map(template => (
                    <div key={template.id} className="group flex items-center justify-between text-left w-full hover:bg-slate-100 dark:hover:bg-slate-700 pl-3 pr-1 py-1 rounded-md">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate" title={template.name}>{template.name}</div>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onOpenTemplateManager(template)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400" aria-label={`Edit ${template.name} template`}>
                                <PencilIcon className="w-3 h-3" />
                            </button>
                             <button onClick={() => onDeleteTemplate(template.id)} className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400" aria-label={`Delete ${template.name} template`}>
                                <TrashIcon className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 px-2 flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                <span>Signature</span>
            </h3>
            <textarea
                value={signature}
                onChange={(e) => onSignatureChange(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-md border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                placeholder="Your email signature..."
                aria-label="Email signature editor"
            />
        </div>
        <div>
            <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2 px-2">
                Appearance
            </h3>
            <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <button 
                    onClick={() => onThemeChange('light')}
                    className={`w-full flex items-center justify-center gap-2 p-1.5 rounded-md text-sm transition-colors ${theme === 'light' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                >
                    <SunIcon className="w-4 h-4" /> Light
                </button>
                <button 
                    onClick={() => onThemeChange('dark')}
                    className={`w-full flex items-center justify-center gap-2 p-1.5 rounded-md text-sm transition-colors ${theme === 'dark' ? 'bg-slate-800 shadow-sm text-slate-100' : 'text-slate-500'}`}
                >
                    <MoonIcon className="w-4 h-4" /> Dark
                </button>
            </div>
        </div>
        <div>
          <button
              onClick={onOpenSupport}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
          >
              <LifeBuoyIcon className="w-5 h-5" />
              Support
          </button>
        </div>
      </div>
      

      <div className="mt-auto">
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3 px-2">Contacts</h3>
          <div className="space-y-1 max-h-32 overflow-auto pr-2 mb-4">
            {contacts.map((c) => (
              c.email !== currentAccount?.email && (
                <div
                  key={c.id}
                  className="group flex items-center justify-between text-left w-full hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1.5 rounded-md"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{c.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{c.email}</div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                          className="text-xs px-2 py-1 rounded-md border bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-slate-300 border-slate-300 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-500"
                          onClick={() => onStartChat(c)}
                          title={`Chat with ${c.name}`}
                      >
                          Chat
                      </button>
                      <button
                          className="p-1.5 rounded-md border bg-white dark:bg-slate-600 dark:border-slate-500 dark:text-slate-300 border-slate-300 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-500"
                          onClick={() => onStartEditContact(c)}
                          aria-label={`Edit ${c.name}`}
                      >
                          <PencilIcon className="w-3 h-3" />
                      </button>
                  </div>
                </div>
              )
            ))}
          </div>

          <AddContact onAdd={onAddContact} onImport={onImportContacts} onDeviceSync={onDeviceSync} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;