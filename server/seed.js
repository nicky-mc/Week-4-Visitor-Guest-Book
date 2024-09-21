// add SQL queries to create your table and add your dummy data
// look at https://dummyjson.com/
//
// minimum one table to store the form data,
import { db } from "./server.js";
db.query(
  `CREATE TABLE IF NOT EXISTS fedback (
    id SERIAL PRIMARY KEY,
    Visitor_name VARCHAR(70),
    location VARCHAR(30),
    favourite_city VARCHAR(30),
    feedback TEXT
)`
);
db.query(
  `INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES
    ('John Doe', 'Berlin', 'Berlin', 'I love Berlin because I love a good bier garten und currywurst'),
    ('Jane Doe', 'Paris', 'Paris', 'I love Paris bcause I love the elegance and the food'),
    ('John Smith', 'London', 'London', 'I love London becasue I like to risk getting stabbed if I take the wrong turn')`
);
