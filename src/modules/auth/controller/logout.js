const jwt = require('jsonwebtoken');

const { client } = require("../../../config/redisConfig");
const { InternalServerError } = require('../../../utils/errors');
const addToBlacklist = require('../../../utils/addToBlacklist');


const logout = async (context) => {
    const { req, res, userId } = context;
    try {
        const refreshKey = `refreshToken:${userId}`;
        await client.del(refreshKey);

        // Add accessToken to blacklist
        const accessToken = req.headers.authorization.split(' ')[1];
        if(accessToken) {
            const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
            if(expiresIn > 0) {
                await addToBlacklist(accessToken, expiresIn);
            }
        }
    } catch(error) {
        throw new InternalServerError('Failed to clear refresh token from cache');
    }
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 0
    });
    return true;
};

module.exports = logout;