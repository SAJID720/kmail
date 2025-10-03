
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Message, SearchFilters, Thread } from '../types';
import MessageListItem from './MessageListItem';
import { FilterIcon } from './icons';

interface MessageListProps {
  threads: Thread[];
  allMessages: Message[];
  selectedThreadId: string | null;
  onThreadSelect: (id: string) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters | ((prev: SearchFilters) => SearchFilters)) => void;
  onToggleThreadStar: (id: string) => void;
  onToggleThreadArchive: (id: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  threads,
  allMessages,
  selectedThreadId,
  onThreadSelect,
  searchFilters,
  setSearchFilters,
  onToggleThreadStar,
  onToggleThreadArchive,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({ query: "", from: "", subject: "", startDate: "", endDate: "" });
  };

  const suggestions = useMemo(() => {
    if (!allMessages) return [];
    const subjects = allMessages.map(m => m.subject).filter(Boolean);
    const senders = allMessages.map(m => m.from);
    const recipients = allMessages.map(m => m.to);
    return [...new Set([...subjects, ...senders, ...recipients])];
  }, [allMessages]);

  const filteredSuggestions = useMemo(() => {
    const query = searchFilters.query.toLowerCase();
    if (query) {
      return suggestions
        .filter(s => s.toLowerCase().includes(query))
        .slice(0, 5);
    }
    return suggestions.slice(0, 5);
  }, [suggestions, searchFilters.query]);
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchFilters(prev => ({ ...prev, query: suggestion }));
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveAdvancedFilters = searchFilters.from || searchFilters.subject || searchFilters.startDate || searchFilters.endDate;

  return (
    <section className="col-span-1 lg:col-span-4 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex-shrink-0 mb-4" ref={searchContainerRef}>
        <div className="flex gap-2 items-center">
            <div className="relative w-full">
                <input
                  name="query"
                  value={searchFilters.query}
                  onChange={handleFilterChange}
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                  placeholder="Search mail..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition bg-white dark:bg-slate-800 dark:text-slate-200"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 max-h-60 overflow-y-auto">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li key={index}>
                                <button
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSuggestionClick(suggestion);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm truncate text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    title={suggestion}
                                >
                                    {suggestion}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-2 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors relative ${
                    showAdvanced || hasActiveAdvancedFilters ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                aria-label="Toggle advanced filters"
            >
                <FilterIcon className="w-5 h-5" />
                {hasActiveAdvancedFilters && !showAdvanced && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-sky-500 transform -translate-y-1/2 translate-x-1/2 ring-2 ring-white dark:ring-slate-800"></span>}
            </button>
        </div>
        
        {showAdvanced && (
            <div className="p-4 mt-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                        <label htmlFor="from" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">From</label>
                        <input id="from" name="from" value={searchFilters.from} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" />
                    </div>
                     <div>
                        <label htmlFor="subject" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Subject</label>
                        <input id="subject" name="subject" value={searchFilters.subject} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                        <input type="date" id="startDate" name="startDate" value={searchFilters.startDate} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" />
                    </div>
                     <div>
                        <label htmlFor="endDate" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">End Date</label>
                        <input type="date" id="endDate" name="endDate" value={searchFilters.endDate} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" />
                    </div>
                </div>
                <button onClick={clearFilters} className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md">
                    Clear Filters
                </button>
            </div>
        )}

        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">{threads.length} conversations found</div>
      </div>
      <ul className="space-y-2 overflow-y-auto flex-grow pr-1 -mr-1">
        {threads.length === 0 ? (
          <li className="text-center text-slate-500 dark:text-slate-400 pt-10">No messages match your search.</li>
        ) : (
          threads.map((thread) => {
            const threadId = thread[0].threadId || thread[0].id;
            return (
              <MessageListItem
                key={threadId}
                thread={thread}
                isSelected={selectedThreadId === threadId}
                onSelect={onThreadSelect}
                onToggleStar={onToggleThreadStar}
                onToggleArchive={onToggleThreadArchive}
              />
            )
          })
        )}
      </ul>
    </section>
  );
};

export default MessageList;