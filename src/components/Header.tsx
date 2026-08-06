'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Users, ShieldAlert, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import Image from "next/image";
import logo from "../clueVerse-logo.png";

interface HeaderProps {
  roomCode?: string;
  playerCount?: number;
  maxPlayers?: number;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  roomCode,
  playerCount = 0,
  maxPlayers = 10,
  isConnected,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [copied, setCopied] = useState(false);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full glass-panel sticky top-0 z-40 px-4 py-3 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Image src={logo} alt="ClueVerse Logo" className="pt-1 drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]" width={50} height={50} />
          <div>
            <h1 className="text-xl font-extrabold tracking-wider gradient-text flex items-center gap-1.5">
              ClueVerse <Sparkles className="w-4 h-4 text-accent-cyan inline" />
            </h1>
            <p className="text-xs text-gray-400 font-medium">Secret Word Party Game</p>
          </div>
        </div>

        {/* Room Info & Controls */}
        <div className="flex items-center gap-3">
          {roomCode && (
            <div className="flex items-center gap-2 bg-surface/90 border border-primary-500/30 rounded-xl px-3 py-1.5 shadow-sm">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Room:</span>
              <span className="text-base font-black tracking-widest text-primary-400 font-mono">{roomCode}</span>
              <button
                onClick={handleCopyCode}
                className="p-1 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                title="Copy Room Code"
              >
                {copied ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}

          {roomCode && (
            <div className="hidden sm:flex items-center gap-1.5 bg-surface/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300">
              <Users className="w-4 h-4 text-accent-cyan" />
              <span>{playerCount}/{maxPlayers}</span>
            </div>
          )}

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl glass-panel hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-accent-rose" /> : <Volume2 className="w-5 h-5 text-primary-400" />}
          </button>

          {/* Connection Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-accent-rose animate-ping'
              }`}
            />
            <span className="text-gray-400 font-medium hidden sm:inline">
              {isConnected ? 'Online' : 'Reconnecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
