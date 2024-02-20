const express = require("express");

const { connectMongoDb } = require("./connection");

const { logReqRes } = require("./middlewares");

const userRouter = require("./routes/user");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3000;

//Connection
connectMongoDb("mongodb://127.0.0.1:27017/test-mongo")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(`Mongo Error: ${err}`));

//Middlewares Plugin
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

//Routes
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is listening at port : ${port}`);
});
