const express = require("express");
const fs = require("fs");
require("dotenv").config();
const users = require("./MOCK_DATA.json");

const app = express();
const port = process.env.PORT || 3000;

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

app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users
          .map((user) => `<li>${user.first_name} ${user.last_name}</li>`)
          .join(" ")}
    </ul>
    `;
  return res.send(html);
});

app.get("/api/users", (req, res) => {
  console.log(req.headers);
  res.setHeader("X-MyName", "Sumiran Dahal"); //Always add X to custom header, good practise
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const userToFind = users.find((user) => user.id === id);
    if (!userToFind) return res.status(404).json({ error: "User not found" });
    return res.json(userToFind);
  })
  .patch((req, res) => {
    //edit user with id
    const id = Number(req.params.id);
    const updatedData = req.body;
    //index of user to be edited
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({ status: "success", user: users[index] });
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.splice(index, 1); //delete the user from the index
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({ status: "deleted", id });
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

app.post("/api/users", (req, res) => {
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
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "success", id: users.length });
  });
});

app.listen(port, () => {
  console.log(`Server is listening at port : ${port}`);
});
