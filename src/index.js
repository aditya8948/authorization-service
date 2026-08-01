const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');


const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 5,
});

const createServiceProxy = (servicePrefix, target) => createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
        [`^${servicePrefix}`]: '',
    },
});

app.use(limiter);

app.use('/flightService', createProxyMiddleware({
        target:ServerConfig.FLIGHT_SERVICE,
        changeOrigin:true, 
        pathRewrite: {'^/flightService' : '/'}  
    }));

app.use('/bookingService', createProxyMiddleware({
        target:ServerConfig.BOOKING_SERVICE,
        changeOrigin:true, 
        pathRewrite: {'^/bookingService' : '/'}  
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
