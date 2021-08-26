"use strict"

let express = require('express');
let socket = require("socket.io");
let app = express();
let server = app.listen(4000, function () {
    console.log("listening to requests on port 4000")
});

let players = [];
let deck = [];
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
    socket.on("deck", (arg) => {
        deck = arg;
        socket.emit("deck", arg);
    });

});

if (players.length === 4) {
    console.log("Begin!");
}