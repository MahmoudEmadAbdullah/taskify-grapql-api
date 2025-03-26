const { DateTimeResolver } = require('graphql-scalars');
const userController = require('./controller/userController');
const validate = require('../../middlewares/validate');
const verifyRole = require('../../middlewares/verifyRole');
const { AuthenticationError } = require('../../utils/errors');
const {
    createUserSchema,
    getUserSchema,
    updateUserSchema,
    changeUserPasswordSchema,
    deleteUserSchema,
    updateMeSchema,
    changeMyPasswordSchema
} = require('./user.validation');


const userResolvers = {
    DateTime: DateTimeResolver,

    Mutation: {
        createUser: verifyRole('admin')(validate(createUserSchema)(async (_, { input }) => {
            return userController.createUser(input);
        })),
        updateUser: verifyRole('admin')(validate(updateUserSchema)(async (_, { input }) => {
            const { userId, ...updateData } = input;
            return userController.updateUser({ userId, input: updateData });
        })),
        changeUserPassword: verifyRole('admin')(validate(changeUserPasswordSchema)(async (_, {input}) => {
            const { userId, newPassword } = input;
            return userController.changeUserPassword({ userId, newPassword });
        })),
        deleteUser: verifyRole('admin')(validate(deleteUserSchema)(async (_, { userId }) => {
            return userController.deleteUser(userId);
        })),
        updateMe: validate(updateMeSchema)(async (_, { input }, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return userController.updateMe(context.userId, input);
        }),
        changeMyPassword: validate(changeMyPasswordSchema)(async (_,{ input }, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return userController.changeMyPassword(context.userId, input, context);
        }),
        deleteMe: async (_, __, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return userController.deleteMe(context.userId);
        }
    },  

    Query: {
        getUser: verifyRole('admin')(validate(getUserSchema)(async (_, args) => {
            const { userId } = args;
            return userController.getUser(userId);
        })),
        getUsers: verifyRole('admin')(async (_, args) => {
            return userController.getUsers(args);
        }),
        getMe: async (_, __, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized');
            }
            return userController.getMe(context.userId);
        }
    }
};

module.exports = userResolvers;

