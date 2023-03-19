const SocketServer = require("socket.io");

const { createServer } = require("http");
const app = require("../app");

const Socket = SocketServer.Server;

const server = createServer(app);
const io = new Socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let rooms = new Map();
let key = 0;

io.on("connection", (socket) => {
  socket.on("sale", (roomId) => {
    if (!rooms.get(roomId)) {
      // Si la sala no existe, la crea
      rooms.set(roomId, { users: [socket.id] });
      socket.join(roomId);
      socket.emit("success", { roomId });
    } else {
      // Si la sala ya existe, emite un mensaje de error
      socket.emit("roomError", { error: "room already exists" });
    }
  });

  socket.on("search", (roomId) => {
    const roomFind = rooms.get(roomId);
    //max 2 personas por room

    if (roomFind?.users.length === 2) {
      socket.emit("roomError", { error: "full room" });
      return;
    }

    if (roomFind) {
      // Si la sala existe, se une a la sala
      roomFind.users.push(socket.id);
      rooms.set(roomId, roomFind);
      socket.join(roomId);
      socket.emit("success", { roomId });
    } else {
      // Si la sala no existe, emite un mensaje de error
      socket.emit("roomError", { error: "room not found" });
    }
  });

  socket.on("disconnect", () => {
    // Elimina al usuario de todas las salas en las que esté
    rooms.forEach((_, roomId) => {
      if (rooms.get(roomId).users?.includes(socket.id)) {
        rooms.get(roomId).users.splice(rooms.get(roomId).users.indexOf(socket.id), 1);
        socket.leave(roomId);
        if (!rooms.get(roomId)?.users?.length) {
          rooms.delete(roomId)
        }
      }
    });
  });

  socket.on("chat", (message) => {
    io.to(message.id).emit("chat", {
      body: message.body,
      to: socket.id,
      key: key++,
    });
  });

  socket.on("loading", ({ id, body }) => {
    socket.to(id).emit("loading", body);
  });

  socket.on("play", (play) => {
    io.to(play.id).emit("play", "play");
  });

  socket.on("game", (game) => {
    socket.to(game.id).emit("success", { body: game.body, to: socket.id });
  });
});
module.exports = server;
