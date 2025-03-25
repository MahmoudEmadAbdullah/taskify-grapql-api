const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { generateAccessToken } = require('../../../utils/generateAuthTokens');
const { AuthenticationError, ValidationError, InternalServerError } = require('../../../utils/errors');
const { client } = require('../../../config/redisConfig');


const refreshToken = async (context) => {
    const refreshToken = context.req?.cookies.refreshToken;
    if(!refreshToken) {
        throw new AuthenticationError('Refresh token is missing');
    }
    const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    try {
        const refreshKey = `refreshToken:${decoded.userId}`;
        const storedHashedToken = await client.get(refreshKey);
        if(!storedHashedToken) {
            throw new ValidationError('Invalid or expired refresh token');
        }
        const isMatch = await bcrypt.compare(refreshToken, storedHashedToken);
        if(!isMatch) {
            throw new AuthenticationError('Refresh token is missing');
        }
        const accessToken = generateAccessToken(decoded.userId);
        return { accessToken }
    } catch (error) {
        throw new InternalServerError('Server error while validating refresh token');
    }
};

module.exports = refreshToken;
