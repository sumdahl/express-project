const User = require("../models/user");

const handleGetAllUsers = async (req, res) => {
  const allDbUser = await User.find({});
  return res.json(allDbUser);
};

const handleGetUserById = async (req, res) => {
  const userToFind = await User.findById(req.params.id);
  if (!userToFind) return res.status(404).json({ error: "User not found" });
  return res.json(userToFind);
};

const handleUpdateUserById = async (req, res) => {
  //get from frontend
  await User.findByIdAndUpdate(req.params.id, {
    lastName: "Changed",
    jobTitle: "Project Manager",
  });
  return res.json({ msg: "Success" });
};

const handleDeleteUserById = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ msg: "Deleted", deletedUserId: req.params.id });
};

const handleCreateNewUser = async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name.trim() ||
    !body.last_name.trim() ||
    !body.email.trim() ||
    !body.gender.trim() ||
    !body.job_title.trim()
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
  return res.status(201).json({ msg: "user created", id: newUser._id });
};

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
