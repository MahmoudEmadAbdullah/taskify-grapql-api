const { NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      Update logged user data 
 * @access    Private/admin - user
 */
const updateMe = async (userId, input) => {
    const {password, ...updateData} = input;
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

module.exports = updateMe;