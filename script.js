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

    create(suits, values) {
        for (let suit of suits) {
            for (let v = 0; v < values.length; v++) {
                this.Deck.push(new Card(suit, values[v], faces[v]));
            }
        }
        this.Deck.push(new Card('Joker', 0, 'Joker'))
        this.Deck.push(new Card('Joker', 0, 'Joker'))
        return this.Deck;
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

    deal() {
    }
}

class Player {

}

const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
const values = [12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let cardDeck = new Deck();
cardDeck.create(suits, values);
cardDeck.shuffle();
cardDeck.deal();
console.log(cardDeck);