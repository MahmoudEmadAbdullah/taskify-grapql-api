const signup = require('./signup');
const verifyEmail = require('./verifyEmail');
const login = require('./login');
const refreshToken = require('./refreshToken');
const logout = require('./logout');
const forgotPassword = require('./forgotPassword');
const verifyResetCode = require('./verifyResetCode');
const resetPassword = require('./resetPassword');

module.exports = {
    signup,
    verifyEmail,
    login,
    refreshToken,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword
};