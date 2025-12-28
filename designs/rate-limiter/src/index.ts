class TokenBucket {
    private tokens: number; // these can be fractional
    private capacity: number;
    private refillRate: number; // each second is a refilled token
    private lastRefill: number;

    constructor(capacity: number, refillRate: number) {
        this.capacity = capacity;
        this.refillRate = refillRate; // seconds passed to refill a token
        this.tokens = capacity; // Token bucket starts full
        this.lastRefill = Date.now();
    }

    // Refill tokens based on the amount of time passed
    private refill(): void {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000;
        const tokensToAdd = timePassed * this.refillRate;
        this.tokens = Math.min(this.tokens + tokensToAdd, this.capacity);

        // reset last refill
        this.lastRefill = now;
    }

    // Attempt to consume a token
    public consumeToken(tokens: number = 1): boolean {
        this.refill();
        if(this.tokens >= tokens) {
            this.tokens -= tokens;
            return true;
        }
        return false;
    }

    // Check if bucket has tokens without consuming
    public checkTokens(required: number = 1): boolean {
        this.refill()
        return this.tokens >= required;
    }

    // Get current tokens
    public getTokens(): number {
        this.refill()
        return this.tokens;
    }
}

// API Rate Limiter class - Uses a hashmap with the keys being user ids and values being a corresponding bucket
class RateLimiter {
    private buckets: Map<string, TokenBucket>;
    private capacity: number;
    private refillRate: number;

    constructor(capacity: number, refillRate: number){
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.buckets = new Map<string, TokenBucket>();
    }

    private getBucket(userId: string): TokenBucket {
        if (!this.buckets.has(userId)) {
            this.buckets.set(userId, new TokenBucket(this.capacity, this.refillRate))
        }
        return this.buckets.get(userId)!;
    }

    public allowRequest(userId: string): boolean {
        const bucket = this.getBucket(userId);
        return bucket.consumeToken();
    }
}

export {TokenBucket, RateLimiter};
