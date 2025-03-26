const Task = require('../../../../DB/models/taskModel');


const createTask = async (input, context) => {
    const { title, description, deadline, image } = input;

    const taskData = {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        createdBy: context.userId,
    };

    if(image) {
        taskData.image = image;
    }

    const newTask = await Task.create(taskData);
    return newTask;
};  

module.exports = createTask;