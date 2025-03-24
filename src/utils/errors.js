const { GraphQLError } = require('graphql');

class AuthenticationError extends GraphQLError {
    constructor(message = 'Authentication failed') {
        super(message, {
            extensions: {
                code: 'UNAUTHENTICATED'
            }
        });
    }
}

class ValidationError extends GraphQLError {
    constructor(message = 'Invalid input') {
        super(message, {
            extensions: {
                code: 'VALIDATION_ERROR'
            }
        });
    }
}

class NotFoundError extends GraphQLError {
    constructor(message = 'Not found') {
        super(message, {
            extensions: {
                code: 'NOT_FOUND'
            }
        });
    }
}

class ExpiredTokenError extends GraphQLError {
    constructor(message = 'Token expired') {
        super(message, {
            extensions: {
                code: 'TOKEN_EXPIRED'
            }
        });
    }
}

class InvalidTokenError extends GraphQLError {
    constructor(message = 'Invalid token') {
        super(message, {
            extensions: {
                code: 'INVALID_TOKEN'
            }
        });
    }
}

class InternalServerError extends GraphQLError {
    constructor(message =  'Internal server error') {
        super(message, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
            }
        });
    }
}

class ForbiddenError extends GraphQLError {
    constructor(message = 'Forbidden') {
        super(message, {
            extensions: {
                code: 'FORBIDDEN'
            }
        });
    }
}

class BadRequestError extends GraphQLError {
    constructor(message = 'Bad request') {
        super(message, {
            extensions: {
                code: 'BAD_REQUEST'
            }
        });
    }
}

module.exports = { 
    AuthenticationError, 
    ValidationError, 
    NotFoundError,
    ExpiredTokenError,
    InvalidTokenError,
    InternalServerError,
    ForbiddenError,
    BadRequestError
};

