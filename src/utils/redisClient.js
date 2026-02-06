const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

client.on("connect", () => {
  console.log("Redis client connected successfully");
});

(async () => {
  if (!client.isOpen) {
    await client.connect();
  }
})();

module.exports = client;
