const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    roomID : {
        type : String ,
    },
    closed : {
        type : Boolean,
        default : false ,
    }
});

const Room = mongoose.model('Room' , roomSchema);
module.exports = Room;