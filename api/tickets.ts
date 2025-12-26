import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb.ts';

// Updated Data Model
interface Ticket {
  studentName: string;
  className: string;         // NEW
  problem: string;           // Renamed from 'question'
  stepsTaken: string;        // NEW
  status: 'New' | 'In Progress' | 'Complete' | 'Closed' | 'Missed';
  createdAt: Date;
  claimedBy: string | null;
  notes: string | null;      // NEW (for tutors)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("tutoring_system");

  // 1. Handle POST (Create a new ticket)
  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      // Validate all required fields
      if (!data.studentName || !data.className || !data.problem || !data.stepsTaken) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      const newTicket: Ticket = {
        studentName: data.studentName,
        className: data.className,
        problem: data.problem,
        stepsTaken: data.stepsTaken,
        status: 'New',           // Default status
        createdAt: new Date(),
        claimedBy: null,
        notes: null              // Starts empty
      };

      const result = await db.collection('tickets').insertOne(newTicket);
      
      return res.status(201).json({ message: 'Ticket created', ticketId: result.insertedId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save ticket' });
    }
  }

  // 2. Handle GET (View all tickets)
  if (req.method === 'GET') {
    try {
      const tickets = await db.collection('tickets')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(tickets);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}