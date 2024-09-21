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

// Route to READ data from the database
app.get("/feedback", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM feedback");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching feedback:", error.message); // Log the error
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a 500 status
  }
});

// Route to CREATE new feedback in the database
app.post("/feedback", async (req, res) => {
  const { visitor_name, location, favourite_city, feedback } = req.body;

  // Validate input data
  if (!visitor_name || !location || !favourite_city || !feedback) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const insertQuery = `
    INSERT INTO feedback (visitor_name, location, favourite_city, feedback)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [visitor_name, location, favourite_city, feedback];

  console.log("Inserting feedback with values:", values); // Log values being inserted

  try {
    const result = await db.query(insertQuery, values);
    res.json(result.rows[0]); // Respond with the newly created feedback entry
  } catch (error) {
    console.error("Error inserting feedback:", error.message); // Log the error
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a 500 status
  }
});

// Initial route for testing the server
app.get("/", (req, res) => {
  res.json({ message: "We built this server on ROCK N ROLL!!!" });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
