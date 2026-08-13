'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Landing } from '@/components/Landing';
import { Lobby } from '@/components/Lobby';
import { GameView } from '@/components/GameView';
import { Voting } from '@/components/Voting';
import { Results } from '@/components/Results';
import { Chat } from '@/components/Chat';
import { OfflineContainer } from '@/components/offline/OfflineContainer';
import { getSocket } from '@/lib/socket';
import { soundManager } from '@/lib/audio';
import { Room, Player } from '@/lib/types';
import { MessageSquare, X, Trophy } from 'lucide-react';

export default function Home() {
  const [appMode, setAppMode] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [isOfflineActive, setIsOfflineActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [finalStandings, setFinalStandings] = useState<{ name: string; score: number }[] | null>(null);

  const prevRoomState = useRef<string | null>(null);
  const prevTurnIndex = useRef<number | null>(null);
  const prevPlayerCount = useRef<number>(0);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('kicked', () => {
      setRoom(null);
      setCurrentPlayer(null);
      setError('You were removed from the room by the host.');
    });

    socket.on('room_closed', ({ message, standings }: { message: string; standings: { name: string; score: number }[] }) => {
      setRoom(null);
      setCurrentPlayer(null);
      setFinalStandings(standings);
      setError(message);
    });

    socket.on('room_updated', (updatedRoom: Room) => {
      if (!updatedRoom) return;

      setRoom(updatedRoom);

      // Find self in room
      const self = updatedRoom.players.find((p) => p.socketId === socket.id);
      if (self) {
        setCurrentPlayer(self);
      }

      // Audio triggers for game transitions
      if (prevRoomState.current !== updatedRoom.state) {
        if (updatedRoom.state === 'GAME_ROUND') {
          soundManager.playRoundStart();
        } else if (updatedRoom.state === 'VOTING') {
          soundManager.playVoteCast();
        }
        prevRoomState.current = updatedRoom.state;
      }

      // Turn change audio
      if (updatedRoom.state === 'GAME_ROUND' && prevTurnIndex.current !== updatedRoom.currentTurnIndex) {
        soundManager.playTurnChange();
        prevTurnIndex.current = updatedRoom.currentTurnIndex;
      }

      // Player count join/leave audio
      if (prevPlayerCount.current > 0) {
        if (updatedRoom.players.length > prevPlayerCount.current) {
          soundManager.playJoin();
        } else if (updatedRoom.players.length < prevPlayerCount.current) {
          soundManager.playLeave();
        }
      }
      prevPlayerCount.current = updatedRoom.players.length;
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('kicked');
      socket.off('room_closed');
      socket.off('room_updated');
    };
  }, []);

  // 1. Create Room
  const handleCreateRoom = (playerName: string, maxPlayers: number, numImposters: number) => {
    const socket = getSocket();
    setError(null);
    setFinalStandings(null);

    socket.emit(
      'create_room',
      { playerName, maxPlayers, numImposters },
      (response: { success: boolean; roomCode?: string; player?: Player; roomData?: Room; error?: string }) => {
        if (response.success && response.roomData && response.player) {
          setRoom(response.roomData);
          setCurrentPlayer(response.player);
          soundManager.playJoin();
        } else {
          setError(response.error || 'Failed to create room.');
        }
      }
    );
  };

  // 2. Join Room
  const handleJoinRoom = (playerName: string, roomCode: string) => {
    const socket = getSocket();
    setError(null);
    setFinalStandings(null);

    socket.emit(
      'join_room',
      { roomCode, playerName },
      (response: { success: boolean; roomCode?: string; player?: Player; roomData?: Room; error?: string }) => {
        if (response.success && response.roomData && response.player) {
          setRoom(response.roomData);
          setCurrentPlayer(response.player);
          soundManager.playJoin();
        } else {
          setError(response.error || 'Failed to join room.');
        }
      }
    );
  };

  // 3. Host Actions
  const handleStartGame = () => {
    if (!room) return;
    const socket = getSocket();
    socket.emit('start_game', { roomCode: room.code }, (res: { success: boolean; error?: string }) => {
      if (!res.success) setError(res.error || 'Could not start game.');
    });
  };

  const handleUpdateSettings = (numImposters: number, maxPlayers: number) => {
    if (!room) return;
    getSocket().emit('update_settings', { roomCode: room.code, numImposters, maxPlayers });
  };

  const handleToggleLock = () => {
    if (!room) return;
    getSocket().emit('toggle_lock', { roomCode: room.code });
  };

  const handleKickPlayer = (targetPlayerId: string) => {
    if (!room) return;
    getSocket().emit('kick_player', { roomCode: room.code, targetPlayerId });
  };

  const handleEditPlayerName = (targetPlayerId: string, newName: string) => {
    if (!room) return;
    getSocket().emit('edit_player_name', { roomCode: room.code, targetPlayerId, newName });
  };

  const handleCloseRoom = () => {
    if (!room) return;
    getSocket().emit('close_room', { roomCode: room.code });
  };

  // 4. Gameplay Actions
  const handleSubmitClue = (text: string) => {
    if (!room) return;
    getSocket().emit('submit_clue', { roomCode: room.code, text }, (res: { success: boolean; error?: string }) => {
      if (!res.success) setError(res.error || 'Failed to submit clue.');
    });
  };

  const handleSubmitVote = (targetPlayerId: string) => {
    if (!room) return;
    getSocket().emit('submit_vote', { roomCode: room.code, targetPlayerId });
    soundManager.playVoteCast();
  };

  const handlePlayAgain = () => {
    if (!room) return;
    getSocket().emit('play_again', { roomCode: room.code });
  };

  const handleSendMessage = (text: string) => {
    if (!room) return;
    getSocket().emit('send_chat', { roomCode: room.code, text });
  };

  const handleLeaveRoom = () => {
    setRoom(null);
    setCurrentPlayer(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        roomCode={room?.code}
        playerCount={room?.players.length}
        maxPlayers={room?.maxPlayers}
        isConnected={isConnected}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Final Standings Overlay after Host Closes Lobby */}
        {finalStandings && !room && (
          <div className="max-w-md mx-auto mb-8 glass-panel-glow p-6 rounded-3xl text-center space-y-4 border-accent-amber/40">
            <div className="flex justify-center">
              <Trophy className="w-12 h-12 text-accent-amber" />
            </div>
            <h3 className="text-2xl font-black text-white">Final Lobby Leaderboard</h3>
            <p className="text-xs text-gray-400">The host closed the game lobby. Here are the final scores:</p>
            <div className="space-y-2 text-left">
              {finalStandings.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center bg-surface p-3 rounded-xl border border-white/5 text-xs">
                  <span className="font-bold text-white">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`} {p.name}
                  </span>
                  <span className="font-black text-accent-amber">{p.score} pts</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setFinalStandings(null)}
              className="btn-primary py-2.5 px-6 text-xs font-bold w-full"
            >
              Back to Main Menu
            </button>
          </div>
        )}

        {appMode === 'OFFLINE' && isOfflineActive ? (
          <OfflineContainer onBackToHome={() => setIsOfflineActive(false)} />
        ) : !room || !currentPlayer ? (
          <Landing
            appMode={appMode}
            onModeChange={(mode) => {
              setAppMode(mode);
              setIsOfflineActive(false);
            }}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onStartOfflineGame={() => setIsOfflineActive(true)}
            error={error}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Columns: Game Views (Lobby / Game / Voting / Results) */}
            <div className="lg:col-span-2">
              {room.state === 'LOBBY' && (
                <Lobby
                  room={room}
                  currentPlayer={currentPlayer}
                  onStartGame={handleStartGame}
                  onUpdateSettings={handleUpdateSettings}
                  onToggleLock={handleToggleLock}
                  onKickPlayer={handleKickPlayer}
                  onEditPlayerName={handleEditPlayerName}
                  onCloseRoom={handleCloseRoom}
                />
              )}

              {room.state === 'GAME_ROUND' && (
                <GameView room={room} currentPlayer={currentPlayer} onSubmitClue={handleSubmitClue} />
              )}

              {room.state === 'VOTING' && (
                <Voting room={room} currentPlayer={currentPlayer} onSubmitVote={handleSubmitVote} />
              )}

              {room.state === 'RESULTS' && (
                <Results
                  room={room}
                  currentPlayer={currentPlayer}
                  onPlayAgain={handlePlayAgain}
                  onLeaveRoom={handleLeaveRoom}
                  onCloseRoom={handleCloseRoom}
                />
              )}
            </div>

            {/* Right Column: Permanent Discussion Chat (Desktop) */}
            <div className="hidden lg:block lg:col-span-1 sticky top-20">
              <Chat
                messages={room.chatMessages}
                currentPlayer={currentPlayer}
                onSendMessage={handleSendMessage}
              />
            </div>

            {/* Mobile Chat Trigger & Floating Panel */}
            <div className="lg:hidden fixed bottom-5 right-5 z-50">
              <button
                onClick={() => setShowMobileChat(!showMobileChat)}
                className="btn-primary p-4 rounded-full shadow-2xl flex items-center justify-center text-white"
              >
                {showMobileChat ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
              </button>
            </div>

            {showMobileChat && (
              <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md p-4 flex flex-col justify-end">
                <div className="relative">
                  <Chat
                    messages={room.chatMessages}
                    currentPlayer={currentPlayer}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
