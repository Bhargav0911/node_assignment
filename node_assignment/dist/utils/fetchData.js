// fetchData.ts
import { getDB } from '../db.js';
export async function loadData() {
    const db = getDB();
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;
    // Clear existing data
    await Promise.all([
        db.collection('users').deleteMany({}),
        db.collection('posts').deleteMany({}),
        db.collection('comments').deleteMany({})
    ]);
    // Use type assertion for fetched data
    const users = await fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json());
    const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.json());
    const comments = await fetch('https://jsonplaceholder.typicode.com/comments')
        .then(res => res.json());
    // Insert into MongoDB
    await db.collection('users').insertMany(users);
    await db.collection('posts').insertMany(posts);
    await db.collection('comments').insertMany(comments);
    console.log('Data loaded into MongoDB');
}
