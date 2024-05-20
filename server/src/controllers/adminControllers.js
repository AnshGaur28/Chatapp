const User = require("../models/user.model.js");
const getAllClient = async (req, res) => {
  try {
    const clients = await User.find({
      SID: { $exists: true },
      role: "client",
    }).select("SID username closed");
    return res.status(200).send({ clients });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: " Internal Server Error" });
  }
};

const getRoomHistory = async (req, res) => {
  try {
    const roomId = req.query.roomId ;
    console.log(roomId);
    const clientData = await User.findOne(
      { roomID: roomId },
      "messages , username , role"
    );
    return res.status(200).send({username : clientData.username , historyMessages : clientData.messages , role : clientData.role});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: " Internal Servver Error" });
  }
};
const getClientWithSID = async(req, res)=>{
    console.log("Inside getClientWithSID")
    try {
      const userSID = req.query.SID ;
      console.log(userSID);
      const user = await User.findOne({SID : userSID}).select("SID username closed");
      console.log("user" , user);
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: " Internal Servver Error" });
    }
}
const getAdmins = async(req, res)=>{
  try {
      const admins = await User.find({role : "admin"});
      // console.log(admins);
      res.status(200).send({admins});
  } catch (error) {
    res.status(500).send("Internal Server Error" , error.message);
  }
}
module.exports = { getAllClient, getRoomHistory , getAdmins  , getClientWithSID};
