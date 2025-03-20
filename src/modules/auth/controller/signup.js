const sendEmail = require('../../../utils/sendEmail');
const hashEmailCode = require('../../../utils/hashEmailCode');
const { ValidationError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');


const signup = async (input) => {
    const { name, email, password } = input;
    
    // Check if user already exist
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new ValidationError('Email already exists');
    }

    // Generate verification code
    const verficationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verficationCode_hash = hashEmailCode(verficationCode);

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        emailVerificationCode: verficationCode_hash,
        verificationCodeExpires: Date.now() + 5 * 60 * 1000,
        emailVerified: false
    });

    // Send verfication email
    try {
        const message = sendEmail.verificationTemplate(user.name, verficationCode);
        await sendEmail({
            email: user.email,
            subject: 'Verify your email address',
            message
        });
    } catch(error) {
        await User.findByIdAndDelete(user._id);
        throw new ValidationError('Failed to send verfication email');
    }

    return 'Verification code sent to your email. Please verify within 5 minutes.';
};


module.exports = signup;
