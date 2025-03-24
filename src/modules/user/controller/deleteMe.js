const { NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      Delete logged user data 
 * @access    Private/admin - user
 */
const deleteMe = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if(!user) {
        throw new NotFoundError('User not found');
    }
    return 'Your account has been deleted';;
};

module.exports = deleteMe;
