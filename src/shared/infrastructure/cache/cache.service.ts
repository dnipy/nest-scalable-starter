import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}
  /**
   * Set a key with TTL (default 60 seconds)
   */
  async set(key: string, value: string, ttl = 60): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }
  /**
   * Set a key only if it does NOT exist, with TTL (default 60s)
   */
  async setNX(key: string, value: string, ttl = 60): Promise<boolean> {
    const res = await this.redis.set(key, value, 'EX', ttl, 'NX');
    return res === 'OK';
  }
  /**
   * Get a key value
   */
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  /**
   * Delete a key
   */
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
   * Increment a key (useful for counting attempts)
   */
  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  /**
   * Increment a key (useful for counting attempts)
   */
  async incrby(key: string, value: number | string): Promise<number> {
    return this.redis.incrby(key, value);
  }

  /**
   * Decrease a key (useful for counting attempts)
   */
  async decrby(key: string, value: number): Promise<number> {
    return this.redis.decrby(key, value);
  }

  /**
   * Set or update key expiration in seconds
   */
  async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl);
  }

  /**
   * Get remaining TTL in seconds
   */
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  /**
   * Get keys by pattern (⚠️ use carefully in production)
   */
  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  async hget(hash: string, field: string): Promise<string | null> {
    return this.redis.hget(hash, field);
  }

  async hset(
    hash: string,
    field: string,
    value: number | string
  ): Promise<void> {
    await this.redis.hset(hash, field, value);
  }

  async hincrby(hash: string, field: string, value = 1): Promise<number> {
    return this.redis.hincrby(hash, field, value);
  }

  async hgetall(hash: string): Promise<Record<string, string>> {
    return this.redis.hgetall(hash);
  }

  async remember<T>(
    key: string,
    ttl: number,
    factory: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const value = await factory();

    await this.set(key, JSON.stringify(value), ttl);

    return value;
  }

  /**
   * Rate-limit helper for OTP requests.
   * Example: limit = 5 requests per 10 minutes
   */
  async checkRateLimit(
    key: string,
    limit: number,
    windowSec: number
  ): Promise<boolean> {
    const count = await this.incr(key);
    if (count === 1) {
      await this.expire(key, windowSec);
    }
    return count <= limit;
  }

  async eval(script: string, numKeys: number, ...args: any[]): Promise<any> {
    return this.redis.eval(script, numKeys, ...args);
  }
}
