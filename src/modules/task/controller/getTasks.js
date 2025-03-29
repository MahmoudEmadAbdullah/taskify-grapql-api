const { NotFoundError } = require('../../../utils/errors');
const ApiFeatures = require('../../../utils/apiFeatures');
const { client } = require('../../../config/redisConfig');
const Task = require('../../../../DB/models/taskModel');


const getTasks = async (args, context) => {
    const cacheKey = `tasks:${context.userId}:${JSON.stringify(args)}`;
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

    let query = context.role === 'admin' 
        ? Task.find()
        : Task.find({ createdBy: context.userId });

    query = query.populate('createdBy', 'name')
        .populate('labels');
    const apiFeatures = new ApiFeatures(query, args)
        .filter()
        .search({
            title: 'string',
            description: 'string',
            taskStatu: 'string',
            deadline: 'date',
            createdAt: 'date'
        });

    const countDocuments = await apiFeatures.mongooseQuery.clone().countDocuments();
    apiFeatures.paginate(countDocuments).sort().limitFields();

    const tasks = await apiFeatures.mongooseQuery;
    if(!tasks || tasks.length === 0) {
        throw new NotFoundError('No tasks found');
    }

    const result =  {
        source: 'Database',
        success: true,
        pagination: apiFeatures.paginationResult,
        data: tasks
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

module.exports = getTasks;