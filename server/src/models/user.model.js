const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username : {
        type : String ,
        required : true ,
    },
    password : {
        type : String ,
        required : true ,
    },
    role : {
        type : String ,
        required : true ,
    },
    SID :{
        type : String ,
    },
    messages : {
        type : [String],
        default:  [] ,
    },

    roomID : {
        type : String ,
    },
    closed : {
        type : Boolean ,
        default : false ,
    }

});

const User = mongoose.model("User" , userSchema);

module.exports = User ;