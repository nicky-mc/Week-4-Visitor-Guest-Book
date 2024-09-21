import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const corsOptions = { origin: "https:visitor-guest-book-1.onrender.com" };
app.use(cors(corsOptions));
const dbConnectionString = process.env.DATABASE_URL;

export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
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
