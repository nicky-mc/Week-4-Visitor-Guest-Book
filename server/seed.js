import { db } from "../server/server.js";

async function seedDatabase() {
  try {
    // Create feedback table if it doesn't exist
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
      ('John Doe', 'Berlin', 'Berlin', 'I love Berlin because I love a good biergarten und currywurst'),
      ('Jane Doe', 'Paris', 'Paris', 'I love Paris because I love the elegance and the food'),
      ('John Smith', 'London', 'London', 'I love London because I like to risk getting stabbed if I take the wrong turn');
    `);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await db.end(); // Close the database connection
  }
}
