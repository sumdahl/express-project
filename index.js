const express = require("express");
const fs = require("fs");
require("dotenv").config();
const users = require("./MOCK_DATA.json");

const app = express();
const port = process.env.ENV || 3000;

//Middleware
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/", (req, res) => {
  return res.send("Home Page");
});

app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join(" ")}
    </ul>
    `;
  return res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const userToFind = users.find((user) => user.id === id);
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
  //TODO : Create new user
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

app.listen(port, () => {
  console.log(`Server is listening at port : ${port}`);
});
