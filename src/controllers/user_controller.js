const {StatusCodes} = require('http-status-codes')
const { UserService } = require('../services');
const {SuccessResponse, ErrorResponse} = require('../utils/common')


/**
 * POST : / signup
 * req-body {email - abc@gamil.com, password: '123}
 */
async function createUser(req, res){
    try {
        const response = await UserService.createUser({
            email: req.body.email,
            password: req.body.password,
        })
        SuccessResponse.data = response;
        return res
                 .status(StatusCodes.CREATED)
                 .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                  .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                  .json(ErrorResponse);
    }
}


async function signin(req, res){
    try {
        const response = await UserService.sigin({
            email: req.body.email,
            password: req.body.password,
        })
        SuccessResponse.data = response;
        return res
                 .status(StatusCodes.CREATED)
                 .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                  .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                  .json(ErrorResponse);
    }
}

module.exports = {
    createUser,
    signin
}
