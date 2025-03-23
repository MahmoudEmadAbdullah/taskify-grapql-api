const { ValidationError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      Create a new user
 * @access    Private/admin
 */
const createUser = async (input) => {
    const { name, email, password, role } = input;
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new ValidationError('User already exists');
    }
    const newUser = await User.create({
        name,
        email,
        password,
        role
    });
    return newUser;
};

module.exports = createUser;