const { NotFoundError } = require('../../../utils/errors');
const ApiFeatures = require('../../../utils/apiFeatures');
const { client } = require('../../../config/redisConfig');
const Label = require('../../../../DB/models/labelModel');


const getLabels = async (args, context) => {
    const cacheKey = `labels:${context.userId}:${JSON.stringify(args)}`;
    try {
        const cachedData = await client.get(cacheKey);
        if(cachedData) {
            const parseData = JSON.parse(cachedData);
            return {
                source: 'Cache',
                success: parseData.success ?? true,
                pagination: parseData.pagination ?? {},
                data: parseData.data
            }
        }
    } catch(err) {
        console.error('Error fetching data from Redis:', err);
    }
    
    let query = context.role === 'admin'
        ? Label.find()
        : Label.find({ createdBy: context.userId });

    query = query.populate('createdBy', 'name');
    const apiFeatures = await new ApiFeatures(query, args)
        .filter()
        .search({
            name: 'string',
            color: 'string',
            createdAt: 'date'
        });

    const countDocuments = await apiFeatures.mongooseQuery.clone().countDocuments();
    apiFeatures.paginate(countDocuments).sort().limitFields();

    const labels = await apiFeatures.mongooseQuery;
    if(!labels || labels.length === 0) {
        throw new NotFoundError('No label found');
    }

    const result = {
        source: 'Database',
        success: true,
        pagination: apiFeatures.paginationResult,
        data: labels
    };

    try {
        await client.set(cacheKey, JSON.stringify(result), {
            EX: 15 * 60
        })
    } catch(err) {
        console.error('Error setting data in Redis:', err);
    }

    return result;
};

module.exports = getLabels;