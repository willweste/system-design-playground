import { Router } from "express";

const router = Router()

router.get('/get/:key', (req, res) => {
    const key = req.params.key

    // TODO: Look up key-value
    // immediately hash key, and search clockwise on hash ring to find servers
    // that could hold this key

    return res.json({
        key,
        value: null
    })
})

router.post('/set', (req, res) => {
    const {key, value} = req.body

    if (!key || !value) {
        return res.status(400).json({
            error: 'Both key and value are required'
        });
    }

    // TODO: Store the key-value pair
    // Hash the key and store on appropriate server based on consistent hashing

    return res.status(201).json({
        success: true,
        key,
        message: 'Value stored successfully'
        // Value isn't returned for security reasons
    })
})

router.get('/health', (req, res) => {
    return res.status(200).json({status: 'healthy'})
})

export default router
