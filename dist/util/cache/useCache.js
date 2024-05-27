"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCachedValue = exports.setCachedValue = exports.getCachedValue = void 0;
const redisClient_1 = require("../../redisClient");
const fallbackCache_1 = require("./fallbackCache");
async function getCachedValue(key) {
    try {
        const value = await redisClient_1.redis.get(key);
        if (value !== null) {
            return value;
        }
        else {
            return (0, fallbackCache_1.getFallback)(key);
        }
    }
    catch (error) {
        console.error('Failed to get value from Redis, using fallback:', error);
        return (0, fallbackCache_1.getFallback)(key);
    }
}
exports.getCachedValue = getCachedValue;
async function setCachedValue(key, value, options) {
    const { EX } = options;
    try {
        await redisClient_1.redis.set(key, value, 'EX', EX);
    }
    catch (error) {
        console.error('Failed to set value in Redis, using fallback:', error);
        (0, fallbackCache_1.setFallback)(key, value);
    }
}
exports.setCachedValue = setCachedValue;
async function deleteCachedValue(key) {
    try {
        await redisClient_1.redis.del(key);
    }
    catch (error) {
        console.error('Failed to delete value in Redis, using fallback:', error);
        (0, fallbackCache_1.deleteFallback)(key);
    }
}
exports.deleteCachedValue = deleteCachedValue;
