import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, ChatMessage, Contact } from '../types';
import { PhoneIcon, VideoIcon, SendIcon, MessageSquareIcon } from './icons';

interface ChatViewProps {
  conversation: Conversation | null;
  messages: ChatMessage[];
  contacts: Contact[];
  currentAccountEmail: string;
  onSendMessage: (conversationId: string, text: string) => void;
  onStartCall: (contact: Contact, type: 'audio' | 'video') => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  messages,
  contacts,
  currentAccountEmail,
  onSendMessage,
  onStartCall,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const participantEmail = conversation?.participantEmails.find(e => e !== currentAccountEmail);
  const participant = contacts.find(c => c.email === participantEmail);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (newMessage.trim() && conversation) {
      onSendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
    }
  };

  if (!conversation || !participant) {
    return (
      <section className="hidden lg:flex col-span-1 lg:col-span-8 p-6 items-center justify-center h-full">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <MessageSquareIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-medium">Select a conversation</h2>
          <p>Choose a conversation from the list to start chatting.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="col-span-1 lg:col-span-8 h-full flex flex-col">
      <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{participant.name}</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => onStartCall(participant, 'audio')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <PhoneIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <button onClick={() => onStartCall(participant, 'video')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <VideoIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </header>
      
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.senderEmail === currentAccountEmail ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-md ${
              msg.senderEmail === currentAccountEmail
                ? 'bg-sky-600 text-white rounded-br-none'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
            }`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
          <button
            onClick={handleSend}
            className="p-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors disabled:bg-sky-300 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </section>
  );
};

export default ChatView;
