const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .then(thoughts => res.json(thoughts))
      .catch(err => res.status(500).json(err));
  },

  // Get a single thought by ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select('-__v')
      .then(thought => res.json(thought))
      .catch(err => res.status(500).json(err));
  },

  // Create a new thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id, username }) => {
        return User.findOneAndUpdate(
          { username: username },
          { $addToSet: { thoughts: _id } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought successfully created!' }))
      .catch(err => res.status(500).json(err));
  },

  // Update a thought by ID
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(thought => res.json(thought))
      .catch(err => res.status(500).json(err));
  },

  // Delete a thought by ID
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(thought => res.json(thought))
      .catch(err => res.status(500).json(err));
  },

  // Add a reaction to a thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(thought => res.json(thought))
      .catch(err => res.status(500).json(err));
  },

  // Remove a reaction from a thought
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(thought => res.json(thought))
      .catch(err => res.status(500).json(err));
  }
};

module.exports = thoughtController;
