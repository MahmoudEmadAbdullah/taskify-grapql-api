const { NotFoundError } = require('../../../utils/errors');
const { client } = require('../../../config/redisConfig');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');
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
    const cacheKey = `user:${userId}`;
    try {
        await client.del(cacheKey);
        await deleteCacheKeys('users:*');
    } catch(err) {
        console.error('Cache Deletion Error:', err);
    }
    return user;
};

module.exports = updateUser;