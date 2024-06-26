import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import Player from "./game/Player.js";
import Game from "./game/Game.js";
import Deck from "./game/Deck.js";

interface ServerToClientEvents {
    // noArg: () => void;
    // basicEmit: (s: string) => void;
    // withAck: (d: string, callback: (e: string) => void) => void;
    "room:joined": (data: RoomData) => void;
    "game:hasStarted": () => void;
    "game:setPlayerCards": (cardNames: string[]) => void;
    "game:updatePlayArea": (cardNames: string[]) => void;
    "game:setClientTurn": () => void;
}

interface ClientToServerEvents {
    "player:setUsername": (s: string) => void;
    "room:join": (joinkey: string, callback: (status: boolean) => void) => void;
    "room:create": (rn: string, key: string, p: boolean) => void;
    "room:getPublic": (callback: (public_rooms: RoomData[]) => void) => void;
    "game:start": () => void;
    "game:playSelected": (
        selCards: string[],
        callback: (status: boolean) => void
    ) => void;
    "game:passTurn": () => void;
}

interface InterServerEvents {}

interface SocketData {
    username: string;
    player: Player;
    game: Game;
}

// TODO: share type defs
// https://stackoverflow.com/questions/65045106/share-types-between-client-and-server
interface RoomData {
    name: string;
    key: string;
    numPlayers: number;
    playerNames: string[];
}

const app = express();
const server = createServer(app);
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server, {
    cors: {
        origin: "http://localhost:3000",
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
});

app.use(cors());

io.listen(4000);

let players: Player[] = [];
let rooms: Game[] = [];

/**
 * Given the room key, finds the associated room.
 *
 * @param key - the room key to search for
 * @returns The room with key `key`
 * @throws {@link ReferenceError}
 * if the room is not found
 */

function getRoomByKey(key: string): Game {
    const r = rooms.find((room) => room.key == key);
    if (!r) {
        throw new ReferenceError("Cannot find Room!");
    }
    return r;
}

function isValidRoom(key: string): boolean {
    return !!rooms.find((room) => room.key == key);
}

io.on("connection", (socket) => {
    console.log(`A player connected with id ${socket.id}`);
    socket.data.player = new Player(socket.id);

    const player = socket.data.player;
    let game = socket.data.game;

    players.push(player);

    socket.on("disconnect", () => {
        if (game) {
            game.removePlayer(player);
            player.room = null;
        }
        players = players.filter((player) => player != player);
        rooms = rooms.filter((room) => !room.isEmpty());

        console.log(`Player with id ${socket.id} disconnected`);
    });

    socket.on("player:setUsername", (username) => {
        console.log(
            `Player with id ${socket.id} has set username to ${username}`
        );
        player.username = username;
    });

    // client has created a room
    socket.on("room:create", (roomname, key, p) => {
        console.log(
            `A new room has been created with name: ${roomname} and key: ${key} by player ${player.username}`
        );
        game = new Game(player, roomname, key, p);
        rooms.push(game);
        socket.join(key);
        io.to(key).emit("room:joined", {
            name: game.name,
            key: game.key,
            playerNames: game.playerNames,
            numPlayers: game.numPlayers,
        });
    });

    // client wants to join room
    socket.on("room:join", (key, callback) => {
        if (isValidRoom(key)) {
            callback(true);
            socket.join(key);
            game = getRoomByKey(key);
            game.addPlayer(player);
            // update room members on the new state
            io.to(key).emit("room:joined", {
                name: game.name,
                key: game.key,
                playerNames: game.playerNames,
                numPlayers: game.numPlayers,
            });
            console.log(
                `{Player ${player.username} has joined room ${game.name}`
            );
        } else {
            callback(false);
        }
    });

    // client is looking at all public rooms
    socket.on("room:getPublic", (callback) => {
        let public_rooms: RoomData[] = [];
        rooms.forEach((room) => {
            if (room.isPublic) {
                public_rooms.push({
                    name: room.name,
                    key: room.key,
                    numPlayers: room.numPlayers,
                    playerNames: room.playerNames,
                });
            }
        });
        callback(public_rooms);
    });

    // notify clients in room that game has started
    socket.on("game:start", () => {
        console.log(
            `Game with id ${game.key} and name ${game.name} has started.`
        );
        io.to(game.key).emit("game:hasStarted");
        game.beginGame();
        // emit initial card state to each player
        game.players.forEach((player) => {
            io.to(player.id).emit(
                "game:setPlayerCards",
                player.hand.map((card) => card.toString())
            );
        });

        // notifies the first player it's their turn
        notifyCurrentPlayer();
    });

    socket.on("game:playSelected", (selCards, callback) => {
        let cards = Deck.getCardsFromNames(selCards);
        if (game.verifyCards(cards)) {
            console.log(
                `Player ${player.username} has played legal cards ${selCards}`
            );
            game.playTurn(player, cards);
            if (game.allDone()) {
                // TODO: setup next round and roles
                console.log("This round is over!");
            }

            notifyCurrentPlayer();
            io.to(game.key).emit("game:updatePlayArea", selCards);
            callback(true);
        } else {
            console.log(
                `Player ${player.username} has played illegal cards ${selCards}`
            );
            callback(false);
        }
    });

    socket.on("game:passTurn", () => {
        console.log(`Player ${player.username} has passed`);

        if (game.passTurn()) {
            console.log(`A new trick has started`);
            io.to(game.key).emit("game:updatePlayArea", []);
        }
        notifyCurrentPlayer();
    });

    function notifyCurrentPlayer() {
        io.to(game.currentPlayer.id).emit("game:setClientTurn");
    }
});
