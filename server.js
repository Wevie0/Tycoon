"use strict"

let express = require('express');
let socket = require("socket.io");
let app = express();
let server = app.listen(4000, function () {
    console.log("listening to requests on port 4000")
});

let players = [];
let id = 0;

app.use(express.static('public'));

let io = socket(server);

io.on("connection", function (socket) {
    console.log("made socket connection", socket.id);
});

io.on("connection", (socket) => {
    socket.on("player", (arg) => {
        io.emit("id", id);
        id++;
        players.push(arg);
        console.log(players);
    });

});

if (players.length === 4) {
    console.log("Begin!");
}