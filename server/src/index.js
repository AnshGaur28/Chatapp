const express = require("express");
const cors = require('cors');
const { createServer } = require('node:http');
const app = express();
const adminRouter = require('./routes/adminRouter.js');
const User = require('./models/user.model.js');
const mongoose = require('mongoose');
require('dotenv').config();
app.use(cors());
const { Server } = require('socket.io');

app.use('/admin' , adminRouter);



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

    socket.on("createRoom", () => {
        try {
            const roomId = `room_${socket.id}`; // Generate a unique room ID, e.g., room_<userId>
            console.log(roomId)
            socket.join(roomId); // Join the room
            // io.to(roomId).emit("message", `${socket.id.substring(0,5)} has joined`);
            console.log(`User ${socket.id} joined room ${roomId}`);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    });
    socket.on("joinRoom" , (roomId)=>{

        try {
            console.log(roomId)
            socket.join(roomId); // Join the room
            io.to(roomId).emit("message", `${socket.id.substring(0,5)} has joined`);
        } catch (error) {
            console.error('Error creating room:', error);
        }

    })

    socket.on("adminMessage", (data) => {
        const { message, roomId } = data;
        io.to(roomId).emit("message", `${socket.id.substring(0,5)} : ${message}`);
        console.log(`Admin sent message to room ${roomId}: ${message}`);
    });
    socket.on("message" , async (data)=>{
        io.to(`room_${socket.id}`).emit("message" , `${socket.id.substring(0,5)} : ${data.message}`);
        const existingUser = await User.findOne({ SID: socket.id });
        if (existingUser) {
            await User.findOneAndUpdate(
                { SID: socket.id }, 
                {roomID : `room_${socket.id}`},
                { $push: { messages: data.message } } ,
            );
        } else {
            const newUser = new User({
                SID: socket.id,
                messages: [data.message], 
                roomID : `room_${socket.id}`,
            });
            await newUser.save();
        }
        console.log('Inserted into database');
    });

    socket.on('disconnect', async () => {
        io.to(`room_${socket.id}`).emit('message' , `${socket.id.substring(0,5)} disconnected`);
        await User.findOneAndDelete({SID : socket.id});
        await User.findOneAndDelete({roomID : `room_${socket.id}`});
        console.log("Deleted from database")
        
    });

    socket.on('activity' , (name)=>{
        socket.broadcast.emit('activity' , name)
    })
});



server.listen(3000, async() => {
    console.log(`Server running on port ${3000}`);
});

