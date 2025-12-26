import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-key-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const client = await clientPromise;
    const db = client.db("tutoring_system");

    // 1. Find the user
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Create the JWT Token
    // This token contains the user's ID and expires in 1 hour
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    // 4. Send the token back
    return res.status(200).json({ token, message: 'Login successful' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}