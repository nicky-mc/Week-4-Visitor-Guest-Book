const app = express();

//config dotenv
dotenv.config();

//tell express app to use json
//tell express app to use cors
app.use(express.json());
app.use(cors());
const corsOptions = {
  origin: "https://week4-assignment-guestbook-1.onrender.com", // Your frontend origin
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

//setup database pool using the connection
const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

//i need to set up root route
app.get("/", (req, res) => {
  res.json({ message: "I am ROOOOOOTTTT" });
});

app.get("/data", async (req, res) => {
  // read from database and return array of feedbacks
  const query = await db.query("SELECT * from messages ORDER BY id DESC");
  return res.json(query.rows);
});

app.post("/feedback", async (req, res) => {
  // save to database feedback sent from client
  const bodyData = await req.body;

  const feedbackData = bodyData.feedbackData;
  // console.log("feedbackData", feedbackData);

  const result = await db.query(`
      INSERT INTO messages (name, location, favnumber, feedback)
      VALUES ('${feedbackData.visitor_name}', '${feedbackData.location}', '${feedbackData.favourite_city}', '${feedbackData.feedback}')
  `);

  console.log("databse insert result", result);

  if (result.rowCount === 1) {
    res.json({
      message: "feedback received",
    });
  } else {
    res.json({
      message: "Error saving feedback, please try again",
    });
  }
});

//setup a apart for my app to listen
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`My server is running on PORT: ${PORT}`);
});
