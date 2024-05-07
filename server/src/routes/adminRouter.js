const getAllClient = require('../controllers/adminControllers.js')
const adminRouter = require('express').Router();

adminRouter.get('/queueList' , getAllClient);
module.exports = adminRouter ;