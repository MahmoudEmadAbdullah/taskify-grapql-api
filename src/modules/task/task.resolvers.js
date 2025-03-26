const { DateTimeResolver } = require('graphql-scalars');
const taskController = require('./controller/taskController');
const validate = require('../../middlewares/validate');
const verifyRole = require('../../middlewares/verifyRole');
const { AuthenticationError } = require('../../utils/errors');
const {
    createTaskSchema
} = require('./task.validation');


const taskResolvers = {
    DateTime: DateTimeResolver,

    Mutation: {
        createTask: verifyRole('user')(validate(createTaskSchema)(async (_, { input }, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return taskController.createTask(input, context);
        }))
    }
};

module.exports = taskResolvers;