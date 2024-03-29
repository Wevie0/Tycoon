import { useParams } from "react-router-dom";
import { socket } from "./socket";
import { useState } from "react";

interface RoomData {
    name: string;
    key: string;
    numPlayers: number;
    playerNames: string[];
}

export default function Room() {
    const { key } = useParams();
    const [data, setData] = useState<RoomData>();
    const [start, setStart] = useState(false);
    const [cardNames, setCardNames] = useState<string[]>([]);
    const [selCards, setSelCards] = useState<string[]>([]);
    const [clientTurn, setClientTurn] = useState(false);

    function renderCards() {
        // TODO: render hover
        let images: JSX.Element[] = [];

        cardNames.forEach((cardName) => {
            images.push(
                <img
                    src={require(`./images/cards/${cardName}.svg`)}
                    alt={`${cardName}`}
                    onClick={() => handleCardClick(cardName)}
                />
            );
        });

        return <div>{images}</div>;
    }

    function handleCardClick(cardName: string) {
        // TODO: handle correct/incorrect cards
        // TODO: render selected cards differently
        console.log(`${cardName} was clicked!`);
        // deselect the card
        if (selCards.includes(cardName)) {
            setSelCards(
                selCards.filter((cName) => {
                    return cName !== cardName;
                })
            );
        } else {
            // add card to selected
            setSelCards([...selCards, cardName]);
        }
    }

    function playSelected() {
        if (!clientTurn) {
            return;
        }

        socket.emit("game:playSelected", selCards, (response) => {
            if (response) {
                setCardNames(
                    cardNames.filter((cardName) => {
                        return !selCards.includes(cardName);
                    })
                );
                setSelCards([]);
                setClientTurn(false);
            } else {
                // TODO: finish this
                alert("You selected unplayable cards!");
            }
        });
    }

    function skipTurn() {
        if (!clientTurn) {
            return;
        }
        socket.emit("game:skipTurn");
        setClientTurn(false);
    }

    socket.on("room:joined", (roomData: RoomData) => {
        setData(roomData);
    });

    socket.on("game:hasStarted", () => {
        setStart(true);
    });

    socket.on("game:setCardNames", (cardNames: string[]) => {
        setCardNames(cardNames);
        renderCards();
    });

    socket.on("game:setClientTurn", () => {
        setClientTurn(true);
    });

    if (!start) {
        return (
            <div>
                <h1>
                    The room key is {key} with name {data && data.name}. There
                    are {data && data.numPlayers} players in the room:
                </h1>
                <ul>
                    {data && data.playerNames.map((name) => <li>{name}</li>)}
                </ul>
                <button
                    type="button"
                    disabled={data?.numPlayers !== 4}
                    onClick={() => {
                        setStart(true);
                        socket.emit("game:start");
                    }}
                >
                    Start Game!
                </button>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Game has started!</h1>
                {clientTurn && <h1>It is currently your turn.</h1>}
                {renderCards()}
                <button
                    type="button"
                    disabled={!clientTurn || selCards.length === 0}
                    onClick={() => playSelected()}
                >
                    Play!
                </button>
                <button
                    type="button"
                    disabled={!clientTurn}
                    onClick={() => skipTurn()}
                >
                    Skip!
                </button>
            </div>
        );
    }
}
