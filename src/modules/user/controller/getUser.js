const { NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      Get user by ID
 * @access    Private/admin
 */
const getUser = async(userId) => {
    const user = await User.findById(userId);
    if(!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = getUser;