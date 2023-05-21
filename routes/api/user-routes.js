const router = require('express').Router();
const {getAllUsers, getUserById, createUser, updateUser, deleteUser, createFriend, deleteFriend} = require('../../controllers/user-controller');

router.route('/').get(getAllUsers).post(createUser);

module.exports = router;