const authRouter = require('express').Router();
const authController = require('../controllers/authController.js');
authRouter.post('/login' , authController);

module.exports = authRouter ;