import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "https://week-4-visitor-guest-book-1.onrender.com", // Your frontend origin
  optionsSuccessStatus: 200, // For legacy browser support
};

// Use CORS middleware
app.use(cors(corsOptions));

// Database connection
const dbConnectionString = process.env.DATABASE_URL;

export const db = new pg.Pool({
  connectionString: dbConnectionString,
  ssl: { rejectUnauthorized: false }, // Required for many cloud services
});

// Define your routes
app.get("/feedback", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM feedback");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.json({ message: "We built this server on ROCK N ROLL!!!" });
});

// Route to READ data from the database
app.get("/feedback", async (req, res) => {
  db.query("SELECT * FROM feedback").then((result) => res.json(result.rows));
});

// Route to CREATE new feedback in the database
app.post("/feedback", async (req, res) => {
  const { visitor_name, location, favourite_city, feedback } = req.body;
  const insertQuery = `
    INSERT INTO feedback (visitor_name, location, favourite_city, feedback)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [visitor_name, location, favourite_city, feedback];

  db.query(insertQuery, values).then((result) => res.json(result.rows[0]));
});
