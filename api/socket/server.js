const SocketServer = require('socket.io')

const {createServer} = require('http')
const app = require('../app')

const Socket = SocketServer.Server

const server = createServer(app)
const io=new Socket(server, {
  cors:{
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})


let rooms = {};
let key=0

io.on("connection", (socket)=>{
  socket.on("sale", (roomId) => {
  
    if (!rooms[roomId]) {
      // Si la sala no existe, la crea
      rooms[roomId] = { users: [socket.id] };
      socket.join(roomId);
      socket.emit("success", {roomId});
    } else {
      // Si la sala ya existe, emite un mensaje de error
      socket.emit("roomError", {error:"room already exists"});
    }
  });

  socket.on("search", (roomId) => {
    if (rooms[roomId]) {
      // Si la sala existe, se une a la sala
      rooms[roomId].users.push(socket.id);
      socket.join(roomId);
      socket.emit("success", {roomId});
    } else {
      // Si la sala no existe, emite un mensaje de error
      socket.emit("roomError", {error:"room not found"});

    }
  });


  socket.on("disconnect", () => {
    // Elimina al usuario de todas las salas en las que esté
    for (let roomId in rooms) {
      if (rooms[roomId].users.includes(socket.id)) {
        rooms[roomId].users.splice(rooms[roomId].users.indexOf(socket.id), 1);
        socket.leave(roomId);
      }
    }
  });

  socket.on("chat", (message) => {
    io.to(message.id).emit("chat", {body:message.body, to:socket.id, key:key++});
  });

  
  socket.on("loading", ({id,body}) => {
    socket.to(id).emit("loading", body);
  });
  
  socket.on("play", (play) => {
    io.to(play.id).emit("play", "play");
  });
  
  socket.on("game", (game) => {
    socket.to(game.id).emit("success", {body:game.body, to:socket.id});
  });

})
module.exports = server