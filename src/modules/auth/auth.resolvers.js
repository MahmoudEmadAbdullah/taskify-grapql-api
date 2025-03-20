const authController = require('./controller/authController');
const { AuthenticationError } = require('../../utils/errors');

const authResolvers = {
    Mutation: {
        signup: async (_, { input }) => authController.signup(input),
        verifyEmail: async (_, { input }) => authController.verifyEmail(input),
        login: async (_, { input }, context) => authController.login(input, context),
        refreshToken: async (_, __, context) => authController.refreshToken(context),

        logout: async (_, __, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized, Please Login')
            }
            return authController.logout(context);
        },

        forgotPassword: async (_, { input }) => authController.forgotPassword(input),
        verifyResetCode: async (_, { input }) => authController.verifyResetCode(input),
        resetPassword: async (_, { input }, context) => authController.resetPassword(input, context),
    }
};


module.exports = authResolvers;


