const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../../../utils/generateAuthTokens');
const { AuthenticationError } = require('../../../utils/errors');


const refreshToken = async (context) => {
    const refreshToken = context.req?.cookies.refreshToken;
    if(!refreshToken) {
        throw new AuthenticationError('Refresh token is missing');
    }

    const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.userId);

    return { accessToken }
};


module.exports = refreshToken;
