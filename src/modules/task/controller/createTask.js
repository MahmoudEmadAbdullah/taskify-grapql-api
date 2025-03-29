const Task = require('../../../../DB/models/taskModel');
const { singleImageUpload } = require('../../../utils/uploadImage');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');

const createTask = async (input, context) => {
    const { title, description, deadline, image, labels } = input;
    const taskData = {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        createdBy: context.userId,
        labels: labels || []
    };
    if(image) {
        const uploadImage = await singleImageUpload(image);
        taskData.image = uploadImage.secure_url;
        taskData.imagePublicId = uploadImage.public_id;
    }
    const newTask = await Task.create(taskData);
    await newTask.populate('labels');

    // Delete tasks from cache
    try {
        await deleteCacheKeys(`tasks:*`);
    } catch(err) {
        console.error('Error deleting cache keys:', err);
    }
    const taskDataJSON = newTask.toJSON();
    return taskDataJSON;
};  

module.exports = createTask;