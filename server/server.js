import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const dbConnectionString = process.env.DATABASE_URL;
const db = new pg.Pool({
  connectionString: dbConnectionString,
});

// initialise express
const app = express();
app.use(express.json());
app.use(cors());

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (_request, response) => {
  response.json(
    "Our server is running on localhost 8080, and we built it on Rock N Roll"
  );
});

app.get("/getFeedback", async (_request, response) => {
  try {
    const result = await db.query("SELECT * FROM feedback");
    response.json(result.rows);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/addFeedback", async (request, response) => {
  const { visitor_name, location, favourite_city, feedback } = request.body;

  try {
    const result = await db.query(
      "INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES ($1, $2, $3, $4) RETURNING *",
      [visitor_name, location, favourite_city, feedback]
    );
    response.status(201).json(result.rows[0]);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
