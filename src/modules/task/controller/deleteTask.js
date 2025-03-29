const Task = require('../../../../DB/models/taskModel');
const cloudinary = require('../../../config/cloudinaryConfig');
const { client } = require('../../../config/redisConfig');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');
const { AuthenticationError, NotFoundError } = require('../../../utils/errors');


const deleteTask = async (input, context) => {
    const { taskId } = input;

    const task = await Task.findById(taskId);
    if(!task) {
        throw new NotFoundError('Task not found');
    }
    if(context.role !== 'admin' && task.createdBy.toString() !== context.userId.toString()) {
        throw new AuthenticationError('Unauthorized to delete this task');
    }

    if(task.imagePublicId) {
        await cloudinary.uploader.destroy(task.imagePublicId, { resource_type: 'image' });
    }
    await task.deleteOne();

    const cacheKey = `task:${taskId}`;
    try {
        await client.del(cacheKey);
        await deleteCacheKeys('tasks:*');
    } catch(err) {
        console.error('Cache Deletion Error:', err);
    }

    return 'Task has been deleted';
};

module.exports = deleteTask;