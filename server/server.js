import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const dbConnectionString = process.env.DATABASE_URL;

export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

app.listen(8080, () => {
  console.log(
    `Server running on port 8080 where we are going we don"t need roads`
  );
});

app.get("/", (req, res) => {
  res.json({ message: "we built this server on ROCK N ROLL!!!" });
});

app.use(express.json());

//you need two routes minimum
//you need a route to READ the database data
app.get("/feedback", async (req, res) => {
  try {
    const { visitor_name, location, favourite_city, feedback } = req.body;
    const insertQuery = `INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [visitor_name, location, favourite_city, feedback];
    const result = await db.query(insertQuery, values);
    res.json({ status: "gee whiz buddy, phew that was a close one" });
  } catch (error) {
    console.error("Darn it buddy it fell through", error.message);
  }
});
