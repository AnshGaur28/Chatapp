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
    return res.status(500).send({ message: " Internal Servver Error" });
  }
};

const getRoomHistory = async (req, res) => {
  try {
    const roomId = req.query.roomId ;
    console.log(roomId);
    const clientData = await User.findOne(
      { roomID: roomId },
      "messages , username"
    );
    return res.status(200).send({username : clientData.username , historyMessages : clientData.messages});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: " Internal Servver Error" });
  }
};
const getAdmins = async(req, res)=>{
  try {
      const admins = await User.find({role : "admin"});
      // console.log(admins);
      res.status(200).send({admins});
  } catch (error) {
    res.status(500).send("Internal Server Error" , error.message);
  }
}
module.exports = { getAllClient, getRoomHistory , getAdmins };
