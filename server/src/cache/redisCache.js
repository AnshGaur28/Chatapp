const { createClient } = require('redis');


const createRedisCache =  async ()=>{
    const client = await  createClient();
    await client.connect();
    return client
}
module.exports = createRedisCache