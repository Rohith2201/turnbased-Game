const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const gameState = {
    board: Array(5).fill(null).map(() => Array(5).fill(null)),
    turn: 'A', // Player A starts
    players: { A: [], B: [] },
    characters: {
        'A': {},
        'B': {}
    },
    movesHistory: [], // To store history of moves
    spectators: [],
    chatMessages: [],
    replays: {}
};

// Serve static files for the client
app.use(express.static('public'));

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New connection');
    
    // Handle initial messages from clients
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'MOVE') {
            handleMove(data, ws);
        } else if (data.type === 'INIT') {
            handleInit(data, ws);
        } else if (data.type === 'CHAT') {
            handleChat(data, ws);
        } else if (data.type === 'SPECTATE') {
            handleSpectate(ws);
        } else if (data.type === 'REPLAY') {
            handleReplay(data, ws);
        }
    });
    
    ws.on('close', () => {
        console.log('Connection closed');
        // Remove spectators who disconnected
        gameState.spectators = gameState.spectators.filter(s => s !== ws);
    });
});

function handleInit(data, ws) {
    const player = data.player;
    gameState.players[player] = data.characters;
    gameState.characters[player] = initializeCharacters(data.characters, player);

    // Notify all clients of the new game state
    broadcast(JSON.stringify({ type: 'STATE', gameState }));
}

function initializeCharacters(characterNames, player) {
    const positions = {
        'P': { x: player === 'A' ? 0 : 4, y: 0 },
        'H1': { x: player === 'A' ? 0 : 4, y: 1 },
        'H2': { x: player === 'A' ? 0 : 4, y: 2 },
        'H3': { x: player === 'A' ? 0 : 4, y: 3 }
    };

    const characters = {};
    characterNames.forEach((char, index) => {
        characters[char] = { position: positions[char] };
    });

    return characters;
}

function handleMove(data, ws) {
    const { player, character, direction } = data;

    if (gameState.turn !== player) {
        ws.send(JSON.stringify({ type: 'ERROR', message: "Not your turn!" }));
        return;
    }

    const characterData = gameState.characters[player][character];
    if (!characterData) {
        ws.send(JSON.stringify({ type: 'ERROR', message: "Character does not exist!" }));
        return;
    }

    const newPosition = getNewPosition(characterData.position, direction);

    if (isValidMove(newPosition)) {
        // Check for combat
        const opponent = player === 'A' ? 'B' : 'A';
        const opponentCharacter = gameState.characters[opponent][getCharacterAtPosition(newPosition)];
        if (opponentCharacter) {
            delete gameState.characters[opponent][getCharacterAtPosition(newPosition)];
        }

        characterData.position = newPosition;
        gameState.board = updateBoard();
        gameState.turn = gameState.turn === 'A' ? 'B' : 'A'; // Switch turns
        
        // Save move history
        gameState.movesHistory.push({ player, character, direction, position: newPosition });

        broadcast(JSON.stringify({ type: 'STATE', gameState }));
    } else {
        ws.send(JSON.stringify({ type: 'ERROR', message: "Invalid move!" }));
    }
}

function getNewPosition(position, direction) {
    const moveMap = {
        'UP': { x: -1, y: 0 },
        'DOWN': { x: 1, y: 0 },
        'LEFT': { x: 0, y: -1 },
        'RIGHT': { x: 0, y: 1 },
        'FL': { x: -2, y: -1 },
        'FR': { x: -2, y: 1 },
        'BL': { x: 2, y: -1 },
        'BR': { x: 2, y: 1 },
        'RF': { x: 1, y: 2 },
        'RB': { x: 1, y: -2 },
        'LF': { x: -1, y: 2 },
        'LB': { x: -1, y: -2 }
    };

    return {
        x: position.x + moveMap[direction].x,
        y: position.y + moveMap[direction].y
    };
}

function isValidMove(position) {
    return position.x >= 0 && position.x < 5 && position.y >= 0 && position.y < 5;
}

function getCharacterAtPosition(position) {
    for (const player in gameState.characters) {
        for (const character in gameState.characters[player]) {
            const charPos = gameState.characters[player][character].position;
            if (charPos.x === position.x && charPos.y === position.y) {
                return character;
            }
        }
    }
    return null;
}

function updateBoard() {
    const newBoard = Array(5).fill(null).map(() => Array(5).fill(null));

    for (const player in gameState.characters) {
        for (const character in gameState.characters[player]) {
            const pos = gameState.characters[player][character].position;
            newBoard[pos.x][pos.y] = `${player}-${character}`;
        }
    }

    return newBoard;
}

function handleChat(data, ws) {
    const { message } = data;
    gameState.chatMessages.push(message);
    broadcast(JSON.stringify({ type: 'CHAT', chatMessages: gameState.chatMessages }));
}

function handleSpectate(ws) {
    gameState.spectators.push(ws);
    ws.send(JSON.stringify({ type: 'STATE', gameState }));
}

function handleReplay(data, ws) {
    const { gameId } = data;
    const replay = gameState.replays[gameId];
    if (replay) {
        ws.send(JSON.stringify({ type: 'REPLAY', replay }));
    } else {
        ws.send(JSON.stringify({ type: 'ERROR', message: "Replay not found!" }));
    }
}

function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

server.listen(8080, () => {
    console.log('Server listening on port 8080');
});
