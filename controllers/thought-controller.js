const { Thought, User } = require("../models");

const thoughtController = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find({})
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(dbThoughtData);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },
  // Get single thought
  async getThoughtById({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOne({
        _id: params.thoughtId,
      })
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v");
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id" });
        return;
      }
      res.json(dbThoughtData);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },
  // Create Thought
  async createThought({ params, body }, res) {
    try {
      console.log(body);
      const thought = await Thought.create(body);
      const { _id } = thought;
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { thoughts: _id } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }

      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },
  // Update Thought
  async updateThought({ params, body }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        body,
        { new: true, runValidators: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought found with this id" });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.json(err);
    }
  },
  // Delete Thought
  async deleteThought({ params }, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({ _id: params.thoughtId });

      if (!deletedThought) {
        return res.status(404).json({ message: "No thought with this id" });
      }

      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id" });
      }

      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },
  // Create Reaction
  async createReaction({ params, body }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought found with this id" });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.json(err);
    }
  },

  // Delete Reaction
  async deleteReaction({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true, runValidators: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought found with this id!" });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.json(err);
    }
  },
};

module.exports = thoughtController;
