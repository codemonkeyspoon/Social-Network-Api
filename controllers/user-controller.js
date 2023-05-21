const { User, Thought } = require("../models");

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
  // Update user
  async updateUser({ params, body }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      });
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  // Delete user
  async deleteUser({ params }, res) {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: params.id });
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    } catch (error) {
        res.status(400).json(error)
    }
  },
  async createFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
  
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }
  
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },
  
  async deleteFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
  
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }
  
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  }
};

module.exports = userController;
