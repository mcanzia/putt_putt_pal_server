"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
console.log('Connecting to Redis at:', process.env.REDIS_HOST);
const redis = new ioredis_1.default(6379, process.env.REDIS_HOST || '127.0.0.1');
exports.redis = redis;
