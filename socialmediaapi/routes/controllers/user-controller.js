const { User } = require('../models');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .select('-__v')
      .then(users => res.json(users))
      .catch(err => res.status(500).json(err));
  },

  // Get a single user by ID
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .select('-__v')
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },

  // Create a new user
  createUser({ body }, res) {
    User.create(body)
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },

  // Update a user by ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },

  // Delete a user by ID
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },

  // Add a friend to a user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true }
    )
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },

  // Remove a friend from a user's friend list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  }
};

module.exports = userController;
