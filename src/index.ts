import { RateLimiter } from "../designs/rate-limiter/src";

const capacity = 3;
const refillRate = 1; // 1 token per second
const rateLimiter = new RateLimiter(capacity, refillRate);

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

(async () => {
  const userId = "user-123";

  for (let i = 0; i < 8; i++) {
    const allowed = rateLimiter.allowRequest(userId);
    console.log(`[${i}] allowed=${allowed}`);

    // wait 400ms between requests
    await sleep(400);
  }
})();