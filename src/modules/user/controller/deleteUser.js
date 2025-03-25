const { NotFoundError } = require('../../../utils/errors');
const { client } = require('../../../config/redisConfig');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');
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

