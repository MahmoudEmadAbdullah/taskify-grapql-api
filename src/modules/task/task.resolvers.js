const { DateTimeResolver } = require('graphql-scalars');
const { GraphQLUpload } = require('graphql-upload-minimal');
const taskController = require('./controller/taskController');
const validate = require('../../middlewares/validate');
const { AuthenticationError } = require('../../utils/errors');
const {
    createTaskSchema,
    updateTaskSchema,
    deleteTaskSchema,
    getTaskSchema
} = require('./task.validation');


const taskResolvers = {
    DateTime: DateTimeResolver,
    Upload: GraphQLUpload,

    Mutation: {
        createTask: validate(createTaskSchema)(async (_, { input }, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return taskController.createTask(input, context);
        }),
        updateTask: validate(updateTaskSchema)(async (_, { input }, context) => {
            return taskController.updateTask(input, context);
        }),
        deleteTask: validate(deleteTaskSchema)(async (_, { input }, context) => {
            return taskController.deleteTask(input, context);
        })
    },

    Query: {
        getTasks: async (_, args, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return taskController.getTasks(args, context);
        },
        getTask: validate(getTaskSchema)(async (_, { input }, context) => {
            return taskController.getTask(input, context);
        })
    }
};

module.exports = taskResolvers;