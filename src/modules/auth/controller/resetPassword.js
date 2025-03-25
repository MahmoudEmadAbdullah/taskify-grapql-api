const { generateAccessToken, generateRefreshToken } = require('../../../utils/generateAuthTokens');
const { ValidationError, NotFoundError } = require('../../../utils/errors');
const { client } = require('../../../config/redisConfig');
const User = require('../../../../DB/models/userModel');


const resetPassword = async (input, context) => {
    const { email, newPassword } = input;

    const user = await User.findOne({ email });
    if(!user) {
        throw new NotFoundError(`No found user for this email: ${email}`);
    }

    if(user.passwordResetVerified === false) {
        throw new ValidationError('Reset code not verified');
    }

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    user.lastLogin = new Date();
    await user.save();

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

    context.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken };
};

module.exports = resetPassword;