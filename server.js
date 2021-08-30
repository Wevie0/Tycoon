"use strict"

class Card {
    constructor(suit, value, face) {
        this.suit = suit;
        this.value = value;
        this.face = face;
    }
}

class Deck {
    constructor() {
        this.Deck = [];
    }

    create() {

        const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
        const values = [12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const faces = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

        for (let suit of suits) {
            for (let v = 0; v < values.length; v++) {
                this.Deck.push(new Card(suit, values[v], faces[v]));
            }
        }
        this.Deck.push(new Card('_Joker', 14, 'Joker'));
        this.Deck.push(new Card('_Joker', 14, 'Joker'));
    }

    shuffle() {
        let counter = this.Deck.length;
        let temp;
        let i;
        while (counter) {
            i = Math.floor(Math.random() * counter--);
            temp = this.Deck[counter];
            this.Deck[counter] = this.Deck[i];
            this.Deck[i] = temp;
        }
        return this.Deck;
    }
}

class Player {
    constructor(id) {
        this.id = id;
        this.cards = [];
        this.role = "Poor";
        this.score = 0;
    }
}

function give_hand(player) {
    let unsorted = [];
    if (player.id === 0) {
        unsorted = deck.Deck.slice(0, 13);
    }
    else if (player.id === 1) {
        unsorted = deck.Deck.slice(13, 26);
    }
    else if (player.id === 2) {
        unsorted = deck.Deck.slice(26, 40);
    }
    else if (player.id === 3) {
        unsorted = deck.Deck.slice(40, 54);
    }
    player.cards = sort_hand(unsorted);
}

function sort_hand(hand) {
    return hand.sort((a, b) => (a.value > b.value) ? 1 : -1);
}

let express = require('express');
let socket = require("socket.io");
let app = express();
let server = app.listen(4000, function () {
    console.log("listening to requests on port 4000")
});

let players = [];

let deck = new Deck();
deck.create();
deck.shuffle();

app.use(express.static('public'));

let io = socket(server);

io.on("connection", (socket) => {
    console.log("made socket connection", socket.id);
    socket.emit("deck", deck);

    players.push(new Player(players.length));
    give_hand(players[players.length - 1]);

    // console.log(players[players.length - 1]);

    socket.emit("you", players[players.length - 1]);
    if (players.length === 4) {
        io.emit("ready");
    }

    socket.on("left", (arg) => {
        socket.emit("left", players[arg])
    });
    socket.on("middle", (arg) => {
        socket.emit("middle", players[arg])
    });
    socket.on("right", (arg) => {
        socket.emit("right", players[arg])
    });


});


