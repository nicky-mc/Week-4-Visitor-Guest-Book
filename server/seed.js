// add SQL queries to create your table and add your dummy data
// look at https://dummyjson.com/
//
// minimum one table to store the form data,
import { db } from "./server.js";

async function seed() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        visitor_name VARCHAR(70),
        location VARCHAR(30),
        favourite_city VARCHAR(30),
        feedback TEXT
      );
    `);

    // Insert dummy data
    await db.query(`
      INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES
        ('John Doe', 'Berlin', 'Berlin', 'I love Berlin because I love a good bier garten und currywurst'),
        ('Jane Doe', 'Paris', 'Paris', 'I love Paris because I love the elegance and the food'),
        ('John Smith', 'London', 'London', 'I love London because I like to risk getting stabbed if I take the wrong turn')
        ON CONFLICT DO NOTHING; -- Prevents duplicate entries if re-seeded
    `);

    console.log("gee whiz buddy, phew that was a close one");
  } catch (error) {
    console.error("oh gee buddy guess I'm out of seed:", error.message);
  } finally {
    db.end();
  }
}

seed();
