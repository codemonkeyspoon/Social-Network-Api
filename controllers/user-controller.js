const {User, Thought} = require('../models');

const userController = {
    // Get all users
    async getAllUsers(req, res) {
      try {
        const dbUserData = await User.find({})
          .populate([
            {
              path: "thoughts",
              select: "-__v",
            },
            {
              path: "friends",
              select: "-__v",
            },
          ])
          .select("-__v")
          .sort({ _id: -1 });
  
        res.json(dbUserData);
      } catch (err) {
        console.log(err);
        res.status(400).json(err);
      }
    },
    // Get single user
    async getUserById({ params }, res) {
      try {
        const dbUserData = await User.findOne({ _id: params.id })
          .populate([
            {
              path: "thoughts",
              select: "-__v",
            },
            {
              path: "friends",
              select: "-__v",
            },
          ])
          .select("-__v");
  
        if (!dbUserData) {
          res.status(404).json({ message: "No User found with this id" });
          return;
        }
  
        res.json(dbUserData);
      } catch (err) {
        console.log(err);
        res.status(404).json(err);
      }
    },
    // Create User
    async createUser({ body }, res) {
      try {
        const dbUserData = await User.create(body);
        res.json(dbUserData);
      } catch (err) {
        res.status(400).json(err);
      }
    },
  };
  
  module.exports = userController;