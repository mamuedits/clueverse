const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// Curated Word Pair Bank & AI Generator Engine
const WORD_DICTIONARY = [
  { civilianWord: 'Apple', imposterWord: 'Mango', category: 'Fruits' },
  { civilianWord: 'Coffee', imposterWord: 'Tea', category: 'Beverages' },
  { civilianWord: 'Pizza', imposterWord: 'Burger', category: 'Fast Food' },
  { civilianWord: 'Pancake', imposterWord: 'Waffle', category: 'Breakfast' },
  { civilianWord: 'Chocolate', imposterWord: 'Ice Cream', category: 'Desserts' },
  { civilianWord: 'Sushi', imposterWord: 'Ramen', category: 'Asian Cuisine' },
  { civilianWord: 'Cake', imposterWord: 'Cupcake', category: 'Bakery' },
  { civilianWord: 'Lemon', imposterWord: 'Lime', category: 'Citrus Fruits' },
  { civilianWord: 'Donut', imposterWord: 'Bagel', category: 'Bakery' },
  { civilianWord: 'Popcorn', imposterWord: 'Potato Chips', category: 'Snacks' },
  { civilianWord: 'Milk', imposterWord: 'Smoothie', category: 'Beverages' },
  { civilianWord: 'Pasta', imposterWord: 'Noodles', category: 'Carbs' },
  { civilianWord: 'Taco', imposterWord: 'Burrito', category: 'Mexican Food' },
  { civilianWord: 'Butter', imposterWord: 'Cheese', category: 'Dairy' },
  { civilianWord: 'Lion', imposterWord: 'Tiger', category: 'Wild Cats' },
  { civilianWord: 'Dolphin', imposterWord: 'Whale', category: 'Marine Life' },
  { civilianWord: 'Falcon', imposterWord: 'Eagle', category: 'Birds of Prey' },
  { civilianWord: 'Crocodile', imposterWord: 'Alligator', category: 'Reptiles' },
  { civilianWord: 'Frog', imposterWord: 'Toad', category: 'Amphibians' },
  { civilianWord: 'Horse', imposterWord: 'Zebra', category: 'Mammals' },
  { civilianWord: 'Penguin', imposterWord: 'Puffin', category: 'Antarctic Birds' },
  { civilianWord: 'Bee', imposterWord: 'Wasp', category: 'Insects' },
  { civilianWord: 'Butterfly', imposterWord: 'Moth', category: 'Insects' },
  { civilianWord: 'Wolf', imposterWord: 'Fox', category: 'Canines' },
  { civilianWord: 'Cheetah', imposterWord: 'Leopard', category: 'Wild Cats' },
  { civilianWord: 'Owl', imposterWord: 'Hawk', category: 'Birds' },
  { civilianWord: 'Beach', imposterWord: 'Desert', category: 'Landscapes' },
  { civilianWord: 'Mountain', imposterWord: 'Hill', category: 'Topography' },
  { civilianWord: 'Hospital', imposterWord: 'Pharmacy', category: 'Healthcare Facilities' },
  { civilianWord: 'Airport', imposterWord: 'Railway Station', category: 'Transit Hubs' },
  { civilianWord: 'Cinema', imposterWord: 'Theater', category: 'Entertainment Venues' },
  { civilianWord: 'Museum', imposterWord: 'Art Gallery', category: 'Cultural Venues' },
  { civilianWord: 'Hotel', imposterWord: 'Resort', category: 'Accommodation' },
  { civilianWord: 'Library', imposterWord: 'Bookstore', category: 'Reading Hubs' },
  { civilianWord: 'Gym', imposterWord: 'Stadium', category: 'Sports Venues' },
  { civilianWord: 'Castle', imposterWord: 'Palace', category: 'Historic Buildings' },
  { civilianWord: 'Forest', imposterWord: 'Jungle', category: 'Ecosystems' },
  { civilianWord: 'Laptop', imposterWord: 'Computer', category: 'Computing' },
  { civilianWord: 'Smartphone', imposterWord: 'Tablet', category: 'Mobile Devices' },
  { civilianWord: 'Headphones', imposterWord: 'Earbuds', category: 'Audio' },
  { civilianWord: 'Television', imposterWord: 'Projector', category: 'Displays' },
  { civilianWord: 'Camera', imposterWord: 'Camcorder', category: 'Media Equipment' },
  { civilianWord: 'Keyboard', imposterWord: 'Typewriter', category: 'Input Devices' },
  { civilianWord: 'Smartwatch', imposterWord: 'Fitness Band', category: 'Wearables' },
  { civilianWord: 'Drone', imposterWord: 'Helicopter', category: 'Aircraft' },
  { civilianWord: 'Football', imposterWord: 'Cricket', category: 'Team Sports' },
  { civilianWord: 'Tennis', imposterWord: 'Badminton', category: 'Racket Sports' },
  { civilianWord: 'Basketball', imposterWord: 'Volleyball', category: 'Ball Sports' },
  { civilianWord: 'Chess', imposterWord: 'Checkers', category: 'Board Games' },
  { civilianWord: 'Skateboard', imposterWord: 'Rollerblades', category: 'Urban Sports' },
  { civilianWord: 'Guitar', imposterWord: 'Violin', category: 'Musical Instruments' },
  { civilianWord: 'Piano', imposterWord: 'Organ', category: 'Keyboards' },
  { civilianWord: 'Backpack', imposterWord: 'Suitcase', category: 'Luggage' },
  { civilianWord: 'Sunglasses', imposterWord: 'Eyeglasses', category: 'Eyewear' },
  { civilianWord: 'Pen', imposterWord: 'Pencil', category: 'Stationery' },
  { civilianWord: 'Umbrella', imposterWord: 'Raincoat', category: 'Weather Gear' },
  { civilianWord: 'Sofa', imposterWord: 'Armchair', category: 'Furniture' },
  { civilianWord: 'Mirror', imposterWord: 'Window', category: 'Household Glass' }
];

function generateWordPair() {
  const pair = WORD_DICTIONARY[Math.floor(Math.random() * WORD_DICTIONARY.length)];
  const swap = Math.random() > 0.5;
  return {
    civilianWord: swap ? pair.imposterWord : pair.civilianWord,
    imposterWord: swap ? pair.civilianWord : pair.imposterWord,
    category: pair.category,
    hint: pair.hint || `A pair of related words in the ${pair.category} category.`
  };
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// In-Memory Room Store
const rooms = new Map();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  server.use(cors());

  // Socket.IO Connection Handler
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    function getSanitizedRoom(roomCode, targetSocketId) {
      const room = rooms.get(roomCode);
      if (!room) return null;

      // Deep copy room object for client transmission
      const sanitized = JSON.parse(JSON.stringify(room));

      // Hide secret word and roles unless game is in RESULTS phase, or for target socket's own profile
      sanitized.players = sanitized.players.map((p) => {
        const isSelf = p.socketId === targetSocketId;
        const isResults = room.state === 'RESULTS';

        return {
          id: p.id,
          socketId: p.socketId,
          name: p.name,
          isHost: p.isHost,
          isConnected: p.isConnected,
          hasVoted: !!room.votes[p.id],
          // Reveal secret word & role only to oneself during game, or to everyone in results
          role: (isSelf || isResults) ? p.role : undefined,
          secretWord: (isSelf || isResults) ? p.secretWord : undefined,
          voteTargetId: isResults ? room.votes[p.id] : undefined,
          score: p.score || 0
        };
      });

      // Mask secret word pair unless RESULTS phase, but keep category and hint visible
      if (room.state !== 'RESULTS') {
        if (room.wordPair) {
          sanitized.wordPair = {
            category: room.wordPair.category,
            hint: room.wordPair.hint,
            civilianWord: '',
            imposterWord: ''
          };
        } else {
          sanitized.wordPair = null;
        }
      }

      return sanitized;
    }

    function broadcastRoomUpdate(roomCode) {
      const room = rooms.get(roomCode);
      if (!room) return;

      room.players.forEach((p) => {
        if (p.isConnected && p.socketId) {
          const clientData = getSanitizedRoom(roomCode, p.socketId);
          io.to(p.socketId).emit('room_updated', clientData);
        }
      });
    }

    // 1. Create Room
    socket.on('create_room', ({ playerName, maxPlayers = 10, numImposters = 1 }, callback) => {
      let code = generateRoomCode();
      while (rooms.has(code)) {
        code = generateRoomCode();
      }

      const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;

      const hostPlayer = {
        id: playerId,
        socketId: socket.id,
        name: playerName.trim(),
        isHost: true,
        isConnected: true,
        score: 0
      };

      const room = {
        code,
        hostId: playerId,
        players: [hostPlayer],
        numImposters: Math.max(1, Math.min(3, parseInt(numImposters) || 1)),
        maxPlayers: Math.max(3, Math.min(20, parseInt(maxPlayers) || 10)),
        state: 'LOBBY',
        isLocked: false,
        currentRound: 1,
        turnOrder: [],
        currentTurnIndex: 0,
        clues: [],
        chatMessages: [
          {
            id: `msg_${Date.now()}`,
            playerId: 'system',
            playerName: 'System',
            text: `Room created by ${playerName}. Welcome!`,
            timestamp: Date.now(),
            isSystem: true
          }
        ],
        wordPair: null,
        votes: {},
        winner: null
      };

      rooms.set(code, room);
      socket.join(code);
      socket.roomCode = code;
      socket.playerId = playerId;

      if (typeof callback === 'function') {
        callback({ success: true, roomCode: code, player: hostPlayer, roomData: getSanitizedRoom(code, socket.id) });
      }

      broadcastRoomUpdate(code);
    });

    // 2. Join Room
    socket.on('join_room', ({ roomCode, playerName }, callback) => {
      const code = roomCode ? roomCode.toUpperCase().trim() : '';
      const room = rooms.get(code);

      if (!room) {
        return callback && callback({ success: false, error: 'Room not found. Please check the code.' });
      }

      if (room.isLocked) {
        return callback && callback({ success: false, error: 'This room is currently locked by the host.' });
      }

      if (room.players.length >= room.maxPlayers) {
        return callback && callback({ success: false, error: 'Room is already full.' });
      }

      const trimmedName = playerName ? playerName.trim() : 'Player';
      const duplicateName = room.players.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase() && p.isConnected);
      if (duplicateName) {
        return callback && callback({ success: false, error: 'That name is already taken in this room.' });
      }

      const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;
      const newPlayer = {
        id: playerId,
        socketId: socket.id,
        name: trimmedName,
        isHost: false,
        isConnected: true,
        score: 0
      };

      room.players.push(newPlayer);
      room.chatMessages.push({
        id: `msg_${Date.now()}`,
        playerId: 'system',
        playerName: 'System',
        text: `${trimmedName} joined the lobby!`,
        timestamp: Date.now(),
        isSystem: true
      });

      socket.join(code);
      socket.roomCode = code;
      socket.playerId = playerId;

      if (typeof callback === 'function') {
        callback({ success: true, roomCode: code, player: newPlayer, roomData: getSanitizedRoom(code, socket.id) });
      }

      broadcastRoomUpdate(code);
    });

    // 3. Update Settings (Host Only)
    socket.on('update_settings', ({ roomCode, numImposters, maxPlayers }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player || !player.isHost) return;

      if (numImposters !== undefined) {
        room.numImposters = Math.max(1, Math.min(3, parseInt(numImposters)));
      }
      if (maxPlayers !== undefined) {
        room.maxPlayers = Math.max(3, Math.min(20, parseInt(maxPlayers)));
      }

      broadcastRoomUpdate(roomCode);
    });

    // 4. Lock / Unlock Room (Host Only)
    socket.on('toggle_lock', ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player || !player.isHost) return;

      room.isLocked = !room.isLocked;
      room.chatMessages.push({
        id: `msg_${Date.now()}`,
        playerId: 'system',
        playerName: 'System',
        text: `Room was ${room.isLocked ? 'LOCKED' : 'UNLOCKED'} by the host.`,
        timestamp: Date.now(),
        isSystem: true
      });

      broadcastRoomUpdate(roomCode);
    });

    // 5. Kick Player (Host Only)
    socket.on('kick_player', ({ roomCode, targetPlayerId }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const hostPlayer = room.players.find((p) => p.socketId === socket.id);
      if (!hostPlayer || !hostPlayer.isHost) return;

      const targetIndex = room.players.findIndex((p) => p.id === targetPlayerId);
      if (targetIndex !== -1) {
        const kicked = room.players[targetIndex];
        if (kicked.socketId) {
          io.to(kicked.socketId).emit('kicked');
        }

        room.players.splice(targetIndex, 1);
        room.chatMessages.push({
          id: `msg_${Date.now()}`,
          playerId: 'system',
          playerName: 'System',
          text: `${kicked.name} was removed from the room by the host.`,
          timestamp: Date.now(),
          isSystem: true
        });

        broadcastRoomUpdate(roomCode);
      }
    });

    // 6. Rename Player (Host Only or Self)
    socket.on('edit_player_name', ({ roomCode, targetPlayerId, newName }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const sender = room.players.find((p) => p.socketId === socket.id);
      if (!sender) return;

      const target = room.players.find((p) => p.id === targetPlayerId);
      if (!target) return;

      // Allow if sender is host or target editing their own name in lobby
      if (sender.isHost || sender.id === targetPlayerId) {
        const oldName = target.name;
        target.name = newName.trim();

        room.chatMessages.push({
          id: `msg_${Date.now()}`,
          playerId: 'system',
          playerName: 'System',
          text: `${oldName} is now named "${target.name}".`,
          timestamp: Date.now(),
          isSystem: true
        });

        broadcastRoomUpdate(roomCode);
      }
    });

    // 7. Start Game (Host Only)
    socket.on('start_game', ({ roomCode }, callback) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const hostPlayer = room.players.find((p) => p.socketId === socket.id);
      if (!hostPlayer || !hostPlayer.isHost) {
        return callback && callback({ success: false, error: 'Only the host can start the game.' });
      }

      const connectedPlayers = room.players.filter((p) => p.isConnected);
      if (connectedPlayers.length < Math.max(3, room.numImposters + 1)) {
        return callback && callback({
          success: false,
          error: `At least ${Math.max(3, room.numImposters + 1)} connected players are required to start.`
        });
      }

      // Generate AI Word Pair
      const wordPair = generateWordPair();
      room.wordPair = wordPair;

      // Assign Imposters
      const shuffledIndices = connectedPlayers.map((_, i) => i).sort(() => Math.random() - 0.5);
      const imposterCount = Math.min(room.numImposters, connectedPlayers.length - 1);
      const imposterIndices = new Set(shuffledIndices.slice(0, imposterCount));

      connectedPlayers.forEach((p, idx) => {
        if (imposterIndices.has(idx)) {
          p.role = 'IMPOSTER';
          p.secretWord = wordPair.imposterWord;
        } else {
          p.role = 'CIVILIAN';
          p.secretWord = wordPair.civilianWord;
        }
      });

      // Prepare Game Flow
      room.state = 'GAME_ROUND';
      room.currentRound = 1;
      room.clues = [];
      room.votes = {};
      room.winner = null;

      // Turn Order
      room.turnOrder = connectedPlayers.map((p) => p.id).sort(() => Math.random() - 0.5);
      room.currentTurnIndex = 0;

      room.chatMessages.push({
        id: `msg_${Date.now()}`,
        playerId: 'system',
        playerName: 'System',
        text: `🎮 Game Started! Category hint: "${wordPair.category}". Secret words delivered. Round 1 begins!`,
        timestamp: Date.now(),
        isSystem: true
      });

      if (typeof callback === 'function') {
        callback({ success: true });
      }

      broadcastRoomUpdate(roomCode);
    });

    // 8. Submit Clue (Turn Based)
    socket.on('submit_clue', ({ roomCode, text }, callback) => {
      const room = rooms.get(roomCode);
      if (!room || room.state !== 'GAME_ROUND') return;

      const activePlayerId = room.turnOrder[room.currentTurnIndex];
      const player = room.players.find((p) => p.socketId === socket.id);

      if (!player || player.id !== activePlayerId) {
        return callback && callback({ success: false, error: 'It is not your turn to submit a clue!' });
      }

      const trimmedClue = text ? text.trim() : '';
      if (!trimmedClue) {
        return callback && callback({ success: false, error: 'Clue cannot be empty.' });
      }

      // Add Clue
      const clue = {
        id: `clue_${Date.now()}`,
        round: room.currentRound,
        playerId: player.id,
        playerName: player.name,
        text: trimmedClue,
        timestamp: Date.now()
      };
      room.clues.push(clue);

      // Advance Turn
      room.currentTurnIndex += 1;

      // Check if all players completed turn for the round
      if (room.currentTurnIndex >= room.turnOrder.length) {
        if (room.currentRound < 3) {
          room.currentRound += 1;
          room.currentTurnIndex = 0;
          room.chatMessages.push({
            id: `msg_${Date.now()}`,
            playerId: 'system',
            playerName: 'System',
            text: `🔔 Round ${room.currentRound - 1} complete! Round ${room.currentRound} of 3 is starting now.`,
            timestamp: Date.now(),
            isSystem: true
          });
        } else {
          // All 3 rounds complete -> Automatically transition to VOTING phase
          room.state = 'VOTING';
          room.chatMessages.push({
            id: `msg_${Date.now()}`,
            playerId: 'system',
            playerName: 'System',
            text: `🗳️ All 3 Clue Rounds are finished! Time to vote for the Imposter!`,
            timestamp: Date.now(),
            isSystem: true
          });
        }
      }

      if (typeof callback === 'function') {
        callback({ success: true });
      }

      broadcastRoomUpdate(roomCode);
    });

    // 9. Submit Vote
    socket.on('submit_vote', ({ roomCode, targetPlayerId }, callback) => {
      const room = rooms.get(roomCode);
      if (!room || room.state !== 'VOTING') return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player) return;

      room.votes[player.id] = targetPlayerId;

      const activePlayers = room.players.filter((p) => p.isConnected);
      const totalVotesCast = Object.keys(room.votes).length;

      // Check if all active connected players have voted
      if (totalVotesCast >= activePlayers.length) {
        // Tally Votes
        const voteCounts = {};
        Object.values(room.votes).forEach((targetId) => {
          voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
        });

        // Find highest voted
        let maxVotes = 0;
        let topVotedId = null;
        let isTie = false;

        Object.entries(voteCounts).forEach(([targetId, count]) => {
          if (count > maxVotes) {
            maxVotes = count;
            topVotedId = targetId;
            isTie = false;
          } else if (count === maxVotes) {
            isTie = true;
          }
        });

        const topVotedPlayer = room.players.find((p) => p.id === topVotedId);
        const imposters = room.players.filter((p) => p.role === 'IMPOSTER');

        // Determine Winner:
        if (!isTie && topVotedPlayer && topVotedPlayer.role === 'IMPOSTER') {
          room.winner = 'CIVILIANS';
        } else {
          room.winner = 'IMPOSTERS';
        }

        // Calculate and award points to players
        room.players.forEach((p) => {
          let ptsEarned = 0;
          if (room.winner === 'CIVILIANS') {
            if (p.role === 'CIVILIAN') {
              ptsEarned += 10;
              const target = room.players.find((t) => t.id === room.votes[p.id]);
              if (target && target.role === 'IMPOSTER') {
                ptsEarned += 5;
              }
            }
          } else {
            if (p.role === 'IMPOSTER') {
              ptsEarned += 15;
              if (!voteCounts[p.id] || voteCounts[p.id] === 0) {
                ptsEarned += 5;
              }
            }
          }
          p.score = (p.score || 0) + ptsEarned;
        });

        room.state = 'RESULTS';
        room.chatMessages.push({
          id: `msg_${Date.now()}`,
          playerId: 'system',
          playerName: 'System',
          text: `🎉 Voting concluded! ${room.winner === 'CIVILIANS' ? 'Civilians Caught the Imposter! Civilians Win!' : 'The Imposters Evaded Detection! Imposters Win!'} Check updated scores in Lobby!`,
          timestamp: Date.now(),
          isSystem: true
        });
      }

      if (typeof callback === 'function') {
        callback({ success: true });
      }

      broadcastRoomUpdate(roomCode);
    });

    // 10. Play Again / Return to Lobby (Any Player in Room)
    socket.on('play_again', ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player) return;

      // Reset Room to Lobby
      room.state = 'LOBBY';
      room.currentRound = 1;
      room.currentTurnIndex = 0;
      room.clues = [];
      room.votes = {};
      room.winner = null;
      room.wordPair = null;

      room.players.forEach((p) => {
        delete p.role;
        delete p.secretWord;
      });

      room.chatMessages.push({
        id: `msg_${Date.now()}`,
        playerId: 'system',
        playerName: 'System',
        text: `🔄 ${player.name} returned everyone to the Lobby for the next round!`,
        timestamp: Date.now(),
        isSystem: true
      });

      broadcastRoomUpdate(roomCode);
    });

    // 11. Send Chat Message
    socket.on('send_chat', ({ roomCode, text }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player) return;

      const trimmed = text ? text.trim() : '';
      if (!trimmed) return;

      room.chatMessages.push({
        id: `msg_${Date.now()}`,
        playerId: player.id,
        playerName: player.name,
        text: trimmed,
        timestamp: Date.now()
      });

      broadcastRoomUpdate(roomCode);
    });

    // 12. Close Room / End Session (Host Only)
    socket.on('close_room', ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const hostPlayer = room.players.find((p) => p.socketId === socket.id);
      if (!hostPlayer || !hostPlayer.isHost) return;

      const standings = [...room.players]
        .map((p) => ({ name: p.name, score: p.score || 0 }))
        .sort((a, b) => b.score - a.score);

      io.to(roomCode).emit('room_closed', {
        message: 'The host has ended and closed the game lobby session.',
        standings
      });

      rooms.delete(roomCode);
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      if (socket.roomCode && socket.playerId) {
        const room = rooms.get(socket.roomCode);
        if (room) {
          const player = room.players.find((p) => p.id === socket.playerId);
          if (player) {
            player.isConnected = false;

            // Host reassignment if host disconnected
            if (player.isHost) {
              const nextHost = room.players.find((p) => p.isConnected && p.id !== player.id);
              if (nextHost) {
                player.isHost = false;
                nextHost.isHost = true;
                room.hostId = nextHost.id;
                room.chatMessages.push({
                  id: `msg_${Date.now()}`,
                  playerId: 'system',
                  playerName: 'System',
                  text: `Host left. ${nextHost.name} is now the host!`,
                  timestamp: Date.now(),
                  isSystem: true
                });
              }
            }

            // Cleanup room if all players disconnected
            const anyConnected = room.players.some((p) => p.isConnected);
            if (!anyConnected) {
              rooms.delete(socket.roomCode);
              console.log(`Room ${socket.roomCode} deleted due to inactivity.`);
            } else {
              broadcastRoomUpdate(socket.roomCode);
            }
          }
        }
      }
    });
  });

  // Next.js page routing handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Imposter Word Game Server ready on http://localhost:${PORT}`);
  });
});
