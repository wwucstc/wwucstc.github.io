import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb.ts';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-key-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Get the Token from the Headers
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Remove "Bearer " prefix

  try {
    // 2. Verify the Token
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    
    // 3. Connect to DB
    const client = await clientPromise;
    const db = client.db("tutoring_system");

    // 4. Get the Tutor's Username (so we can save "Claimed by Josh" instead of "Claimed by ID_123")
    const tutor = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!tutor) {
        return res.status(401).json({ error: 'User not found' });
    }

    // 5. Update the Ticket
    const { ticketId } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const result = await db.collection('tickets').updateOne(
        { _id: new ObjectId(ticketId) },
        { 
            $set: { 
                status: 'In Progress',
                claimedBy: tutor.username // Save the actual name
            } 
        }
    );

    if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Ticket not found or already claimed' });
    }

    return res.status(200).json({ message: 'Ticket claimed successfully' });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}