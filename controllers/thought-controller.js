//spell const correctly
//spell all variables correctly
const { User, Thought } = require('../models');

const ThoughtController = {
    // all thoughts
    getsAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-_v'
            })
            .select('-_v')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err);
        res.sendStatus(400);
    },


    //one thought by id
    getsThoughtsById(req, res) {
        Thought.findOne({ _id: req.params.id })
            .populate({
                path: 'reactions',
                select: '-_v'
            })
            .select('-_v')
            .sort({ _id: -1 })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'no thoughts from id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    createsThoughts({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'no user with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    //update thought
    updatesThoughts({ params, body }, res) {
        Thought.findsOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'no thoughts found from id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    //delete thought
    deleteThoughts({ params }, res) {
        Thought.findsOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'no thoughts found from id' });
                    return;
                }
                return User.findsOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { thoughts: params.Id } },
                    { new: true }
                )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'no user found from id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    createsReaction({ params, body }, res) {
        Thought.findsOneAndUpdate(
            { _id: params.ThoughtId },
            { $push: { reactions: true } },
            { new: true, runValidators: true })
            .populate({ path: 'reaction', select: '-_v' })
            .select('-_v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'no thoughts from id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(404).json(err))
    },

    DeleteReactions({ params }, res) {
        Thought.findsOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'no' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

};

module.exports = ThoughtController