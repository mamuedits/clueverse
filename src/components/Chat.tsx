'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Smile, Info } from 'lucide-react';
import { ChatMessage, Player } from '@/lib/types';

interface ChatProps {
  messages: ChatMessage[];
  currentPlayer: Player;
  onSendMessage: (text: string) => void;
}

const EMOJI_LIST = ['🕵️‍♂️', '🔍', '🤐', '🤫', '👀', '💡', '🔥', '🤔', '😂', '💀', '👍', '🚩'];

export const Chat: React.FC<ChatProps> = ({ messages, currentPlayer, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojis(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <div className="glass-panel rounded-3xl p-4 flex flex-col h-[520px] lg:h-[620px] border border-white/10 shadow-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-accent-cyan" />
          Discussion Chat
        </h3>
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          Live Banter
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
        {messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500 italic">
            No messages yet. Discuss clues and find the imposter!
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.isSystem) {
              return (
                <div
                  key={msg.id}
                  className="bg-primary-500/10 border border-primary-500/20 text-primary-300 px-3 py-2 rounded-xl text-[11px] font-medium flex items-start gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-primary-400 shrink-0 mt-0.5" />
                  <span>{msg.text}</span>
                </div>
              );
            }

            const isSelf = msg.playerId === currentPlayer.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="font-bold text-[11px] text-gray-300">
                    {msg.playerName}
                  </span>
                  {isSelf && (
                    <span className="text-[9px] bg-accent-cyan/20 text-accent-cyan px-1 rounded font-bold">
                      You
                    </span>
                  )}
                  <span className="text-[9px] text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[85%] break-words leading-relaxed ${
                    isSelf
                      ? 'bg-gradient-to-r from-primary-600 to-accent-blue text-white rounded-tr-none shadow-md'
                      : 'bg-surface text-gray-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker Popup */}
      {showEmojis && (
        <div className="absolute bottom-16 right-4 glass-panel p-2.5 rounded-2xl border border-white/20 shadow-2xl grid grid-cols-4 gap-1.5 z-20">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="text-lg hover:bg-white/10 p-1.5 rounded-xl transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Form */}
      <form onSubmit={handleSend} className="mt-3 flex gap-2 pt-3 border-t border-white/10 relative">
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="p-2.5 rounded-xl bg-surface hover:bg-surface-hover text-gray-400 hover:text-white border border-white/10 transition-colors"
          title="Add Emojis"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          type="text"
          maxLength={120}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Chat with everyone..."
          className="flex-1 bg-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="btn-primary p-2.5 rounded-xl text-white disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
