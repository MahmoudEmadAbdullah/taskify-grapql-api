const { AuthenticationError, NotFoundError } = require('../../../utils/errors');
const Task = require('../../../../DB/models/taskModel');
const { client } = require('../../../config/redisConfig');

const getTask = async (input, context) => {
    const { taskId } = input;
    const cacheKey = `task:${taskId}`;
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
        console.error('Error fetching task from Redis:', err);
    }

    const task = await Task.findById(taskId)
        .populate('createdBy', 'name')
        .populate('labels');
    if(!task) {
        throw new NotFoundError('Task not found');
    }
    if(context.role !== 'admin' && task.createdBy.toString() !== context.userId.toString()) {
        throw new AuthenticationError('Unauthorized to view this task');
    }

    const taskData = task.toJSON();
    try {
        await client.set(cacheKey, JSON.stringify(taskData), {
            EX: 15 * 60,
        });
    } catch(err) {
        console.error('Error caching task in Redis:', err);
    }

    return {
        source: 'Database',
        data: taskData
    };
};

module.exports = getTask;
