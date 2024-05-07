const express = require("express");
const cors = require('cors');
const { createServer } = require('node:http');
const app = express();
const adminRouter = require('./routes/adminRouter.js');
app.use(cors());
const { Server } = require('socket.io');

app.use('/admin' , adminRouter);



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

    socket.on("message" , async (data)=>{
        io.emit("message" , `${socket.id.substring(0,5)} : ${data.message}`);
        // Store this users socket information in a data store from where our admins can connect to the clients
        // await redisCache.send(socket.id, data.message);
    });

    socket.on('disconnect', async () => {
        socket.broadcast.emit('message' , `${socket.id.substring(0,5)} disconnected`);
        // await redisCache.del(socket.id);
    });

    socket.on('activity' , (name)=>{
        socket.broadcast.emit('activity' , name)
    })
});

server.listen(3000, async() => {
    console.log(`Server running on port ${3000}`);
});

