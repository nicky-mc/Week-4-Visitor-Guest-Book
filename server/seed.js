import { db } from "../server/server.js";

// Create feedback table if it doesn't exist
db.query(
  `
  CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    visitor_name VARCHAR(70),
    location VARCHAR(30),
    favourite_city VARCHAR(30),
    feedback TEXT NOT NULL,
    likes INT DEFAULT 0
  );
`
).catch((error) => {
  console.error("Error creating feedback table:", error.message);
});

// Insert dummy data
db.query(
  `
  INSERT INTO feedback (visitor_name, location, favourite_city, feedback, likes) VALUES
  ('John Doe', 'Berlin', 'Berlin', 'I love Berlin because I love a good biergarten und currywurst', 5),
  ('Jane Doe', 'Paris', 'Paris', 'I love Paris because I love the elegance and the food', 2),
  ('John Smith', 'London', 'London', 'I love London because I like to risk getting stabbed if I take the wrong turn', 3)
  ON CONFLICT (id) DO NOTHING;
`
).catch((error) => {
  console.error("Error inserting dummy data:", error.message);
});

console.log("Database seeding completed successfully.");
