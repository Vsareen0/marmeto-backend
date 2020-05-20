/*
    Approach for verification:

    Actually I am going to name it, Pre - Signup, run the controller
    where you get the user data and put that data in jwt
    send that to user's email
    if clicked on the verification link, send back to backend
    extract the user info from jwt 
    and use the info to save user in db  
*/

// Declare required dependencies
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(
  // Middlewares
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cookieParser()
);

app.get("/", (req, res) => {
  res.send("Server is listening, use the api's");
});

const PORT = process.env.PORT || 8000;

// Establish Database connection
options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGODB_URI, options)
  .then(() => console.log(`Connection to database established successfully !`))
  .catch((dbErr) =>
    console.log(`Unable to establish a database connection : ${dbErr.message}`)
  );

// Bring in routes
const authRoute = require("./routes/auth");
app.use("/api", authRoute);

app.listen(PORT, () =>
  console.log(`The server is listening on port : ${PORT}`)
);
