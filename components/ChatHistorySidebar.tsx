import React from 'react';
import { MOCK_CHAT_HISTORY } from '../constants';
import { Search, Trash2, History, PlusCircle } from './Icons';

interface ChatHistorySidebarProps {
  activeChatId: string;
  onSelectChat: (id: string) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ activeChatId, onSelectChat }) => {
  const history = MOCK_CHAT_HISTORY;

  return (
    <aside className="w-[300px] flex-shrink-0 bg-bg-card border-r border-border-subtle flex flex-col h-full">
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-text-main flex items-center gap-2">
            <History size={18} />
            Chat History
          </h2>
          <button className="text-text-muted hover:text-text-main transition-colors">
            <PlusCircle size={20} />
          </button>
        </div>
        <button
          className="w-full text-left bg-bg-main text-text-main font-medium px-4 py-2.5 rounded-lg text-sm border border-border-subtle hover:bg-gray-200 transition-colors"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="p-2 flex items-center justify-between">
            <div className="relative flex-1">
                <input 
                    type="text" 
                    placeholder="Search chats..."
                    className="w-full bg-bg-main border border-border-subtle rounded-md py-1.5 pl-8 pr-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            </div>
            <button className="text-text-muted hover:text-text-main p-1 ml-2 rounded-md">
                <Trash2 size={14} />
            </button>
        </div>

        <nav className="flex flex-col gap-4 px-2 mt-2">
          {Object.entries(history).map(([date, chats]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">{date}</h3>
              <ul className="space-y-1">
                {chats.map(chat => (
                  <li key={chat.id}>
                    <button 
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors ${
                        activeChatId === chat.id 
                          ? 'bg-accent-light text-primary-dark font-medium'
                          : 'text-text-main hover:bg-bg-main'
                      }`}
                    >
                      {chat.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default ChatHistorySidebar;