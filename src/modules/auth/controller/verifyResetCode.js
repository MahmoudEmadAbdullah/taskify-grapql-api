const hashEmailCode = require('../../../utils/hashEmailCode');
const { AuthenticationError } = require('../../../utils/errors');
const User = require('../../../../DB/models/userModel');


const verifyResetCode = async (input) => {
    const { resetCode } = input;
    const resetCode_hash = hashEmailCode(resetCode);

    const user = await User.findOne(
        {
            passwordResetCode: resetCode_hash,
            passwordResetExpires: { $gt: Date.now() }
        }
    ).select('passwordResetCode passwordResetExpires passwordResetVerified');

    if(!user) {
        throw new AuthenticationError('Reset code invalid or expired');
    }

    user.passwordResetVerified = true;
    await user.save();

    return 'Success';
};

module.exports = verifyResetCode;