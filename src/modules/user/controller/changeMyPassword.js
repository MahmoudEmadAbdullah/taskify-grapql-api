const bcrypt = require('bcrypt');
const { NotFoundError, BadRequestError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      change logged user password 
 * @access    Private/admin - user
 */
const changeMyPassword = async (userId, input) => {
    const { currentPassword, newPassword } = input;

    const user = await User.findById(userId);
    if(!user) {
        throw new NotFoundError('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordCorrect) {
        throw new BadRequestError('Current password is incorrect');
    }
    
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    return 'Password changed successfully';
};

module.exports = changeMyPassword;

