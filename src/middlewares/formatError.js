const jwt = require('jsonwebtoken');
const { 
    ExpiredTokenError, 
    InvalidTokenError, 
    InternalServerError 
} = require('../utils/errors');


const formatError = (error) => {
    if(error.originalError?.constructor === jwt.TokenExpiredError) {
        return new ExpiredTokenError();
    }

    if(error.originalError?.constructor === jwt.JsonWebTokenError) {
        return new InvalidTokenError();
    }

    if(!error.originalError) {
        return new InternalServerError();
    }

    // Global Error
    return {
        message: error.message || 'An unknown error occurred',
        locations: error.locations,
        path: error.path,
        extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
        }
    };
};

module.exports = formatError;