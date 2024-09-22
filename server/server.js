import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Create a PostgreSQL connection pool
export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Endpoint to get feedback
app.get("/feedback", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM feedback");
    res.json(result.rows); // Send feedback data as JSON
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add feedback
app.post("/addfeedback", async (req, res) => {
  const { visitor_name, location, favourite_city, feedback } = req.body; // Extract feedback data from request

  try {
    await pool.query(
      `INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES ($1, $2, $3, $4)`,
      [visitor_name, location, favourite_city, feedback]
    );
    res.json({ message: "Feedback added successfully" }); // Respond with success message
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 8080; // Use specified port or fallback to 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
