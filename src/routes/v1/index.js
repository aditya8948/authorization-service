const express = require('express');

const { InfoController } = require('../../controllers');
const{authRequestMiddleware} = require('../../middlewares')

const router = express.Router();

const userRoutes = require('./user_routes');

router.get('/info', 
    InfoController.info);

router.use('/user', userRoutes)

module.exports = router;  