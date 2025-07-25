const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require('../utils/error/BadRequestError');
const UnauthorizedError = require('../utils/error/UnauthorizedError');
const ConflictError = require('../utils/error/ConflictError');
const NotFoundError = require('../utils/error/NotFoundError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Invalid email or password"));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
   const { name, avatar, password, email } = req.body;

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("Email already exists"));
      }
      return bcrypt.hash(password, 10).then((hash) =>
        User.create({ name, avatar, email, password: hash }).then((user) =>
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
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new UnauthorizedError("Authorization required"));
  }
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError("User not found"));
      }
      return res.status(200).json({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
   if (!req.user || !req.user.id) {
    return next(new UnauthorizedError("Authorization required"));
  }

  console.log("Request body:", req.body);

  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      const updatedUser = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      console.log("Updated user:", updatedUser);
      return res.status(200).json(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};


module.exports = { login, createUser, updateUser, getCurrentUser};