const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, OK, CREATED } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then(user => res.status(CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if(err.name === 'ValidationError'){
        return res.status(BAD_REQUEST).send({ message: 'Invalid data'});
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then(user => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
    return res.status(NOT_FOUND).send({ message: 'User cannot be found' });
      } if (err.name === 'CastError' || err.name === 'ValidationError'){
        return res.status(BAD_REQUEST).send({ message: 'Invalid data'});
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
    });
};

module.exports = { getUsers, getUser, createUser};