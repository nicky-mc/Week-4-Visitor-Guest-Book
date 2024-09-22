import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "https://week-4-visitor-guest-book-1.onrender.com/", 
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));

//this is the connection string to connect to the database
const dbConnectionString = process.env.DATABASE_URL;
//this connects to seed.js file and creates the table and inserts the dummy data
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

// this is the connection string to connect to the database
app.get("/", (_req, res) => {
  res.json("Our server is running!");
});

// and now this is the code to get the feedback from the database
app.get("/getFeedback", async (_req, res) => {
  try {
    const result = await db.query("SELECT * FROM feedback");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving feedback:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// this should be the code to add feedback to the database
app.post("/addFeedback", async (req, res) => {
  const { visitor_name, location, favourite_city, feedback } = req.body;
// and this is the try catch block to insert the feedback into the database
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
