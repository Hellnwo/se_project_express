const router = require('express').Router();
const { celebrate, Joi } = require("celebrate");
const validator = require('validator');
const { getCurrentUser, updateUser } = require('../controllers/users');
const auth = require("../middlewares/auth");

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional,
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.error('string.uri', { value });
    }),
  }),
});

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateUpdateUser, updateUser);

module.exports = router;