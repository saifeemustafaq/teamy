// serve.js

const express = require("express"); // express js ki lib call ho rahi hai
const app = express(); // function pass kar rahe hai app mai

const server = require("http").Server(app); // bata rahe hai ki http use karna hai

const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

app.set("view engine", "ejs"); //view engine ka syntax hai

app.use(express.static("public")); // here we are exposing the public folder by default for Express to access it.

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
  //console.log(params);
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });
});

server.listen(3030); // iss port pe trigger honga
