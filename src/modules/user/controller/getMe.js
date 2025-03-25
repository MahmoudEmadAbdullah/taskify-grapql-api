const { NotFoundError } = require('../../../utils/errors');
const { client } = require('../../../config/redisConfig');
const User = require('../../../../DB/models/userModel');


/**
 * @desc      Get logged user data 
 * @access    Private/admin - user
 */
const getMe = async (userId) => {
    const cacheKey = `user:${userId}`;
    try {
        const cachedData = await client.get(cacheKey);
        if(cachedData) {
            const parseData = JSON.parse(cachedData);
            return {
                source: 'Cache',
                data: parseData
            }
        }
    } catch(err) {
        console.error('Error fetching data from Redis:', err);
    }
    const user = await User.findById(userId).select('-password -__v');
    if(!user) {
        throw new NotFoundError('User not found');
    }
    const userData = user.toJSON();
    try {
        await client.set(cacheKey, JSON.stringify(userData), {
            EX: 15 * 60, 
        });
    } catch(err) {
        console.error('Error setting data in Redis:', err);
    }

    return {
        source: 'Database',
        data: userData
    };
};

module.exports = getMe;