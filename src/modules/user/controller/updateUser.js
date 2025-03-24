const { NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      update user by ID
 * @access    Private/admin
 */
const updateUser = async({ userId, input }) => {
    const { password, ...updateData } = input;
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    );
    if(!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = updateUser;