const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    SID :{
        type : String ,
        required : true ,
    },
    messages : {
        type : [String],
    },
    roomID : {
        type : String ,
    }

});

const User = mongoose.model("User" , userSchema);

module.exports = User ;