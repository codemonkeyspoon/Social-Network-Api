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
    // Get single user
    getUserById({params}, res) {
        User.findOne({_id: params.id})
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
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No User found with this id "});
                return;
            }
            res.json(dbUserData)
        })
        .catch((err) => {
            console.log(err);
            res.status(404).json(err);
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