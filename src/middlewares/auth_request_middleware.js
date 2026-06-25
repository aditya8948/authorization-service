const { StatusCodes } = require("http-status-codes");

const {ErrorResponse} = require('../utils/common');

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

module.exports = {
    validateAuthRequest
};