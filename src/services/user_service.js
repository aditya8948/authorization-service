const { StatusCodes } = require('http-status-codes');
const {UserRepository, RoleRepository} = require('../repositories');
const AppError  = require('../utils/errors/app_error');
const {Auth, Enums} = require('../utils/common')
const bcrypt = require('bcrypt');

const roleRepository = new RoleRepository();
const userRepository = new UserRepository();

async function createUser(data){
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES.CUSTOMER)
        await user.addRole(role)
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

async function signin(data){
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
        if(error instanceof AppError){
            throw error;
        }
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
        if(error.name === 'TokenExpiredError'){
            throw new AppError('JWT token has expired', StatusCodes.UNAUTHORIZED)
        }
        if(error.name === 'JsonWebTokenError'){
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST)
        }
        if(error.name === 'NotBeforeError'){
            throw new AppError('JWT token is not active', StatusCodes.UNAUTHORIZED)
        }
        throw error;
    }
}


async function addRoleToUser(data){
    try {
        const user = await userRepository.get(data.id);
        if(!user){
            throw new AppError('No user found for the given id' , StatusCodes.NOT_FOUND)
        }

        let role;
        const roleValue = data.role;
        if (roleValue === undefined || roleValue === null) {
            throw new AppError('Missing role value', StatusCodes.BAD_REQUEST);
        }

        if (typeof roleValue === 'number' || /^\d+$/.test(String(roleValue))) {
            role = await roleRepository.getRoleById(Number(roleValue));
        } else {
            role = await roleRepository.getRoleByName(roleValue);
        }

        if(!role){
            throw new AppError('No role found for the given identifier' , StatusCodes.NOT_FOUND)
        }

        const hasRoleAssigned = await user.hasRole(role);
        if (!hasRoleAssigned) {
            await user.addRole(role);
        }
        return user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw error;
    }
}

async function isadmin(id){
    try {
        const user = await userRepository.get(id);
        if(!user){
            throw new AppError('No user found for the given id' , StatusCodes.NOT_FOUND)
        }
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES.ADMIN);
        if(!role){
            throw new AppError('No role found for the given name' , StatusCodes.NOT_FOUND)
        }
        return user.hasRole(role)
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw error;
    }
}

module.exports = {
        createUser, 
        signin,
        isAuthenticated,
        addRoleToUser,
        isadmin
}
