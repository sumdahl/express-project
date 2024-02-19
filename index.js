const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

//Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/test-mongo")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(`Mongo Error: ${err}`));

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);
//Middlewares
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const timeStamp = new Date();
  fs.appendFile(
    "log.txt",
    `${timeStamp.toLocaleString()} : ${req.ip} : ${req.method} : ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
});

//Routes
app.get("/", (req, res) => {
  return res.send("Home Page");
});

app.get("/users", async (req, res) => {
  const allDbUser = await User.find({});
  const html = `
    <ul>
        ${allDbUser
          .map((user) => `<li>${user.firstName} - ${user.email} </li>`)
          .join(" ")}
    </ul>
    `;
  return res.send(html);
});

app.get("/api/users", async (req, res) => {
  const allDbUser = await User.find({});
  return res.json(allDbUser);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const userToFind = await User.findById(req.params.id);
    if (!userToFind) return res.status(404).json({ error: "User not found" });
    return res.json(userToFind);
  })
  .patch(async (req, res) => {
    //get from frontend
    await User.findByIdAndUpdate(req.params.id, {
      lastName: "Changed",
      jobTitle: "Project Manager",
    });
    return res.json({ msg: "Success" });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Deleted" });
  });

  //intendedly deleted all the users 
// app.delete("/api/users", async (req, res) => {
//   await User.deleteMany({});
//   return res.json({ msg: "I screwed up your database, haha" });
// });
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  const newUser = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  return res.status(201).json({ msg: "user created" });
});

app.listen(port, () => {
  console.log(`Server is listening at port : ${port}`);
});
