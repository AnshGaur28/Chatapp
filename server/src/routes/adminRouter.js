const {getAllClient} = require('../controllers/adminControllers.js')
const adminRouter = require('express').Router();
const {getRoomHistory} = require('../controllers/adminControllers.js')
adminRouter.get('/queueList' , getAllClient);
adminRouter.get('/getRoomHistory' , getRoomHistory);
module.exports = adminRouter ;