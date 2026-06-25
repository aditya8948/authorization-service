const express = require('express');

const router = express.Router();
const{UserController} = require('../../controllers');
const{authRequestMiddleware} = require('../../middlewares')

router.post('/signup',
    authRequestMiddleware.validateAuthRequest,
    UserController.createUser
);

router.post('/signin' ,
     authRequestMiddleware.validateAuthRequest,
     UserController.signin);  

module.exports = router;