import { redis } from "../../redisClient";
import { getFallback, setFallback, deleteFallback } from "./fallbackCache";

async function getCachedValue(key : string) {
    try {
      const value = await redis.get(key);
      if (value !== null) {
        return value;
      } else {
        return getFallback(key);
      }
    } catch (error) {
      console.error('Failed to get value from Redis, using fallback:', error);
      return getFallback(key);
    }
  }
  
  async function setCachedValue(key : string, value : any, options : any) {
    const { EX } = options; 
    try {
      await redis.set(key, value, 'EX', EX);
    } catch (error) {
      console.error('Failed to set value in Redis, using fallback:', error);
      setFallback(key, value);
    }
  }

  async function deleteCachedValue(key : string) {
    try {
        await redis.del(key);
      } catch (error) {
        console.error('Failed to delete value in Redis, using fallback:', error);
        deleteFallback(key);
      }
  }

export {getCachedValue, setCachedValue, deleteCachedValue};