import { SyntheticEvent } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Menu() {
    const navigate = useNavigate();

    function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        const form = event.currentTarget;
        const elements = form.elements as typeof form.elements & {
            username: { value: string };
        };
        socket.emit("player:setUsername", elements.username.value);

        let buttonName: string = event.nativeEvent.submitter!.id;
        if (buttonName === "find") {
            navigate("/lobby");
        } else if (buttonName === "create") {
            navigate("/create");
        }
    }

    return (
        <div className="main">
            {/* TODO: fix bolding */}
            <h1>
                <b>Tycoon</b>
            </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" id="username" required />
                </label>
                <button type="submit" id="find">
                    Find Lobby
                </button>
                <button type="submit" id="create">
                    Create Lobby
                </button>
            </form>
            <button type="button">How to Play</button>
            <a
                href="https://github.com/Wevie0/Tycoon"
                target="_blank"
                rel="noreferrer"
            >
                <img
                    src={require("./images/github-mark.png")}
                    alt="GitHub Logo"
                />
            </a>
        </div>
    );
}
