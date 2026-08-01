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
        return res
                 .status(StatusCodes.CREATED)
                 .json(SuccessResponse({ data: response }))
    } catch (error) {
        return res
                  .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                  .json(ErrorResponse({ error }));
    }
}


async function signin(req, res){
    try {
        const response = await UserService.signin({
            email: req.body.email,
            password: req.body.password,
        })
        return res
                 .status(StatusCodes.CREATED)
                 .json(SuccessResponse({ data: response }))
    } catch (error) {
        return res
                  .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                  .json(ErrorResponse({ error }));
    }
}


async function addRoleToUser(req, res){
    try {
        const response = await UserService.addRoleToUser({
            role: req.body.role,
            id: req.body.id
        })
        return res
                 .status(StatusCodes.CREATED)
                 .json(SuccessResponse({ data: response }))
    } catch (error) {
        return res
                  .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                  .json(ErrorResponse({ error }));
    }
}





module.exports = {
    createUser,
    signin,
    addRoleToUser
}
