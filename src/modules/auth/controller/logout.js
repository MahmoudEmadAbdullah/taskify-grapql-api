
const logout = async (context) => {
    context.res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 0
    });

    return true;
};

module.exports = logout;