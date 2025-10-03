
import React from 'react';
import type { Message, Thread } from '../types';
import { StarIcon, ArchiveIcon } from './icons';

interface MessageListItemProps {
    thread: Thread;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onToggleStar: (id: string) => void;
    onToggleArchive: (id: string) => void;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ thread, isSelected, onSelect, onToggleStar, onToggleArchive }) => {
    
    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }

    const latestMessage = thread[thread.length - 1];
    const threadId = latestMessage.threadId || latestMessage.id;
    const isUnread = thread.some(m => !m.read);
    const isStarred = thread.some(m => m.starred);

    const participants = [...new Set(thread.map(m => m.from))].slice(0, 3).join(', ');

    return (
        <li
            className={`group p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                isSelected ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
            }`}
            onClick={() => onSelect(threadId)}
        >
            <div className="flex justify-between items-start">
                <div className="flex-grow overflow-hidden">
                    <div className="flex items-baseline gap-2">
                        {isUnread && <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></div>}
                        <div className={`font-semibold text-slate-800 dark:text-slate-100 truncate ${!isUnread ? 'font-medium' : 'font-bold'}`}>
                            {latestMessage.subject || '(No subject)'}
                        </div>
                        {thread.length > 1 && <span className="text-xs font-bold text-slate-500 dark:text-slate-400">({thread.length})</span>}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 truncate">{participants}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">{latestMessage.body}</div>
                </div>
                <div className="flex-shrink-0 ml-4 flex flex-col items-end gap-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                       {new Date(latestMessage.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={(e) => handleActionClick(e, () => onToggleStar(threadId))} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                            <StarIcon className={`w-4 h-4 transition-colors ${isStarred ? 'fill-yellow-400 text-yellow-500' : ''}`} />
                         </button>
                         <button onClick={(e) => handleActionClick(e, () => onToggleArchive(threadId))} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                             <ArchiveIcon className="w-4 h-4" />
                         </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default MessageListItem;