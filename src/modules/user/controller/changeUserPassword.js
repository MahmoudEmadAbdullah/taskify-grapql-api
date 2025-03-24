const bcrypt = require('bcrypt');
const { NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      Change user password by ID
 * @access    Private/admin
 */
const changeUserPassword = async({ userId, newPassword }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { password: hashedPassword } },
        { new: true, runValidators: true }
    );

    if(!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

module.exports = changeUserPassword;