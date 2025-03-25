const { ValidationError } = require('../../../utils/errors');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');
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
    // Delete users from cache
    try {
        await deleteCacheKeys('users:*');
    } catch(err) {
        console.error('Error deleting cache keys:', err);
    }

    return newUser;
};

module.exports = createUser;