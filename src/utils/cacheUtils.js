const { client } = require('../config/redisConfig');
const { InternalServerError } = require('../utils/errors');

const deleteCacheKeys = async (prefix) => {
    let cursor = '0';
    let iterationCount = 0;
    const maxIterations = 50;
    try {
        do {
            const result = await client.scan(cursor, { MATCH: `${prefix}:*`, COUNT: 100 });
            cursor = result.cursor;
            if(result.keys && result.keys.length > 0) {
                await client.unlink(result.keys);
            }
            iterationCount++;
            if(iterationCount >= maxIterations) break;
        } while (cursor !== '0');
    } catch(err) {
        throw new InternalServerError(`Error deleting cache keys (${prefix}):`, err);
    }
};

module.exports = { deleteCacheKeys };