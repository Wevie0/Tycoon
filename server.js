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

let express = require('express');
let socket = require("socket.io");
let app = express();
let server = app.listen(4000, function () {
    console.log("listening to requests on port 4000")
});

let players = [];
let deck = new Deck();
deck.create();
// deck.shuffle();
let id = 0;

app.use(express.static('public'));

let io = socket(server);

io.on("connection", function (socket) {
    console.log("made socket connection", socket.id);
});

io.on("connection", (socket) => {
    socket.on("player", (arg, callback) => {
        socket.emit("id", id);
        id++;
        arg.id = id - 1;
        players.push(arg);
        console.log(players);
        callback('ok');
    });
    // socket.on("deck", (arg) => {
    //     deck = arg;
    //     socket.emit("deck", arg);
    // });
    socket.emit("deck", deck);

});

if (players.length === 4) {
    console.log("Begin!");
}