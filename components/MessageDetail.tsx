
import React, { useState, useEffect } from 'react';
import type { Message, Folder, Thread } from '../types';
import { generateSmartReplies } from '../services/geminiService';
import { StarIcon, ArchiveIcon, TrashIcon, SparklesIcon, InboxIcon } from './icons';

interface MessageDetailProps {
  thread: Thread | null;
  selectedFolder: Folder;
  onToggleThreadStar: (threadId: string) => void;
  onToggleThreadArchive: (threadId: string) => void;
  onMoveThreadToTrash: (threadId: string) => void;
  onRestoreThreadFromTrash: (threadId: string) => void;
  onDeleteThreadPermanently: (threadId: string) => void;
  onReply: (body: string, messageToReplyTo: Message) => void;
}

const ActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}> = ({ onClick, children, variant = 'default' }) => {
  const baseClasses = "flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors";
  const variantClasses = {
    default: "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600",
    danger: "border-red-300 dark:border-red-500/50 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10",
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};

const MessageCard: React.FC<{ message: Message }> = ({ message }) => {
    return (
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <div className="font-semibold text-slate-700 dark:text-slate-200">{message.from}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">to {message.to}</div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(message.date).toLocaleString()}</div>
            </div>
            <pre className="text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">{message.body}</pre>
        </div>
    );
};


const MessageDetail: React.FC<MessageDetailProps> = ({
  thread,
  selectedFolder,
  onToggleThreadStar,
  onToggleThreadArchive,
  onMoveThreadToTrash,
  onRestoreThreadFromTrash,
  onDeleteThreadPermanently,
  onReply,
}) => {
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const lastMessage = thread ? thread[thread.length - 1] : null;

  useEffect(() => {
    if (lastMessage) {
      setIsLoadingReplies(true);
      setSmartReplies([]);
      generateSmartReplies(lastMessage)
        .then(setSmartReplies)
        .finally(() => setIsLoadingReplies(false));
    }
  }, [lastMessage]);


  if (!thread || !lastMessage) {
    return (
      <section className="hidden lg:flex col-span-1 lg:col-span-8 p-6 items-center justify-center h-full">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <InboxIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-medium">Select a conversation</h2>
          <p>Choose a conversation from the list to read its content.</p>
        </div>
      </section>
    );
  }
  
  const threadId = lastMessage.threadId || lastMessage.id;
  const isStarred = thread.some(m => m.starred);
  const isArchived = thread.every(m => m.archived);

  return (
    <section className="col-span-1 lg:col-span-8 p-6 h-full flex flex-col overflow-y-auto">
      <div className="flex-shrink-0">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{lastMessage.subject || '(No subject)'}</h2>
        </div>

        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-700 flex-wrap">
          {selectedFolder === 'trash' ? (
              <>
                <ActionButton onClick={() => onRestoreThreadFromTrash(threadId)}>
                    <InboxIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Move to Inbox</span>
                </ActionButton>
                <ActionButton onClick={() => onDeleteThreadPermanently(threadId)} variant="danger">
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete Forever</span>
                </ActionButton>
              </>
          ) : (
            <>
                <ActionButton onClick={() => onToggleThreadStar(threadId)}>
                    <StarIcon className={`w-4 h-4 ${isStarred ? 'fill-yellow-400 text-yellow-500' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{isStarred ? 'Starred' : 'Star'}</span>
                </ActionButton>
                <ActionButton onClick={() => onToggleThreadArchive(threadId)}>
                    <ArchiveIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>{isArchived ? 'Unarchive' : 'Archive'}</span>
                </ActionButton>
                <ActionButton onClick={() => onMoveThreadToTrash(threadId)} variant="danger">
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                </ActionButton>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-grow mt-6 space-y-4">
        {thread.map(message => <MessageCard key={message.id} message={message} />)}
      </div>

      <div className="flex-shrink-0 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-sky-600" />
            Smart Replies
        </h4>
        {isLoadingReplies && <div className="text-sm text-slate-500 dark:text-slate-400">Generating suggestions...</div>}
        {!isLoadingReplies && smartReplies.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {smartReplies.map((reply, i) => (
                    <button 
                        key={i}
                        onClick={() => onReply(reply, lastMessage)}
                        className="px-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-sky-900/50 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                    >
                        {reply}
                    </button>
                ))}
            </div>
        )}
         {!isLoadingReplies && smartReplies.length === 0 && (
             <div className="text-sm text-slate-500 dark:text-slate-400">No suggestions available for this message.</div>
         )}
      </div>
    </section>
  );
};

export default MessageDetail;