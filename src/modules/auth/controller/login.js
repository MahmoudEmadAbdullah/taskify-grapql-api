const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../../../utils/generateAuthTokens');
const { AuthenticationError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');

const login = async (input, context) => {
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