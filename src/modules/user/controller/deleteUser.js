const { NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      Delete User by id
 * @access    Private/admin
 */
const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if(!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = deleteUser;

