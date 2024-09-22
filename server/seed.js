import { db } from "../server/server.js";

await db.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        visitor_name TEXT NOT NULL,
        location TEXT NOT NULL,
        favourite_city TEXT NOT NULL,
        feedback TEXT NOT NULL
      );
    `);

// Insert dummy data
await db.query(`
      INSERT INTO feedback (visitor_name, location, favourite_city, feedback) VALUES
      ('John Doe', 'Berlin', 'Berlin', 'I love Berlin because I love a good biergarten und currywurst'),
      ('Jane Doe', 'Paris', 'Paris', 'I love Paris because I love the elegance and the food'),
      ('John Smith', 'London', 'London', 'I love London because I like to risk getting stabbed if I take the wrong turn');
    `);

console.log("Database seeded successfully");
