const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, FORBIDDEN, CONFLICT, INTERNAL_SERVER_ERROR, OK, CREATED, NO_CONTENT } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(OK).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then(user => res.status(CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if(err.name === 'ValidationError'){
        return res.status(BAD_REQUEST).send({ message: err.message});
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
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
    res.status(NOT_FOUND).send({ message: err.message });
      } else if (err.name === 'CastError'){
        res.status(BAD_REQUEST).send({ message: err.message});
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, getUser, createUser};