const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const redis = require("redis");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/*
  Redis Client
*/

const redisHost = process.env.REDIS_HOST || "localhost";


const client = redis.createClient({
  url: `redis://${redisHost}:6379`
});

client.connect();

client.on("error", (err) => {
  console.log("Redis Error:", err);
});

/*
  Routes
*/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/vote", async (req, res) => {

  const feedback = {
    rating: req.body.rating,
    comment: req.body.comment
  };

  console.log("Feedback received:");
  console.log(feedback);

  /*
    Push feedback to Redis queue
  */
  await client.lPush(
    "feedback_queue",
    JSON.stringify(feedback)
  );

  console.log("Feedback pushed to Redis");

  res.send(`
    <h1>Thank you for your feedback 🚀</h1>
    <a href="/">Go Back</a>
  `);

});

/*
  Start server
*/

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Vote app running on port 3000");
});
