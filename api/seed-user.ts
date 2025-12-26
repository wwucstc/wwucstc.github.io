import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb.ts';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security: Only allow running this on localhost to prevent public abuse
  if (!req.headers.host?.includes('localhost')) {
     return res.status(403).json({ error: 'This script can only be run locally' });
  }

  const client = await clientPromise;
  const db = client.db("tutoring_system");

  // 1. Define the user you want to create
  const username = "tutor_admin";
  const plainPassword = "F@nt@st!cF0ur"; // Change this if you want!

  // 2. Hash the password (encrypt it)
  // 10 is the "salt rounds" - higher is slower but more secure
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 3. Save to database
  try {
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists!' });
    }

    await db.collection('users').insertOne({
      username,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });

    return res.status(201).json({ message: `User '${username}' created successfully!` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}