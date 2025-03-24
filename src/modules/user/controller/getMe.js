const { NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      Get logged user data 
 * @access    Private/admin - user
 */
const getMe = async (userId) => {
    const user = await User.findById(userId).select('-password -__v');
    if(!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = getMe;