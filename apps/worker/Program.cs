using StackExchange.Redis;
using Npgsql;
using System.Text.Json;

Console.WriteLine("Worker starting...");

/*
  Redis Connection
*/
var redisHost = Environment.GetEnvironmentVariable("REDIS_HOST") ?? "redis";

var redis = await ConnectionMultiplexer.ConnectAsync($"{redisHost}:6379");
var db = redis.GetDatabase();

Console.WriteLine("Connected to Redis");

/*
  PostgreSQL Connection
*/

var postgresHost =
    Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? "postgres";


var postgresHost =
    Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? "postgres";

var postgresPassword =
    Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") ?? "postme";

var connectionString =
    $"Host={postgresHost};Port=5432;Username=postgres;Password={postgresPassword};Database=feedbackdb";

await using var pgConnection = new NpgsqlConnection(connectionString);

await pgConnection.OpenAsync();

Console.WriteLine("Connected to PostgreSQL");

/*
  Worker Loop
*/
while (true)
{
    try
    {
        /*
          Read latest item from Redis queue
        */
        var result = await db.ListRightPopAsync("feedback_queue");

        if (!result.IsNullOrEmpty)
        {
            Console.WriteLine($"Feedback received from Redis: {result}");

            /*
              Parse JSON
            */
            var feedback =
                JsonSerializer.Deserialize<Feedback>(result!);

            /*
              Insert into PostgreSQL
            */
            var cmd = new NpgsqlCommand(
                "INSERT INTO feedback (rating, comment) VALUES (@rating, @comment)",
                pgConnection
            );

            cmd.Parameters.AddWithValue("rating", feedback!.rating);
            cmd.Parameters.AddWithValue("comment", feedback.comment ?? "");

            await cmd.ExecuteNonQueryAsync();

            Console.WriteLine("Feedback inserted into PostgreSQL");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }

    /*
      Small delay to avoid CPU overuse
    */
    await Task.Delay(2000);
}

/*
  Feedback Model
*/
public class Feedback
{
    public string rating { get; set; }
    public string comment { get; set; }
}
