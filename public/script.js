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
        img.classList.add("card", card.suit, card.face);
        document.querySelector("#player-cards").appendChild(img);
    }
}

function count_cards() {
    const your_hand = document.querySelector("#your-info");
    const left = document.querySelector("#left-info");
    const middle = document.querySelector("#middle-info");
    const right = document.querySelector("#right-info");

    socket.emit("left", order[0]);
    socket.emit("middle", order[1]);
    socket.emit("right", order[2]);

    your_hand.innerHTML = "ID: " + you.id + "<br>" + "Role: " + you.role + "<br>" + "You have " + you.cards.length + " card(s)";
    socket.on("left", (arg) => {
        left.innerHTML = "ID: " + arg.id + "<br>" + "Role: " + arg.role + "<br>" + "They have " + arg.cards.length + " card(s)";
    });
    socket.on("middle", (arg) => {
        middle.innerHTML = "ID: " + arg.id + "<br>" + "Role: " + arg.role + "<br>" + "They have " + arg.cards.length + " card(s)";
    });
    socket.on("right", (arg) => {
        right.innerHTML = "ID: " + arg.id + "<br>" + "Role: " + arg.role + "<br>" + "They have " + arg.cards.length + " card(s)";
    });
}

function player_order(id) { // Left, Opposite, Right
    if (id === 0) {
        return [1, 2, 3];
    }
    else if (id === 1) {
        return [2, 3, 0];
    }
    else if (id === 2) {
        return [3, 0, 1];
    }
    else {
        return [0, 1, 2];
    }
}

function your_turn() {
    document.querySelector("#your-info").style.border = "5px solid gold";
    document.addEventListener("click", (event) => {
        let x = event.clientX;
        let y = event.clientY;
        let get = document.elementFromPoint(x, y);
        if (get.classList.contains("card")) {
            currently_selected.verify(get);
            // console.log("yo");
            // selected.classList.add("selected");
            // TODO: add remove select
            // TODO: add submit and reset
        }

    });

}

// Update Screen after turns
function update() {

}
function getMousePos(event) {


}

class Selected {
    static num_selected = 0;
    static selected = [];

    verify(card_html) {
        let suit = card_html.classList[1];
        let face = card_html.classList[2];
        console.log(suit, face);
        // console.log(Selected.num_selected);
        // TODO: add verify
    }

    add() {

    }
}


// Player joined
let socket = io.connect("http://localhost:4000");
let deck;
let you;
let order = [];
let currently_selected = new Selected();


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
});

socket.on("turn", (arg) => {
    if (arg === you.id) {
        your_turn();
    }
    else {
        update();
    }
});









