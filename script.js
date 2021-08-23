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
        const faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

        for (let suit of suits) {
            for (let v = 0; v < values.length; v++) {
                this.Deck.push(new Card(suit, values[v], faces[v]));
            }
        }
        this.Deck.push(new Card('Joker', 0, 'Joker'))
        this.Deck.push(new Card('Joker', 0, 'Joker'))
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
    }
}

class Board {
    constructor() {
        this.players = [];
    }

    start(p1, p2, p3, p4) {
        this.players.push(new Player(p1));
        this.players.push(new Player(p2));
        this.players.push(new Player(p3));
        this.players.push(new Player(p4));

        let deck = new Deck();
        deck.create();
        deck.shuffle();
        this.players[0].cards = deck.Deck.slice(0, 13);
        this.players[1].cards = deck.Deck.slice(13, 26);
        this.players[2].cards = deck.Deck.slice(26, 40);
        this.players[3].cards = deck.Deck.slice(40, 54);


    }

    sort(hand) {

    }
}



let board = new Board();
board.start('A', 'B', 'C', 'D');
console.log(board.players);