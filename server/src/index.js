const express = require("express");
const cors = require('cors');
const { createServer } = require('node:http');
const app = express();
app.use(cors());
const { Server } = require('socket.io');

app.use('/' , (res)=>{
    return res.status(200).send("Wohoo!!!!")
})

const server = createServer(app);
const io = new Server(server , {
    cors :{
        origin : "*"
    }
});

io.on("connection" , (socket)=>{
    console.log(`User ${socket.id}  Connected`);
    // Send message only to the user
    socket.emit('message' , 'Welcome to chat app')
    // send message to all other uses 
    socket.broadcast.emit('message' , `${socket.id.substring(0,5)} has connected`);

    socket.on("message" , (message)=>{
        io.emit("message" , `${socket.id.substring(0,5)} : ${message}`);
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('message' , `${socket.id.substring(0,5)} disconnected`);
    });

    socket.on('activity' , (name)=>{
        socket.broadcast.emit('activity' , name)
    })
});

server.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
});

