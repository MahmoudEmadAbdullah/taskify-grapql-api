const hashEmailCode = require('../../../utils/hashEmailCode');
const { AuthenticationError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');


const verifyEmail = async (input) => {
    const { verficationCode } = input;
    const verficationCode_hash = hashEmailCode(verficationCode);

    const user = await User.findOne({
        emailVerificationCode: verficationCode_hash,
        verificationCodeExpires: { $gt: Date.now() }
    });

    if(!user) {
        throw  new AuthenticationError('Verfication code is invalid or expired');
    }

    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return 'Email verified successfully. Please log in to continue.';
};


module.exports = verifyEmail;