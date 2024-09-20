// this imports our modules and sets up our database connection and pg pool
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});

// initialise express
const app = express();
// configure dotenv
dotenv.config();
//tell express app to use json
// tell express to use cors
app.use(express.json());
app.use(cors());
// need to set up port for app to listen
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/", (_request, response) => {
  response.json(
    "Our server is running on localhost 8080, and we built it on Rock N Roll"
  );
});
// I need to set up a port using the connection string using the .env file

// and need to set up a root route

// you need two routews minimum
// you need  ROUTE TO READ THE DATA BASE QUERY
// you need to route to create ot add new data to the database
// ! in your create route the request.body is an object that represents the form data coming from your client
// you need to use sql queries and parameters in these routes

//! in .env you need your database connection string with the correct password
