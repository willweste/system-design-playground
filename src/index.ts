import { RateLimiter } from "../designs/rate-limiter/src";

const capacity = 3;
const refillRate = 1; // 1 token per second
const rateLimiter = new RateLimiter(capacity, refillRate);

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));


(async () => {
  const url = "http://localhost:3000/echo";
  const userId = "user-123";

  for (let i = 0; i < 20; i++) {
    const body = {i, msg: "Hello"}

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const text = await res.text();
    console.log(`[${i}] t=${Date.now()} status=${res.status} body=${text}`);

    // wait 400ms between requests
    await sleep(400);
  }
})();