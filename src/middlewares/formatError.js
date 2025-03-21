const jwt = require('jsonwebtoken');
const { 
    ExpiredTokenError, 
    InvalidTokenError, 
} = require('../utils/errors');


const formatError = (error) => {
    if (error.extensions && error.extensions.code && error.extensions.code !== 'INTERNAL_SERVER_ERROR') {
        return {
          message: error.message,
          locations: error.locations,
          path: error.path,
          extensions: {
            code: error.extensions.code
          }
        };
      }
  
    if (error.originalError && error.originalError.constructor === jwt.TokenExpiredError) {
      return new ExpiredTokenError();
    }
  
    if (error.originalError && error.originalError.constructor === jwt.JsonWebTokenError) {
      return new InvalidTokenError();
    }
  
  
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