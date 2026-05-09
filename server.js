const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon/Railway
  }
});

// GET all RSVPs
app.get('/api/rsvps', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rsvps');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST (Upsert) RSVP
app.post('/api/rsvps', async (req, res) => {
  const { guest_name, category, attending, car, wish } = req.body;
  try {
    const query = `
      INSERT INTO rsvps (guest_name, category, attending, car, wish)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (guest_name)
      DO UPDATE SET
        category = EXCLUDED.category,
        attending = EXCLUDED.attending,
        car = EXCLUDED.car,
        wish = EXCLUDED.wish,
        created_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [guest_name, category, attending, car, wish];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE all RSVPs (Admin feature)
app.delete('/api/rsvps', async (req, res) => {
  try {
    await pool.query("DELETE FROM rsvps WHERE guest_name != ''");
    res.json({ message: 'Database cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve the main entry point
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
