"use strict"

let express = require('express');
let app = express();
let server = app.listen(4000, function () {
    console.log("listening to requests on port 4000")
});

app.use(express.static('public'));

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
        this.Deck.push(new Card('_Joker', 14, 'Joker'))
        this.Deck.push(new Card('_Joker', 14, 'Joker'))
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
    constructor(name) {
        this.name = name;
        this.cards = [];
        this.score = 0;
        this.role = "Poor";
    }
}

class Board {
    constructor() {
        this.players = [];
    }

    start(p0, p1, p2, p3) {
        this.players.push(new Player(p0));
        this.players.push(new Player(p1));
        this.players.push(new Player(p2));
        this.players.push(new Player(p3));

        let deck = new Deck();
        deck.create();
        deck.shuffle();

        this.players[0].cards = deck.Deck.slice(0, 13);
        this.players[1].cards = deck.Deck.slice(13, 26);
        this.players[2].cards = deck.Deck.slice(26, 40);
        this.players[3].cards = deck.Deck.slice(40, 54);

        this.sort_hand(this.players[0].cards);
        this.sort_hand(this.players[1].cards);
        this.sort_hand(this.players[2].cards);
        this.sort_hand(this.players[3].cards);
    }

    sort_hand(hand) {
        hand.sort((a, b) => (a.value > b.value) ? 1 : -1);

        /* Sorts suits and values (not needed)
        hand.sort((a, b) => {
            if (a.suit === b.suit) {
                return a.value > b.value ? 1 : -1;
            }
            else {
                return a.suit < b.suit ? 1 : -1;
            }
        })
        */
    }

    show_cards(player) {
        //     let p = parseInt(player.slice(1));
        //     for (let i = 0; i < this.players[p].cards.length; i++) {
        //         let card = this.players[p].cards[i];
        //         let img = document.createElement("img");
        //         let address = "./cards/" + card.suit.toLowerCase().slice(0, 1) + "_" + card.value + ".png";
        //         img.src = address;
        //         img.width = 75;
        //         img.height = 120;
        //         document.querySelector("#player-cards").appendChild(img);
        //     }
    }

    count_cards(player) {
        let p = parseInt(player.slice(1));
        let count = this.players[p].cards.length;
    }
}


let board = new Board();
board.start('A', 'B', 'C', 'D');
board.show_cards("p0");
board.count_cards("p0");
//console.log(board.players);