"use strict"

// class Card {
//     constructor(suit, value, face) {
//         this.suit = suit;
//         this.value = value;
//         this.face = face;
//     }
// }

// class Deck {
//     constructor() {
//         this.Deck = [];
//     }

//     create() {

//         const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
//         const values = [12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
//         const faces = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

//         for (let suit of suits) {
//             for (let v = 0; v < values.length; v++) {
//                 this.Deck.push(new Card(suit, values[v], faces[v]));
//             }
//         }
//         this.Deck.push(new Card('_Joker', 14, 'Joker'));
//         this.Deck.push(new Card('_Joker', 14, 'Joker'));
//     }

//     shuffle() {
//         let counter = this.Deck.length;
//         let temp;
//         let i;
//         while (counter) {
//             i = Math.floor(Math.random() * counter--);
//             temp = this.Deck[counter];
//             this.Deck[counter] = this.Deck[i];
//             this.Deck[i] = temp;
//         }
//         return this.Deck;
//     }
// }

// class Player {
//     constructor(id) {
//         this.id = id;
//         this.cards = [];
//         this.role = "Poor";
//         this.score = 0;

//     }
// }

// function give_hand(player) {
//     let unsorted = [];
//     if (player.id === 0) {
//         unsorted = deck.Deck.slice(0, 13);
//     }
//     else if (player.id === 1) {
//         unsorted = deck.Deck.slice(13, 26);
//     }
//     else if (player.id === 2) {
//         unsorted = deck.Deck.slice(26, 40);
//     }
//     else if (player.id === 3) {
//         unsorted = deck.Deck.slice(40, 54);
//     }
//     player.cards = sort_hand(unsorted);
// }

// function sort_hand(hand) {
//     return hand.sort((a, b) => (a.value > b.value) ? 1 : -1);
// }

function show_hand(player) {
    for (let i = 0; i < player.cards.length; i++) {
        let card = player.cards[i];
        let img = document.createElement("img");
        let address = "./cards/" + card.suit.toLowerCase().slice(0, 1) + "_" + card.face + ".png";
        img.src = address;
        img.width = 75;
        img.height = 120;
        document.querySelector("#player-cards").appendChild(img);
    }
}

function count_cards() {
    const your_hand = document.querySelector("#you-count");
    const left = document.querySelector("#left-count");
    const middle = document.querySelector("#middle-count");
    const right = document.querySelector("#right-count");

    socket.emit("left", order[0]);
    socket.emit("middle", order[1]);
    socket.emit("right", order[2]);

    your_hand.innerHTML = "ID: " + you.id + "<br>" + "Role: " + you.role + "<br>" + "You have " + you.cards.length + " cards";
    socket.on("left", (arg) => {
        left.innerHTML = "ID: " + arg.id + "<br>" + "Role: " + arg.role + "<br>" + "They have " + arg.cards.length + " cards";
    });
    socket.on("middle", (arg) => {
        middle.innerHTML = "ID: " + arg.id + "<br>" + "Role: " + arg.role + "<br>" + "They have " + arg.cards.length + " cards";
    });
    socket.on("right", (arg) => {
        right.innerHTML = "ID: " + arg.id + "<br>" + "Role: " + arg.role + "<br>" + "They have " + arg.cards.length + " cards";
    });
}

function player_order(id) { // Left, Opposite, Right
    if (id === 0) {
        return [3, 1, 2];
    }
    else if (id === 1) {
        return [0, 2, 3];
    }
    else if (id === 2) {
        return [1, 0, 3];
    }
    else {
        return [2, 1, 0];
    }
}

// Player joined
let socket = io.connect("http://localhost:4000");
let deck;
let you;
let order = [];

// Receive deck from server (redundant)
socket.on("deck", (arg) => {
    deck = arg;
});

// Receive player information from server
socket.on("you", (arg) => {
    you = arg;
    show_hand(you);
    order = player_order(you.id);

});

socket.on("ready", () => {
    count_cards();
})









