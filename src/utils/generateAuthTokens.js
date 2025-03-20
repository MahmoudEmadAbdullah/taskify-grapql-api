const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
);

const generateRefreshToken = (userId) => jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
);

module.exports = { generateAccessToken, generateRefreshToken };