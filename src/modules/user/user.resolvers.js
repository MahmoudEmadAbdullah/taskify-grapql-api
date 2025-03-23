const { DateTimeResolver } = require('graphql-scalars');
const userController = require('./controller/userController');
const validate = require('../../middlewares/validate');
const verifyRole = require('../../middlewares/verifyRole');
const {
    createUserSchema,
    getUserSchema
} = require('./user.validation');


const userResolvers = {
    DateTime: DateTimeResolver,

    Mutation: {
        createUser: verifyRole('admin')(validate(createUserSchema)(async (_, { input }) => {
            return userController.createUser(input);
        })),
    },


    Query: {
        getUser: verifyRole('admin')(validate(getUserSchema)(async (_, args) => {
            const { userId } = args;
            return userController.getUser(userId);
        })),

        getUsers: verifyRole('admin')(async (_, args) => {
            return userController.getUsers(args);
        }),
    }
};

module.exports = userResolvers;

