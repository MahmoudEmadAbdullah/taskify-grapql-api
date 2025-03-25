const { client } = require('../../../config/redisConfig');
const { NotFoundError } = require('../../../utils/errors');
const ApiFeatures = require('../../../utils/apiFeatures');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      Get all users
 * @access    Private/admin
 */
const getUsers = async (args) => {
    const cacheKey = `users:${JSON.stringify(args)}`;
    try {
        const cachedData = await client.get(cacheKey);
        if(cachedData) {
            const parseData = JSON.parse(cachedData);
            return { 
                source: 'Cache', 
                success: parseData.success ?? true,
                pagination: parseData.pagination ?? {},
                data: parseData.data ?? []
            }
        }
    } catch(err) {
        console.error('Error fetching data from Redis:', err);
    }

    const apiFeatures = new ApiFeatures(User.find(), args)
        .filter()
        .search({
            name: 'string',
            email: 'string',
            role: 'string',
            createdAt: 'date',
        });

    const countDocuments = await apiFeatures.mongooseQuery.clone().countDocuments();
    apiFeatures.paginate(countDocuments).sort().limitFields();

    const users = await apiFeatures.mongooseQuery;
    if(!users || users.length === 0) {
        throw new NotFoundError('No users found');
    }

    const result = {
        source: 'database',
        success: true,
        pagination: apiFeatures.paginationResult,
        data: users
    };

    try {
        await client.set(cacheKey, JSON.stringify(result), {
            EX: 15 * 60,
        });
    } catch(err) {
        console.error('Error setting data in Redis:', err);
    }

    return result;

};

module.exports = getUsers;