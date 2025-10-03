import React from 'react';
import type { Conversation, ChatMessage, Contact } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  chatMessages: ChatMessage[];
  contacts: Contact[];
  currentAccountEmail: string;
  selectedConversationId: string | null;
  onConversationSelect: (id: string) => void;
}

const ConversationListItem: React.FC<{
  conversation: Conversation;
  lastMessage: ChatMessage | undefined;
  participant: Contact | undefined;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ conversation, lastMessage, participant, isSelected, onSelect }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <li
      className={`p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
        isSelected ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
      }`}
      onClick={() => onSelect(conversation.id)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 flex-shrink-0">
          {participant ? getInitials(participant.name) : '?'}
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">
            {participant?.name || 'Unknown Contact'}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
            {lastMessage?.text || 'No messages yet'}
          </div>
        </div>
      </div>
    </li>
  );
};

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  chatMessages,
  contacts,
  currentAccountEmail,
  selectedConversationId,
  onConversationSelect,
}) => {

  const getConversationDetails = (conv: Conversation) => {
    const participantEmail = conv.participantEmails.find(e => e !== currentAccountEmail);
    const participant = contacts.find(c => c.email === participantEmail);
    const messagesInConv = chatMessages
      .filter(m => m.conversationId === conv.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const lastMessage = messagesInConv[0];
    return { participant, lastMessage };
  };

  return (
    <section className="col-span-1 lg:col-span-4 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl font-bold px-1 text-slate-800 dark:text-slate-100">Conversations</h2>
      </div>
      <ul className="space-y-2 overflow-y-auto flex-grow pr-1 -mr-1">
        {conversations.length === 0 ? (
          <li className="text-center text-slate-500 dark:text-slate-400 pt-10">No conversations. Start one from the contacts list.</li>
        ) : (
          conversations.map((c) => {
            const { participant, lastMessage } = getConversationDetails(c);
            return (
              <ConversationListItem
                key={c.id}
                conversation={c}
                lastMessage={lastMessage}
                participant={participant}
                isSelected={selectedConversationId === c.id}
                onSelect={onConversationSelect}
              />
            )
          })
        )}
      </ul>
    </section>
  );
};

export default ConversationList;
