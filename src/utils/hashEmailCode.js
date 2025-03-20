const crypto = require('crypto');

const hashEmailCode = (code) => crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');

module.exports = hashEmailCode;