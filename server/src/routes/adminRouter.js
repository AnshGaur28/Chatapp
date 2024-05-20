const {getAllClient} = require('../controllers/adminControllers.js')
const adminRouter = require('express').Router();
const {getAdmins}  = require('../controllers/adminControllers.js')
const {getRoomHistory , getClientWithSID} = require('../controllers/adminControllers.js')
adminRouter.get('/queueList' , getAllClient);
adminRouter.get('/getRoomHistory' , getRoomHistory);
adminRouter.get('/getAdmins' , getAdmins);
adminRouter.get('/getClientWithSID' , getClientWithSID );
module.exports = adminRouter ;