import { SyntheticEvent, useEffect, useState } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import { RoomData } from "../../server/shared/Data";

export default function Lobby() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<RoomData[]>([]);

    useEffect(() => {
        getPublicRooms();
    }, []);

    function getPublicRooms(): void {
        socket.emit("room:getPublic", (public_rooms) => {
            console.log(public_rooms);
            setRooms(public_rooms);
        });
    }

    function joinPublicRoom(key: string) {
        socket.emit("room:join", key, (status) => {
            if (status) {
                navigate(`../rooms/${key}`);
            } else {
                // should not happen
                alert("Invalid Join Code!");
            }
        });
    }

    function Table() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Room Name</th>
                        <th>Number of Players</th>
                        <th>Join!</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.name}>
                            <td>{room.name}</td>
                            <td>{room.players.length}</td>
                            <td>
                                <button
                                    onClick={() => joinPublicRoom(room.key)}
                                >
                                    Join!
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <button onClick={getPublicRooms}>Refresh</button>
            </table>
        );
    }

    function handlePrivate(
        event: SyntheticEvent<HTMLFormElement, SubmitEvent>
    ) {
        event.preventDefault();
        const form = event.currentTarget;
        const elements = form.elements as typeof form.elements & {
            key: { value: string };
        };
        const key = elements.key.value;

        socket.emit("room:join", key, (status) => {
            console.log(status);
            if (status) {
                navigate(`../rooms/${key}`);
            } else {
                alert("Invalid Join Code!");
            }
        });
    }

    return (
        <div>
            <div>
                <h2>Join a Public Game:</h2>
                <Table />
            </div>
            <form onSubmit={handlePrivate}>
                <h2>Join a Private Game:</h2>
                <label htmlFor="key">Key:</label>
                <input type="text" id="key" name="key" />
                <button type="submit">Join!</button>
            </form>
        </div>
    );
}
