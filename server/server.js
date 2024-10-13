import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "https://week-4-visitor-guest-book-1.onrender.com",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Database connection
const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

// Routes
app.get("/", (_req, res) => {
  res.json("Our server is running on localhost 8080");
});

app.get("/feedback", async (_req, res) => {
  try {
    const result = await db.query("SELECT * FROM feedback ORDER BY id DESC");
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

  // Simple data wrangling and validation
  const wrangle = (str) => (str ? str.trim().substring(0, 255) : null);

  const wrangledData = {
    visitor_name: wrangle(visitor_name),
    location: wrangle(location),
    favourite_city: wrangle(favourite_city),
    feedback: wrangle(feedback),
  };

  // Ensure visitor_name is not null
  if (!wrangledData.visitor_name) {
    return res.status(400).json({ error: "Visitor name is required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        wrangledData.visitor_name,
        wrangledData.location,
        wrangledData.favourite_city,
        wrangledData.feedback,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting feedback:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
