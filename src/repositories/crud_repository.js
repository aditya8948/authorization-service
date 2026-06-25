const { StatusCodes } = require('http-status-codes');
const {Logger} = require('../config');
const AppError = require('../utils/errors/app_error');

class crudRepository {
    constructor(model){
        this.model = model;
    }


async create(data, options = {}){
        const response = await this.model.create(data, options);
        return response;
    
 }

async destroy(data){
        const response = await this.model.destroy({
            where:{
                id: data
            }
        });
        if(!response){
             throw new AppError('Not able to found the resource ', StatusCodes.NOT_FOUND);
        }
        return response;
    
}

async get(data){
        const response = await this.model.findByPk(data);
        if(!response){
            throw new AppError('Not able to found the resource ', StatusCodes.NOT_FOUND);
        }
        return response;
    
}

async getAll(){
        const response = await this.model.findAll();
        return response;
   
}

async update(id , data){
        const [response] = await this.model.update(data, {
            where: { id }
        });
        if(response === 0){
            throw new AppError('not able to find resource on this id ');
        }
        return await this.model.findByPk(id);
}

}

module.exports = crudRepository;
