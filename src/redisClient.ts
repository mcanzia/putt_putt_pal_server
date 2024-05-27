import { createClient } from 'redis';
import Logger from './util/logs/logger';
import cache from 'express-redis-cache';
import { promisify } from 'util';

console.log('Connecting to Redis at:', process.env.REDIS_HOST);
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379
    },
  });
  
redisClient.on('error', (err) => Logger.error('Redis Client Error', err));

redisClient.connect().then(() => {
  Logger.info('Redis client connected');
}).catch((err) => {
  Logger.error('Failed to connect to Redis', err);
});

const redisCache = cache({
  client: redisClient,
  prefix: 'putt-putt-pal'
});

redisCache.on('connected', () => {
  Logger.info('Redis cache connected');
});

redisCache.on('disconnected', () => {
  Logger.warn('Redis cache disconnected');
});

redisCache.on('error', (error: any) => {
  Logger.error('Redis Cache Error:', error);
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const deleteAsync = promisify(redisClient.del).bind(redisClient);

export {redisClient, getAsync, setAsync, deleteAsync};
