const bcrypt = require('bcrypt');

const { generateAccessToken, generateRefreshToken } = require('../../../utils/generateAuthTokens');
const { AuthenticationError, InternalServerError } = require('../../../utils/errors');
const { client } = require('../../../config/redisConfig');
const User = require('../../../../DB/models/userModel');


const login = async (input, context) => {
    console.log('Context in login:', context);
    const { email, password } = input;
    
    // Verify the user
    const user = await User.findOne({ email }).select('password email name role');
    if(!user || !(await bcrypt.compare(password, user.password))) {
        throw new AuthenticationError('Invalid email or password');
    }

    // update last login time
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in cache
    try {
        const refreshKey = `refreshToken:${user._id}`;
        await client.del(refreshKey);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
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
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        accessToken,
        user,
    }
};

module.exports = login;