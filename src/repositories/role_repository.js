const CrudRepository = require('./crud_repository');
const {Role} = require('../models')

class RoleRepository extends CrudRepository{
    constructor(){
        super(Role);
    }

    async getRoleByName(name, options = {}){
        const role =  await Role.findOne({
            where : {name: name},
            ...options
        })
        return role ;
    }

    async getRoleById(id){
        const role = await Role.findByPk(id);
        return role;
    }
}


module.exports = RoleRepository
