import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "https://week-4-visitor-guest-book-1.onrender.com",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Database connection
const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Successfully connected to the database");
  }
});

// Table structure check
db.query(
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'feedback'",
  (err, res) => {
    if (err) {
      console.error("Error checking feedback table:", err);
    } else {
      console.log("Feedback table structure:", res.rows);
    }
  }
);

// Routes
app.get("/", (_req, res) => {
  res.json(
    "Our server is running on localhost 10000, and we built it on Rock N Roll"
  );
});

app.get("/feedback", async (_req, res) => {
  try {
    const result = await db.query("SELECT * FROM feedback");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.post("/addFeedback", async (req, res) => {
  const { visitor_name, location, favourite_city, feedback } = req.body;

  // Basic input validation
  if (!visitor_name || !location || !favourite_city || !feedback) {
    return res.status(400).json({ error: "All fields are required" });
  }

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

app.post("/likeFeedback", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Feedback ID is required" });
  }

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

// Start the server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
