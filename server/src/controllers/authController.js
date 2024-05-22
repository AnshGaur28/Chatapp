const User = require('../models/user.model.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authController = async (req ,res)=>{
    // console.log("Controller is hit")

    try {
        const {username , password , role} = req.body;
        const user = await User.findOne({
            username: username,
        });
          if (!user) {
            res.status(401).send({ message: "No such user was found 1" });
          }
          if(user.role != role){
            res.status(401).send({ message: "No such user was found 2" });
          }
        
          const saltRounds = 10; 
          const hashedPassword = await bcrypt.hash(password, saltRounds);
        //   console.log(process.env.JWT_SECRET);
          const token = await jwt.sign(
            {
              username : username ,
              password: hashedPassword,
              role: role,
            },
            process.env.JWT_SECRET
          );
        //   console.log(token);
          return res.status(200).send({ message: "Logged in successfully 😊 👌" , jwt : token });
        } catch (error) {
          console.log("Login Controller Failed" , error.message);
          res.status(500).send({ error: 'Internal Server Error' });
        }
}

const saveClient = async(req , res)=>{
  const {username , role , email , mobile} = req.body ;
  try {
    const existUser = await User.findOne({username : username , role : role , email : email , mobile : mobile })
    if(existUser){
      const token =  jwt.sign(
        {
          username : username ,
          email : email,
          mobile : mobile ,
          role: role,
        },
        process.env.JWT_SECRET
      );
      return res.status(200).send({message : "Successfully saved Client" , jwt : token });
    }
    const newUser = new User({
      username : username ,
      role : role ,
      email : email ,
      mobile : mobile ,
    });
    await newUser.save() ;
    const token = await jwt.sign(
      {
        username : username ,
        email : email,
        mobile : mobile ,
        role: role,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).send({message : "Successfully saved Client" , jwt : token });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' })
  }
}

module.exports = {authController , saveClient} ;