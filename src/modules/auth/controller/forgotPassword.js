const sendEmail = require('../../../utils/sendEmail');
const hashEmailCode = require('../../../utils/hashEmailCode');
const { InternalServerError, NotFoundError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');


const forgotPassword = async (input) => {
    const { email } = input;

    const user = await User.findOne({ email }).select('email name');
    if(!user) {
        throw new NotFoundError(`No user found for this email: ${email}`);
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCode_hash = hashEmailCode(resetCode);

    user.passwordResetCode = resetCode_hash;
    user.passwordResetExpires = Date.now() + 5 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save({ validateBeforeSave: false });

    const message = sendEmail.resetPasswordTemplate(user.name, resetCode);
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 5 minutes)',
            message,
        });
    } catch(error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        throw new InternalServerError('Failed to send reset email. Please try again later.')
    }

    return 'Reset code send to your email!';
};

module.exports = forgotPassword;