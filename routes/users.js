const router = require('express').Router();
const { celebrat, Joi } = require("celebrate");
const { getCurrentUser, updateProfile } = require('../controllers/users');
const auth = require("../middlewares/auth")

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

router.patch("/me", auth, validateUpdateUser, updateProfile);

module.exports = router;