const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');


const authMiddleware = async ({ req }) => {
    // check if token exist, if exists catch it
   let accessToken;
   if( req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer'))
    {
        accessToken = req.headers.authorization.split(' ')[1];
    }
    if(!accessToken) {
        throw new AuthenticationError('Unauthorized');
    }

    // verify accessToken (no changes happens, expired token)
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    
    return { userId: decoded.userId };
};


module.exports = authMiddleware;