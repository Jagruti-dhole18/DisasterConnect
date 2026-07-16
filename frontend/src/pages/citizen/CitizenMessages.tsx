import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { citizenNav } from './citizenNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { messagesApi } from '../../data/store';
import type { Message } from '../../types';

export default function CitizenMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const convs = await messagesApi.conversations();
      setConversations(convs);
    } catch (error) {
      toast('Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherId: string) => {
    try {
      const msgs = await messagesApi.between(user!._id, otherId);
      setMessages(msgs);
    } catch (error) {
      toast('Failed to load messages', 'error');
    }
  };

  const handleSelectUser = (conversation: any) => {
    setSelectedUser(conversation);
    loadMessages(conversation._id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      await messagesApi.create({
        sender: user!._id,
        senderName: user!.name,
        recipient: selectedUser._id,
        content: messageText,
      });
      setMessageText('');
      await loadMessages(selectedUser._id);
      await loadConversations();
      toast('Message sent!', 'success');
    } catch (error) {
      toast('Failed to send message', 'error');
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout config={citizenNav}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-sm pl-10 w-full"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Loading...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <motion.button
                      key={conv._id}
                      onClick={() => handleSelectUser(conv)}
                      whileHover={{ x: 4 }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedUser?._id === conv._id
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <p className="font-medium text-sm truncate">{conv.senderName || 'Unknown'}</p>
                      <p className={`text-xs truncate ${selectedUser?._id === conv._id ? 'text-brand-100' : 'text-slate-600 dark:text-slate-400'}`}>
                        {conv.lastMessage || 'No messages'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                          {conv.unreadCount}
                        </span>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Messages Display */}
          <div className="lg:col-span-2">
            <div className="card p-6 h-full flex flex-col">
              {selectedUser ? (
                <>
                  {/* Header */}
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold">{selectedUser.senderName || 'Unknown User'}</h2>
                    <p className="text-xs text-slate-500">Active now</p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    <AnimatePresence mode="wait">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === user!._id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg ${
                                msg.sender === user!._id
                                  ? 'bg-brand-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.sender === user!._id ? 'text-brand-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="input flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="btn-primary p-2.5"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
