"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsync = exports.setAsync = exports.getAsync = exports.redisClient = void 0;
const redis_1 = require("redis");
const logger_1 = __importDefault(require("./util/logs/logger"));
const express_redis_cache_1 = __importDefault(require("express-redis-cache"));
const util_1 = require("util");
console.log('Connecting to Redis at:', process.env.REDIS_HOST);
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379
    },
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => logger_1.default.error('Redis Client Error', err));
redisClient.connect().then(() => {
    logger_1.default.info('Redis client connected');
}).catch((err) => {
    logger_1.default.error('Failed to connect to Redis', err);
});
const redisCache = (0, express_redis_cache_1.default)({
    client: redisClient,
    prefix: 'putt-putt-pal'
});
redisCache.on('connected', () => {
    logger_1.default.info('Redis cache connected');
});
redisCache.on('disconnected', () => {
    logger_1.default.warn('Redis cache disconnected');
});
redisCache.on('error', (error) => {
    logger_1.default.error('Redis Cache Error:', error);
});
const getAsync = (0, util_1.promisify)(redisClient.get).bind(redisClient);
exports.getAsync = getAsync;
const setAsync = (0, util_1.promisify)(redisClient.set).bind(redisClient);
exports.setAsync = setAsync;
const deleteAsync = (0, util_1.promisify)(redisClient.del).bind(redisClient);
exports.deleteAsync = deleteAsync;
