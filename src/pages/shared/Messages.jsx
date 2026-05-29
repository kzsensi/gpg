import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiMessages } from '../../services/api';
import { supabase } from '../../lib/supabase';
import { MessageCircle, Send, User, Clock } from 'lucide-react';

const Messages = ({ type }) => {
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadContacts = async () => {
    try {
      setLoadingContacts(true);
      const data = await apiMessages.getContacts(user.id);
      setContacts(data);
      // Only auto-select if no contact was passed via state
      if (data.length > 0 && !location.state?.contactId) {
        setActiveContact(data[0]);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const loadConversation = async () => {
    try {
      setLoadingMessages(true);
      const data = await apiMessages.getConversation(user.id, activeContact.id);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error('Error loading conversation:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Load contacts and handle incoming navigation state
  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  // Handle incoming contact from navigation state (e.g. clicking "Message Parent" on another page)
  useEffect(() => {
    if (location.state?.contactId && location.state?.contactName) {
      const contact = {
        id: location.state.contactId,
        name: location.state.contactName
      };
      // Check if contact already in list, if not add it temporarily
      setContacts(prev => {
        if (!prev.find(c => c.id === contact.id)) {
          return [contact, ...prev];
        }
        return prev;
      });
      setActiveContact(contact);
    }
  }, [location.state]);

  // Load conversation when activeContact changes
  useEffect(() => {
    if (user && activeContact) {
      loadConversation();
    }
  }, [user, activeContact]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        // We only care about messages where the current user is involved
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        const newMsg = payload.new;
        
        // If the message is from our currently active contact, append it
        if (activeContact && newMsg.sender_id === activeContact.id) {
          setMessages(prev => [...prev, newMsg]);
          scrollToBottom();
        }
        
        // Refresh contacts to update the "last message" snippet
        loadContacts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, activeContact]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const tempMessage = {
      id: Date.now(),
      sender_id: user.id,
      receiver_id: activeContact.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString()
    };

    // Optimistic UI update
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    scrollToBottom();

    try {
      await apiMessages.send(
        user.id, 
        activeContact.id, 
        tempMessage.content,
        user?.user_metadata?.name || 'User',
        type,
        activeContact.name,
        activeContact.role
      );
      // Refresh contacts to update the snippet on the left
      loadContacts();
    } catch (err) {
      console.error('Failed to send message:', err);
      // Optionally remove the optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      alert('Failed to send message');
    }
  };

  const formatTime = (isoString) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(isoString));
  };

  return (
    <DashboardLayout type={type}>
      <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Left Sidebar: Contacts */}
        <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${activeContact ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <MessageCircle size={20} className="text-[#0b5ed7]" /> Messages
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingContacts ? (
              <div className="p-4 space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-100 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MessageCircle size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium">No messages yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveContact(contact)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${activeContact?.id === contact.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-slate-900 truncate">{contact.name}</h4>
                        {contact.time && <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{formatTime(contact.time)}</span>}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{contact.lastMessage || 'Start a conversation'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Chat Window */}
        <div className={`flex-1 flex flex-col ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <button 
                  onClick={() => setActiveContact(null)}
                  className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  <User size={20} /> {/* Placeholder for back arrow */}
                </button>
                <div className="w-10 h-10 rounded-full bg-[#0b5ed7] text-white font-bold flex items-center justify-center shrink-0">
                  {activeContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{activeContact.name}</h3>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
                {loadingMessages ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[#0b5ed7] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => {
                      const isMe = msg.sender_id === user.id;
                      return (
                        <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                            isMe 
                              ? 'bg-[#0b5ed7] text-white rounded-tr-sm' 
                              : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                          }`}>
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMe ? 'text-blue-200 justify-end' : 'text-slate-400'}`}>
                              <Clock size={10} /> {formatTime(msg.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm outline-none focus:border-[#0b5ed7] focus:ring-1 focus:ring-[#0b5ed7]"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 rounded-full bg-[#0b5ed7] text-white flex items-center justify-center shrink-0 hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Send size={18} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <MessageCircle size={48} className="mb-4 text-slate-200" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Your Messages</h3>
              <p className="text-sm">Select a conversation from the sidebar or click 'Message' on a profile to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
