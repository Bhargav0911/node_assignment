import express from 'express';
import { getDB } from '../db.js';
const router = express.Router();
// GET /users? page, limit, sort
router.get('/', async (req, res) => {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortField = req.query.sort || 'name';
    const skip = (page - 1) * limit;
    try {
        const users = await db.collection('users')
            .find({})
            .sort({ [sortField]: 1 })
            .skip(skip)
            .limit(limit)
            .toArray();
        res.json({ page, limit, users });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// GET /users/:userId with posts and comments nested
router.get('/:userId', async (req, res) => {
    const db = getDB();
    const userId = parseInt(req.params.userId);
    try {
        const user = await db.collection('users').findOne({ id: userId });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Find posts by user
        const posts = await db.collection('posts').find({ userId }).toArray();
        // For each post, fetch comments
        const postsWithComments = await Promise.all(posts.map(async (post) => {
            const comments = await db.collection('comments').find({ postId: post.id }).toArray();
            return { ...post, comments };
        }));
        user.posts = postsWithComments;
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
