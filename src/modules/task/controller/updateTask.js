const Task = require('../../../../DB/models/taskModel');
const Label = require('../../../../DB/models/labelModel');
const cloudinary = require('../../../config/cloudinaryConfig');
const { singleImageUpload } = require('../../../utils/uploadImage');
const { client } = require('../../../config/redisConfig');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');
const { AuthenticationError, NotFoundError, ValidationError } = require('../../../utils/errors');


const updateTask = async (input, context) => {
    const { taskId, title, description, deadline, image, taskStatus, labels } = input;

    const task = await Task.findById(taskId);
    if(!task) { 
        throw new NotFoundError('Task not found');
    }
    if(context.role !== 'admin' && task.createdBy.toString() !== context.userId.toString()) {
        throw new AuthenticationError('Unauthorized to update this task');
    }

    if(image) { 
        if(task.imagePublicId) {
            await cloudinary.uploader.destroy(task.imagePublicId, { resource_type: 'image' });
        }
        const file = await image;
        const uploadImage = await singleImageUpload(file);
        task.image = uploadImage.secure_url;
        task.imagePublicId = uploadImage.public_id;
    }

    if(labels) {
        const validLabels = await Label.find({ _id: { $in: labels } });
        if(validLabels.length !== labels.length) {
            throw new ValidationError('Invalid labels provided');
        }
        task.labels = labels;
    }

    const updateFields = {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(deadline !== undefined && { deadline }),
        ...(taskStatus !== undefined && { taskStatus })
    };
    Object.assign(task, updateFields);
    await task.save();
    await task.populate('labels');

    const cacheKey = `task:${taskId}`;
    try {
        await client.del(cacheKey);
        await deleteCacheKeys('tasks:*');
    } catch(err) {
        console.error('Cache Deletion Error:', err);
    }
    
    const taskDataJSON = task.toJSON();
    return taskDataJSON;
};

module.exports = updateTask;