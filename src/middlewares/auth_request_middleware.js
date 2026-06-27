const { StatusCodes } = require("http-status-codes");

const {ErrorResponse} = require('../utils/common');
const {UserService} = require('../services');
const { message } = require("../utils/common/error_response");

function validateAuthRequest(req , res, next) {
    if(!req.body.email){
        ErrorResponse.message = 'Something went wrong while authenticating User ';
        ErrorResponse.error = 'Email not found in the incoming request in the correct form '
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
    }
     if(!req.body.password){
        ErrorResponse.message = 'Something went wrong while authenticating User ';
        ErrorResponse.error = 'password not found in the incoming request in the correct form '
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
    }
    next();
}

async function checkAuth(req, res, next) {
    try{
    const response = await UserService.isAuthenticated(req.headers['x-access-token']);
    if(response){
        req.user = response;
        next();
    }
    } catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json(error)
    }
}


async function isadmin(req, res, next){
    try {
        const response = await UserService.isadmin(req.user)
        if(!response){
            return res.status(StatusCodes.UNAUTHORIZED).json({message: 'user is not authorized'})
        }
        next();
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
module.exports = {
    validateAuthRequest,
    checkAuth,
    isadmin
};