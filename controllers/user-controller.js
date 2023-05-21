const {User, Thought} = require('../models');

const userController = {
    //Get all users
    getAllUsers(req, res) {
        User.find({})
        .populate([
            {
                path: "thoughts",
                select: "-__v"
            },
            {
                path: "friends",
                select: "-__v"
            }
        ])
        .select("-__v")
        .sort({_id: -1})
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err)
        });
    },
    //Create User
    createUser({ body }, res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(400).json(err));
    }
}


module.exports = userController;