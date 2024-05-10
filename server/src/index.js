const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createServer } = require('node:http');
const app = express();
const adminRouter = require('./routes/adminRouter.js');
const authRouter = require('./routes/authRouter.js')
const User = require('./models/user.model.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { Server } = require('socket.io');

app.use('/admin' , adminRouter);
app.use('/auth' , authRouter);



const server = createServer(app);
const io = new Server(server , {
    cors :{
        origin : "*"
    }
});

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
}
connectToMongoDB();






io.on("connection" , (socket)=>{
    console.log(`User ${socket.id}  Connected`);
    socket.emit('message' , 'Welcome to chat app')

    socket.on("createRoom", (data) => {
        try {
            const token = data ;
            const {username} = jwt.verify(token , process.env.JWT_SECRET);
            const roomId = `room_${socket.id}`; // Generate a unique room ID, e.g., room_<userId>
            console.log(roomId)
            socket.join(roomId); // Join the room
            io.to(roomId).emit("message", `${username} has joined`);
            console.log(`User ${socket.id} joined room ${roomId}`);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    });
    socket.on("joinRoom" , async (data)=>{

        try {
            console.log(data);
            const {roomId ,token} = data ;
            const {username} = jwt.verify(token , process.env.JWT_SECRET);
            socket.join(roomId); // Join the room
            io.to(roomId).emit("message", `${username} has joined`);
            io.to(roomId).emit("closeRoom" , ``)
            
        } catch (error) {
            console.error('Error creating room:', error);
        }

    });
    socket.on("leaveRoom" , (roomId)=>{
        try {
            console.log("Admin leaving room" , roomId)
            io.to(roomId).emit("message", `${socket.id.substring(0,5)} has left`);
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    })

    socket.on("adminMessage", (data) => {
        const { message, roomId , token } = data;
        const {username} = jwt.verify(token , process.env.JWT_SECRET);
        io.to(roomId).emit("message", `${username} : ${message}`);
        console.log(`Admin sent message to room ${roomId}: ${message}`);
    });
    socket.on("message" , async (data)=>{
        console.log(data.message)
        const token = data.token ;
        const {username} = jwt.verify(token , process.env.JWT_SECRET);
        io.to(`room_${socket.id}`).emit("message" , `${username} : ${data.message}`);
        const user = await User.findOneAndUpdate(
            {username : username}, 
            { $push: { messages: data.message} , $set : {SID : socket.id , roomID : `room_${socket.id}`}} ,
        );
        await user.save();
        console.log(user);
        console.log('Inserted into database');
    });

    socket.on('disconnect', async () => {
        io.to(`room_${socket.id}`).emit('message' , `${socket.id.substring(0,5)} disconnected`);
        console.log("user disconnected")
        await User.findOneAndUpdate({SID : socket.id} , {$unset :{SID:1 , roomID:1}, $set : {messages : [] }});
    });

    socket.on('activity' , (name)=>{
        socket.broadcast.emit('activity' , name)
    })
});



server.listen(3000, async() => {
    console.log(`Server running on port ${3000}`);
});

