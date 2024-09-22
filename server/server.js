import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "https://week-4-visitor-guest-book-1.onrender.com", // stops CORS errors and allows only this domain but will allow client to access the server
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// Database connection
const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

// Routes
app.get("/", (_req, res) => {
  res.json(
    "Our server is running on localhost 8080, and we built it on Rock N Roll"
  );
});
app.get("/getFeedback", async (_req, res) => {
  try {
    const result = await db.query("SELECT * FROM feedback");
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    console.error("Error stack:", error.stack);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.post("/addFeedback", async (req, res) => {
  const { visitor_name, location, favourite_city, feedback } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES ($1, $2, $3, $4) RETURNING *",
      [visitor_name, location, favourite_city, feedback]
    );
    res.status(201).json(result.rows[0]); // Respond with the newly created feedback entry
  } catch (error) {
    console.error("Error inserting feedback:", error.message); // Log the error
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a 500 status
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
    console.error("Error liking feedback:", error.message); // Log the error
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a 500 status
  }
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
