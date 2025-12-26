import clientPromise from '../lib/mongodb.js';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("tutoring_system"); // This will create the DB if it doesn't exist

    // Just check if we are connected by pinging the DB
    const status = await db.command({ ping: 1 });

    res.status(200).json({ message: "Connected to MongoDB!", status });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not connect to DB" });
  }
}