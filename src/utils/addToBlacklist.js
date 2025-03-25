const { client } = require('../config/redisConfig');

const addToBlacklist = async (accessToken, expiresIn) => {
    const key = `blacklist:${accessToken}`;
    await client.set(key, 'true', { EX: expiresIn });
};

module.exports = addToBlacklist;

