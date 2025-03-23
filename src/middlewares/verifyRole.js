const { AuthenticationError, ForbiddenError } = require('../utils/errors');

const verifyRole = (role) => (resolver) => async (parent, args, context, info) => {
    if(!context.userId) {
        throw new AuthenticationError('Not authenticated');
    }

    if(context.role !== role) {
        throw new ForbiddenError('Not authorized')
    }

    return resolver(parent, args, context, info);
};

module.exports = verifyRole;