const redisCache = require('../cache/redisCache.js');
const getAllClient = async(req, res)=>{
    console.log("Inside GetClients Controller")
    try {
        const clients = await redisCache.keys("*");
        console.log(clients);
        return res.status(200).send({clients});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message : " Internal Servver Error" });
    }
}

module.exports = getAllClient ;