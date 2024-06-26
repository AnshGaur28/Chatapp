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
const Room = require("./models/room.model.js");
const { timeStamp } = require("node:console");

app.use('/admin', adminRouter);
app.use('/auth', authRouter);



const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
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






io.on("connection", (socket) => {
    console.log(`User ${socket.id}  Connected`);
    // socket.emit('message', {content : 'Welcome to chat app'})

    socket.on("createRoom", async (data) => {
        try {
            const token = data;
            const { username } = jwt.verify(token, process.env.JWT_SECRET);
            const roomId = `room_${socket.id}`; // Generate a unique room ID, e.g., room_<userId>
            socket.join(roomId); // Join the room
            // io.to(roomId).emit("message", {content : `${username} has joined`});
            console.log(`User ${socket.id} joined room ${roomId}`);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    });
    socket.on("joinRoom", async (data) => {

        try {
            console.log(data);
            const { roomId, token } = data;
            const { username } = jwt.verify(token, process.env.JWT_SECRET);
            socket.join(roomId); // Join the room
            await User.findOneAndUpdate({username : username , role : "admin"} , {$set : {SID : socket.id, closed: true}})
            await User.findOneAndUpdate({ roomID: roomId }, { $set: { closed: true  } });
            // io.to(roomId).emit("message", {content : `${username} has joined`});
        } catch (error) {
            console.error('Error creating room:', error);
        }

    });
    socket.on('updateAdmin' , async(username)=>{
        try {
            const admin = await User.findOneAndUpdate({username : username , role : "admin"} , { $set : {SID : socket.id}});
            console.log("updated admin" , admin);
        } catch (error) {
            console.error('Error Updating room:', error);
        }
    })
    socket.on("leaveRoom", async ({roomId , token}) => {
        try {
            console.log("Admin leaving room", roomId)
            // io.to(roomId).emit("message", {content : `Admin has left`});
            const { username } = jwt.verify(token, process.env.JWT_SECRET);
            await User.findOneAndUpdate({username , role : "admin"} , {$unset : {SID : 1} , $set: { closed: false }});
            await User.findOneAndUpdate({ roomId }, { $set: { closed: false }});
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    })
    socket.on("transferRequest", async ({ roomId , adminSID  }) => {
        console.log(roomId , adminSID) ;
        try {
            console.log('Inside Transfer Request');
            io.to(adminSID).emit("transferRequest" , roomId);
        } catch (error) {
            console.error('Error Transfering room:', error);
        }
    })

    socket.on("clientLeaveRoom", async () => {
        try {
            console.log("Client leaving room")
            await User.findOneAndUpdate({ SID: socket.id }, { $set: { messages: [] } , $unset : {roomID:1 , SID:1 , closed : 1} });
            // io.to(`room_${socket.id}`).emit("message", {content :`Client has left`});
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    })

    socket.on("adminMessage", async (data) => {
        const { message, roomId, token , time } = data;
        const { username , role} = jwt.verify(token, process.env.JWT_SECRET);
        const messageObj =  {username : username , content : `${message}` ,  time : time  , role : role} ;
        console.log("admin" , messageObj)
        io.to(roomId).emit("message", messageObj);
        console.log(`Admin sent message to room ${roomId}: ${message}`);
        const user = await User.findOneAndUpdate(
            { roomID: roomId },
            { $push: { messages: {username : username  , content :`${data.message}` , time :  data.time , role : role } } },
        );
    });
    socket.on("message", async (data) => {
        console.log('message', data.message)
        const token = data.token;
        const { username , role } = jwt.verify(token, process.env.JWT_SECRET);
        const messageObj =  {username : username ,  content : `${data.message}` ,  time : data.time , role : role } ;
        console.log("client" , messageObj)
        io.to(`room_${socket.id}`).emit("message", messageObj);
        const user = await User.findOneAndUpdate(
            { username: username , role : "client" },
            { $push: { messages: { username : username , content :`${data.message}` , time :  data.time , role : role }}, $set: { SID: socket.id, roomID: `room_${socket.id}` } },
        );
        await user.save();
        console.log(user);
        console.log('Inserted into database');
    });
    socket.on('uploadFile' , async (data , callback)=>{
        console.log(data);
        const token = data.token ;
        const { username , role } = jwt.verify(token, process.env.JWT_SECRET);
        console.log(username , role);
        const file = data.file.toString('base64')
        io.to(data.roomId).emit("fileUploaded", {file : file  , fileType : data.fileType ,fileName : data.fileName , roomId : data.roomId , username : username , role : role});
        callback('File received successfully');
    });

    socket.on('disconnect', async () => {
        console.log("Disconnecting")
        // io.to(`room_${socket.id}`).emit('message', `${socket.id.substring(0, 5)} disconnected`);
        console.log("user disconnected")
        await User.findOneAndUpdate({ SID: socket.id }, { $unset: { SID: 1, roomID: 1 }, $set: { messages: [], closed: false } });
    });

    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
});



server.listen(3000, async () => {
    console.log(`Server running on port ${3000}`);
});

