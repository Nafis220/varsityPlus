const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoute = require("./routes/authenticationRoute");

const app = express();
dotenv.config();

//database connection
try {
  mongoose.connect(process.env.MONGO_CONNECTION_STRING);
} catch (error) {
  console.log(error);
}

//?This event is fired when the connection is successfully connected.
mongoose.connection.on("connected", () => {
  console.log("Mongoose connection is open");
});

//?This event is fired when the connection gives some error after the database is connected.
mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection has occured " + err + " error");
});

//? this event is fired when the database is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected");
});
// to parse the req body
app.use(express.json());

//! attached to studentRoute
app.use("/user", authRoute);

app.listen(process.env.PORT, () => {
  console.log(`server is listening to port ${process.env.PORT}`);
});
