import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize the database
let db;
(async () => {
  db = await open({
    filename: ':memory:',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      name TEXT,
      phoneNumber TEXT,
      orderNumber TEXT,
      returnAddress TEXT,
      brand TEXT,
      problem TEXT,
      claimNumber TEXT UNIQUE
    )
  `);
})();

// API routes
app.post('/api/claims', async (req, res) => {
  try {
    const { email, name, phoneNumber, orderNumber, returnAddress, brand, problem } = req.body;
    const claimNumber = `CLAIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    await db.run(
      `INSERT INTO claims (email, name, phoneNumber, orderNumber, returnAddress, brand, problem, claimNumber)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, name, phoneNumber, orderNumber, returnAddress, brand, problem, claimNumber]
    );
    
    res.json({ claimNumber });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ error: 'Failed to submit claim' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});