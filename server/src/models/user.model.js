const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username : {
        type : String ,
        required : true ,
    },
    password : {
        type : String ,
    },
    role : {
        type : String ,
        required : true ,
    },
    SID :{
        type : String ,
    },
    messages : [{
        content : {
            type :[String],
            default : [],
        },
        username : {
            type : String ,
        },
        time : {
            type: String,
        },
        role : {
            type : String,
        }
    }],
    roomID : {
        type : String ,
    },
    closed : {
        type : Boolean ,
        default : false ,
    },
    mobile : {
        type : Number ,
    },
    email : {
        type : String ,
    }

});

const User = mongoose.model("User" , userSchema);

module.exports = User ;