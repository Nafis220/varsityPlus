const redis = require("redis");

//? redis connection
const client = redis.createClient("redis://127.0.0.1:6379");
client.connect();

client.on("error", (error) => {
  console.log("redis connection error", error);
});
module.exports = client;
