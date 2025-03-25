const bcrypt = require('bcrypt');
const { NotFoundError, BadRequestError, InternalServerError } = require('../../../utils/errors');
const { generateAccessToken, generateRefreshToken } = require('../../../utils/generateAuthTokens');
const { client } = require('../../../config/redisConfig');
const User = require('../../../../DB/models/userModel');

/**
 * @desc      change logged user password 
 * @access    Private/admin - user
 */
const changeMyPassword = async (userId, input, context) => {
    console.log('Context:', context); 
    const { currentPassword, newPassword } = input;

    const user = await User.findById(userId);
    if(!user) {
        throw new NotFoundError('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordCorrect) {
        throw new BadRequestError('Current password is incorrect');
    }
    
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    // generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in cache
    try {
        const refreshKey = `refreshToken:${user._id}`;
        await client.del(refreshKey);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        console.log('Hashed Refresh Token:', hashedRefreshToken); // للتتبع
        await client.set(refreshKey, hashedRefreshToken, {
            EX: 7 * 24 * 60 * 60,
        });
    } catch(error) {
        throw new InternalServerError('Failed to store refresh token');
    }

    // sotre refreshToken in cookie
    context.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
        success: true,
        accessToken
    }
};

module.exports = changeMyPassword;

