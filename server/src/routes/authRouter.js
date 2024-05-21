const authRouter = require('express').Router();
const {authController , saveClient} = require('../controllers/authController.js');
authRouter.post('/login' , authController);
authRouter.post('/saveClient' , saveClient);

module.exports = authRouter ;