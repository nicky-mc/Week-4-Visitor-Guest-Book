import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg"; // Import Pool from pg

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure this is set in your .env file
});

// Endpoint to get feedback
app.get("/api/feedback", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM feedback");
    res.json(result.rows); // Send feedback data as JSON
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add feedback
app.post("/api/addFeedback", async (req, res) => {
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
const PORT = process.env.PORT || 10000; // Use specified port or fallback to 10000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
