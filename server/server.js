import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://week4-assignment-guestbook-1.onrender.com", // Your frontend origin
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

const dbConnectionString = process.env.DATABASE_URL;

export const db = new pg.Pool({
  connectionString: dbConnectionString,
  ssl: { rejectUnauthorized: false },
});

app.get("/", async function (req, res) {
  const queryResponse = await db.query("SELECT * FROM feedback");
  res.json(queryResponse.rows);
});
app.listen(10000, function () {
  console.log("server is running on port 88 miles an hour on port 10000");
});

app.post("/add", function (req, res) {
  console.log(req.body.formValues.visitor_name);

  app.post("/add", function (req, res) {
    const { visitor_name, location, favourite_city, feedback } =
      req.body.formValues;
    db.query(
      `INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES ($1,$2,$3,$4)`,
      [visitor_name, location, favourite_city, feedback]
    );
    res.json({ message: "Feedback added successfully" });
  });
});
