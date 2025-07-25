const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const { JWT_SECRET } = require("../utils/config");
const { OK, CREATED } = require('../utils/errors');
const BadRequestError = require('../utils/error/BadRequestError');
const UnauthorizedError = require('../utils/error/UnauthorizedError');
const ConflictError = require('../utils/error/ConflictError');
const NotFoundError = require('../utils/error/NotFoundError');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials( email, password )
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(OK).send({ token });
  } catch (err) {
    if (err.message === 'Incorrect email or password') {
      return next(new UnauthorizedError('Incorrect email or password'));
    }
    return next(err);
  };
}

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("The 'email' and 'password' fields are required"));
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user =await User.create({ name, avatar, email, password: hash });
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(CREATED).send(userObj);
  } catch(err) {
    if (err.code === 11000) {
      return next(new ConflictError('User with this email already exists'));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
}

const getCurrentUser = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return res.status(OK).send(user);
  } catch(err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user ID format'));
    }
    return next(err);
  }
}

const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true })
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return res.status(OK).send(user);
  } catch(err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
}


module.exports = { login, createUser, updateUser, getCurrentUser};