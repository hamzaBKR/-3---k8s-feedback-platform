const express = require("express");
const { Client } = require("pg");

const app = express();

/*
  PostgreSQL Client
*/
const client = new Client({
  host: process.env.POSTGRES_HOST || "postgres",
  port: 5432,
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postme",
  database: process.env.POSTGRES_DB || "feedbackdb"
});

/*
  Connect PostgreSQL
*/
client.connect()
  .then(() => {
    console.log("Connected to PostgreSQL 🚀");
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
  });

/*
  Dashboard Route
*/
app.get("/", async (req, res) => {

  try {

    const result = await client.query(`
      SELECT rating, COUNT(*) as total
      FROM feedback
      GROUP BY rating
      ORDER BY total DESC
    `);

    let html = `
      <html>
      <head>
        <title>Feedback Dashboard</title>

        <style>

          body {
            font-family: Arial;
            background: #f4f4f4;
            padding: 40px;
          }

          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            width: 600px;
            margin: auto;
            box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
          }

          h1 {
            margin-bottom: 30px;
          }

          .card {
            background: #0077ff;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 20px;
          }

        </style>

      </head>

      <body>

        <div class="container">

          <h1>Feedback Analytics 📊</h1>
    `;

    result.rows.forEach((row) => {

      html += `
        <div class="card">
          ${row.rating}: ${row.total}
        </div>
      `;

    });

    html += `
        </div>
      </body>
      </html>
    `;

    res.send(html);

  } catch (err) {

    console.error(err);

    res.status(500).send("Database error");

  }

});

/*
  Start App
*/

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Result app running on port 4000");
});
