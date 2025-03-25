const redis = require('redis');

const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    socket: { reconnectStrategy: () => 1000 }
});

// Function to connect to redis
const connectRedis = async () => {
    if(!client.isOpen) {
        await client.connect();
        console.log('Redis connected');
    }
    return client;
};

// Check connection status
const getRedisClient = async () => {
    if(!client.isOpen) {
        await connectRedis();
    }
    return client;
};

module.exports = { client, connectRedis, getRedisClient };