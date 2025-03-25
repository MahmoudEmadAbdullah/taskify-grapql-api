const { NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');
const { client } = require('../../../config/redisConfig');

/**
 * @desc      Get user by ID
 * @access    Private/admin
 */
const getUser = async(userId) => {
    const cacheKey = `user:${userId}`;
    try {
        const cachedData = await client.get(cacheKey);
        if(cachedData) {
            const parseData = JSON.parse(cachedData);
            return {
                source: 'Cache',
                data: parseData,
            }
        }
    } catch(err) {
        console.error('Error fetching user from Redis:', err);
    }

    const user = await User.findById(userId);
    if(!user) {
        throw new NotFoundError('User not found');
    }

    const userData = user.toJSON();
    try {
        await client.set(cacheKey, JSON.stringify(userData), { EX: 15 * 60 });
    } catch(err) {
        console.error('Error caching user in Redis:', err);
    }

    return {
        source: 'Database',
        data: userData
    };
};

module.exports = getUser;