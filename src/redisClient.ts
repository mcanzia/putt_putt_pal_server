import Redis from 'ioredis';

console.log('Connecting to Redis at:', process.env.REDIS_HOST);
const redis = new Redis(6379, process.env.REDIS_HOST || '127.0.0.1');

export {redis};
