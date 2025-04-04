const jwt = require('jsonwebtoken');
const { AuthenticationError, NotFoundError } = require('../utils/errors');
const  User = require('../../DB/models/userModel');
const { client } = require('../config/redisConfig');

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

    // Check that the token is not in the blacklist
    const isBlacklisted = await client.get(`blacklist:${accessToken}`);
    if(isBlacklisted) {
        throw new AuthenticationError('Unauthorized');
    }

    const user = await User.findById(decoded.userId);
    if(!user) {
        throw new NotFoundError('User not found');
    }
    
    return { userId: user._id, role: user.role };
};

module.exports = authMiddleware;