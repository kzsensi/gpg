import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Circle,
  Check,
  CheckCheck,
  Image as ImageIcon,
} from 'lucide-react';

/* ───────────────────── mock data ───────────────────── */
const conversations = [
  {
    id: 1,
    name: 'Priya Sharma',
    avatar: 'PS',
    avatarBg: 'bg-indigo-500',
    online: true,
    lastMessage: 'Sure, 5 PM works for the demo class!',
    lastTime: '2:34 PM',
    unread: 2,
    messages: [
      { id: 1, from: 'them', text: 'Hi! I saw your profile for Vedic Maths tutoring.', time: '2:10 PM' },
      { id: 2, from: 'me', text: 'Hello Priya! Yes, I teach Vedic Maths for classes 5-10. Would you like to schedule a demo?', time: '2:12 PM' },
      { id: 3, from: 'them', text: 'Yes please! My son is in class 7 and struggling with multiplication.', time: '2:18 PM' },
      { id: 4, from: 'me', text: 'No worries, Vedic Maths makes multiplication very easy. I can show some tricks in the demo itself.', time: '2:22 PM' },
      { id: 5, from: 'them', text: 'That sounds great! When are you available?', time: '2:28 PM' },
      { id: 6, from: 'them', text: 'Sure, 5 PM works for the demo class!', time: '2:34 PM' },
    ],
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    avatar: 'RK',
    avatarBg: 'bg-emerald-500',
    online: false,
    lastMessage: 'Can we reschedule to Thursday?',
    lastTime: '12:15 PM',
    unread: 0,
    messages: [
      { id: 1, from: 'me', text: 'Hi Rajesh, reminding you about tomorrow\'s Tabla class at 4 PM.', time: '11:00 AM' },
      { id: 2, from: 'them', text: 'Hi, I was about to message you about that.', time: '11:45 AM' },
      { id: 3, from: 'them', text: 'My daughter has a school function tomorrow.', time: '11:46 AM' },
      { id: 4, from: 'them', text: 'Can we reschedule to Thursday?', time: '12:15 PM' },
      { id: 5, from: 'me', text: 'Thursday works! Same time – 4 PM?', time: '12:20 PM' },
    ],
  },
  {
    id: 3,
    name: 'Ananya Iyer',
    avatar: 'AI',
    avatarBg: 'bg-rose-500',
    online: true,
    lastMessage: 'Thank you so much! The painting turned out beautiful 🎨',
    lastTime: 'Yesterday',
    unread: 1,
    messages: [
      { id: 1, from: 'them', text: 'Good morning! Just wanted to share my daughter\'s progress painting from yesterday.', time: '9:00 AM' },
      { id: 2, from: 'me', text: 'Good morning Ananya! Please share, I\'d love to see it.', time: '9:05 AM' },
      { id: 3, from: 'them', text: 'She used the watercolour techniques you taught last week. The sunset landscape looks amazing!', time: '9:12 AM' },
      { id: 4, from: 'me', text: 'That\'s wonderful! She\'s really picking up the gradient blending quickly. Very talented!', time: '9:18 AM' },
      { id: 5, from: 'them', text: 'She wants to learn oil pastels next. Is that possible in the coming sessions?', time: '9:25 AM' },
      { id: 6, from: 'them', text: 'Thank you so much! The painting turned out beautiful 🎨', time: '9:30 AM' },
    ],
  },
];

/* ───────────────────── component ───────────────────── */
const ChatPage = () => {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState(
    conversations.reduce((acc, c) => ({ ...acc, [c.id]: [...c.messages] }), {})
  );
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChat]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: messageText.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
    setChatMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    }));
    setMessageText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectConversation = (conv) => {
    setActiveChat(conv);
    setShowSidebar(false);
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = chatMessages[activeChat.id] || [];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <TopNavigation />

      {/* main chat area */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        {/* ──── sidebar ──── */}
        <aside
          className={`${
            showSidebar ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex-shrink-0`}
        >
          {/* sidebar header */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Messages</h2>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <MoreVertical size={18} className="text-slate-500" />
              </button>
            </div>
            {/* search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b5ed7]/30 focus:border-[#0b5ed7] transition-all"
              />
            </div>
          </div>

          {/* conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left ${
                  activeChat.id === conv.id ? 'bg-blue-50/70 border-r-[3px] border-[#0b5ed7]' : ''
                }`}
              >
                {/* avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${conv.avatarBg}`}
                  >
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900 truncate">{conv.name}</span>
                    <span className="text-[11px] text-slate-400 ml-2 flex-shrink-0">{conv.lastTime}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>

                {/* unread badge */}
                {conv.unread > 0 && (
                  <span className="bg-[#0b5ed7] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* ──── chat panel ──── */}
        <main
          className={`${
            showSidebar ? 'hidden' : 'flex'
          } md:flex flex-col flex-1 bg-[#F0F2F5]`}
        >
          {/* chat header */}
          <div className="flex items-center gap-3 px-4 md:px-6 py-3.5 bg-white border-b border-slate-200 shadow-sm">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${activeChat.avatarBg}`}
              >
                {activeChat.avatar}
              </div>
              {activeChat.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-[15px]">{activeChat.name}</h3>
              <p className="text-xs text-emerald-500 font-medium">
                {activeChat.online ? 'Online' : 'Last seen recently'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Phone size={18} className="text-slate-500" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Video size={18} className="text-slate-500" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <MoreVertical size={18} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-1">
            {/* date pill */}
            <div className="flex justify-center mb-4">
              <span className="bg-white/90 text-slate-500 text-[11px] font-medium px-4 py-1 rounded-full shadow-sm">
                Today
              </span>
            </div>

            {currentMessages.map((msg) => {
              const isMine = msg.from === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'} chat-bubble-enter`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl shadow-sm ${
                      isMine
                        ? 'bg-[#0b5ed7] text-white rounded-br-md'
                        : 'bg-white text-slate-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-[14px] leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 ${
                        isMine ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      <span className="text-[10px]">{msg.time}</span>
                      {isMine && <CheckCheck size={14} />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* message input */}
          <div className="px-4 md:px-6 py-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0">
                <Smile size={22} className="text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0">
                <Paperclip size={20} className="text-slate-400" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b5ed7]/30 focus:border-[#0b5ed7] transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
                  messageText.trim()
                    ? 'bg-[#0b5ed7] text-white shadow-md hover:bg-blue-700 scale-100'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
