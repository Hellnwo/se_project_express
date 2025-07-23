const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const { JWT_SECRET } = require("../utils/config");
const { BAD_REQUEST, NOT_FOUND, OK, CONFLICT, UNAUTHORIZED } = require('../utils/errors');

const getCurrentUser = (req, res, next) => {
 if (!req.user || !req.user.id) {
  return next(new UNAUTHORIZED("Authorization required"));
 }
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return next(new UNAUTHORIZED("User not found"));
      }
      return res.status(200).json({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return next(new BAD_REQUEST("Invalid Data"));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, password, email } = req.body;

  return User.findOne({ email })
  .then((existingUser) => {
    if (existingUser) {
      return next(new CONFLICT("Email already exists"));
    }
    return bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
    .then((user) =>
      res.status(200).json({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    );
  })
    .catch((err) => {
      console.error(err);
      if(err.name === 'ValidationError'){
        return next(new BAD_REQUEST("Invalid Data"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(OK).send({ token });
  })
  .catch((err) => {
    if (err.message === "Incorrect email or password") {
      return next(new UNAUTHORIZED("Invalid email or password"));
    }
    return next(err);
  });
};

const updateProfile = (req, res, next) => {
  if (!req.user || !req.user.id) {
  return next(new UNAUTHORIZED("Authorization required"));
 }

 console.log("Request body:", req.body);

 const { name, avatar } = req.body;

 return User.findByIdAndUpdate(
  req.user.id,
  { name, avatar},
  { new: true, runValidators: true }
 )
 .then((user) => {
  if (!user) {
    return next(new NOT_FOUND("User not found"));
  }
  const updatedUser = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    email: user.email,
  };
  console.log("Updated user:", updatedUser);
  return res.status(OK).json(updatedUser);
 })
 .catch((err) => {
  if (err.name === 'CastError' || err.name === 'ValidationError'){
        return next(new BAD_REQUEST("Invalide Data"));
      }
      return next(err)
 });
};

module.exports = { login, createUser, updateProfile, getCurrentUser};