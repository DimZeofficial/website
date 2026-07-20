import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@vercel/kv';

export const contactRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'ratelimit:contact',
});
