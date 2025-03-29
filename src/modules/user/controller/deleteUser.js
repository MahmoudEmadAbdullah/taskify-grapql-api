const { NotFoundError, ForbiddenError } = require('../../../utils/errors');
const { client } = require('../../../config/redisConfig');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');
const User = require('../../../../DB/models/userModel');


/**
 * @desc      Delete User by id
 * @access    Private/admin
 */
const deleteUser = async (userId, currentUserId) => {
    if(userId === currentUserId) {
        throw new ForbiddenError('You cannot delete yourself');
    }
    const adminCount = await User.countDocuments({ role: 'admin' });

    const user = await User.findById(userId);
    if(!user) {
        throw new NotFoundError('User not found');
    }
    if(user.role === 'admin' && adminCount <= 1) {
        throw new ForbiddenError('Cannot delete the last remaining admin');
    }
    await User.findByIdAndDelete(userId);

    const cacheKey = `user:${userId}`;
    try {
        await client.del(cacheKey);
        await deleteCacheKeys('users:*');
    } catch(err) {
        console.error('Cache Deletion Error:', err);
    }
    
    return user;
};

module.exports = deleteUser;

