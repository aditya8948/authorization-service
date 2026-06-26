const { StatusCodes } = require('http-status-codes');
const {UserRepository} = require('../repositories');
const AppError  = require('../utils/errors/app_error');
const {Auth} = require('../utils/common')
const bcrypt = require('bcrypt');

const userRepository = new UserRepository();

async function createUser(data){
    try {
        const user = await userRepository.create(data);
        return user ;
    } catch (error) {
      
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw error;
    }
}

async function sigin(data){
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No user found for the given email' , StatusCodes.NOT_FOUND)
        }
        const passwordMatch = await Auth.checkPassword(data.password, user.password);

        if(!passwordMatch){
             throw new AppError('INVALID PASSWORD' , StatusCodes.BAD_REQUEST)
        }

        const jwt = await Auth.createToken({id:user.id, email: user.email});
        return jwt;
    } catch (error) {
        throw new AppError('something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isAuthenticated(token) {
    try {
        if(!token){
            throw new AppError('Missing JWT token ', StatusCodes.BAD_REQUEST)
        }
        const response =  await Auth.verifyToken(token);
        const user = await userRepository.get(response.id);
        if(!user){
            throw new AppError('No user found ', StatusCodes.NOT_FOUND )
        }
        return user.id
    } catch (error) {
        if(error.name =='JsonWebTokenError'){
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST)
        }
        throw error;
    }
}



module.exports = {
        createUser, 
        sigin,
        isAuthenticated
}
