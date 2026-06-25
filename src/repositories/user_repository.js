const CrudRepository = require('./crud_repository');
const {User} = require('../models')

class UserRepository extends CrudRepository{
    constructor(){
        super(User);
    }
}


module.exports = UserRepository