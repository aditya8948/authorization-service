const { StatusCodes } = require("http-status-codes");

const {ErrorResponse} = require('../utils/common');
const {UserService} = require('../services');

function getTokenFromRequest(req) {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
        return Array.isArray(accessToken) ? accessToken[0] : accessToken;
    }

    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return undefined;
    }

    const bearerMatch = authorizationHeader.match(/^Bearer\s+(.+)$/i);
    return bearerMatch ? bearerMatch[1].trim() : undefined;
}

function validateAuthRequest(req , res, next) {
    if(!req.body.email){
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse({
                    message: 'Something went wrong while authenticating User ',
                    error: 'Email not found in the incoming request in the correct form '
                }))
    }
     if(!req.body.password){
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse({
                    message: 'Something went wrong while authenticating User ',
                    error: 'password not found in the incoming request in the correct form '
                }))
    }
    next();
}

async function checkAuth(req, res, next) {
    try{
    const response = await UserService.isAuthenticated(getTokenFromRequest(req));
    if(response){
        req.user = response;
        next();
    }
    } catch(error){
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse({ error }))
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
