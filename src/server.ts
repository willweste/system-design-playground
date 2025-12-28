import express, { Request, Response, NextFunction } from "express";
import { RateLimiter } from "../designs/rate-limiter/src";

// create API rate limiter
const limiter = new RateLimiter(4, 1);
// Establish test client key
const clientKey = 'user-123'

const app = express();
app.use(express.json());

async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const allowed = limiter.allowRequest(clientKey);
        if(!allowed) {
            return res.status(429).json({error: "Too many requests"});
        }
        return next();
    } catch (err) {
        next(err)
    }
}

// used to GET /health
app.get("/health", (_req, res) => {
    res.json({ ok: true });
})

// Echo the POST sent
app.post("/echo", rateLimitMiddleware, (req, res) => {
    res.json({ youSent: req.body });
})

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});