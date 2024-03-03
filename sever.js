// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

app.use(express.json());
app.use(cors());

app.get('/api/customers', async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = 20;

  try {
    const offset = (page - 1) * pageSize;
    console.log(`Fetching data from offset ${offset} for page ${page}`);

    const result = await pool.query(
      'SELECT * FROM customer_data ORDER BY created_at DESC OFFSET $1 LIMIT $2',
      [offset, pageSize]
    );

    console.log(`Fetched ${result.rows.length} records from the database`);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
