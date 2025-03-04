const userModel = require('../models/user.model');


module.exports.createUser = async ({
    firstname,lastname, email, password
}) => {
    if(! firstname || ! email || ! password) {
        throw new Error('Please provide all fields');
    }
    return userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });
}