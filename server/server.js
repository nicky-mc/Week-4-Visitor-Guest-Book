import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "https://your-frontend-url.com", // Update this with your front-end URL
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// Database connection
const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

// Define routes
app.get("/", (_req, res) => {
  res.json("Our server is running!");
});

// Fetch feedback
app.get("/getFeedback", async (_req, res) => {
  try {
    const result = await db.query("SELECT * FROM feedback");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving feedback:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add feedback
app.post("/addFeedback", async (req, res) => {
  const { visitor_name, location, favourite_city, feedback } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES ($1, $2, $3, $4) RETURNING *",
      [visitor_name, location, favourite_city, feedback]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting feedback:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Like feedback
app.post("/likeFeedback", async (req, res) => {
  const { id } = req.body; // id of the feedback to like
  try {
    const result = await db.query(
      "UPDATE feedback SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error liking feedback:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete feedback
app.delete("/deleteFeedback/:id", async (req, res) => {
  const { id } = req.params; // id of the feedback to delete
  try {
    const result = await db.query(
      "DELETE FROM feedback WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
