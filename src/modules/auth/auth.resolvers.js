const authController = require('./controller/authController');
const { AuthenticationError } = require('../../utils/errors');
const validate = require('../../middlewares/validate');
const { 
    signupSchema,
    verifyEmailSchema,
    loginSchema,
    forgotPasswordSchema,
    resetCodeSchema,
    resetPasswordSchema
} = require('./auth.validation');

const authResolvers = {
    Mutation: {

        signup: validate(signupSchema)(async (_, { input }) => {
            return authController.signup(input);
        }),
        verifyEmail: validate(verifyEmailSchema)(async (_, { input }) => {
            return authController.verifyEmail(input);
        }),
        login: validate(loginSchema)(async (_, { input }, context) => {
            return authController.login(input, context);
        }),

        refreshToken: async (_, __, context) => authController.refreshToken(context),

        logout: async (_, __, context) => {
            if(!context.userId) {
                throw new AuthenticationError('Unauthorized. Please log in to continue.')
            }
            return authController.logout(context);
        },
        forgotPassword: validate(forgotPasswordSchema)(async (_, { input }) => {
            return authController.forgotPassword(input);
        }),
        verifyResetCode: validate(resetCodeSchema)(async (_, { input }) => {
            return authController.verifyResetCode(input);
        }),
        resetPassword: validate(resetPasswordSchema)(async (_, { input }, context) => {
            return authController.resetPassword(input, context);
        })
    }
};

module.exports = authResolvers;


