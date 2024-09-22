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

export const dbConnectionString = process.env.DATABASE_URL;

app.get("/", async function (req, res) {
  try {
    const queryResponse = await db.query("SELECT * FROM feedback");
    res.json(queryResponse.rows);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/add", async function (req, res) {
  try {
    const { visitor_name, location, favourite_city, feedback } =
      req.body.formValues;
    await db.query(
      `INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES ($1,$2,$3,$4)`,
      [visitor_name, location, favourite_city, feedback]
    );
    res.json({ message: "Feedback added successfully" });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
