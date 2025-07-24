const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require("celebrate");
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { createUser, login } = require("../controllers/users");
const NotFoundError = require('../utils/error/NotFoundError');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri', { value });
};
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional,
    avatar: Joi.string().required().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required,
}),
});
const validateSignIn = celebrate({
  body: Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
}),
});

router.post("/signin", validateSignIn, login);
router.post("/signup", validateCreateUser, createUser)

router.use('/users', userRouter);
router.use('/items', itemRouter);

router.use((req, res, next) =>
  next(new NotFoundError("User or Item not found"))
);

module.exports = router;