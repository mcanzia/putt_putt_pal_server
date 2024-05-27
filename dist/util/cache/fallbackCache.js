"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFallback = exports.setFallback = exports.getFallback = void 0;
const memoryStore = new Map();
const getFallback = (key) => {
    return memoryStore.get(key);
};
exports.getFallback = getFallback;
const setFallback = (key, value) => {
    memoryStore.set(key, value);
};
exports.setFallback = setFallback;
const deleteFallback = (key) => {
    memoryStore.set(key, null);
};
exports.deleteFallback = deleteFallback;
