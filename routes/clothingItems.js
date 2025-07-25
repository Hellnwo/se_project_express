const router = require('express').Router();
const { celebrate, Joi } = require("celebrate");
const validator = require('validator');
const auth = require("../middlewares/auth");
const { getItems, createItems, deleteItems, likeItem, dislikeItem } = require('../controllers/clothingItems');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri', { value });
};

router.get('/', getItems);

router.post('/', celebrate({
body: Joi.object().keys({
name: Joi.string().required().min(2).max(30),
imageUrl: Joi.string().required().custom(validateURL),
weather: Joi.string().required().valid('hot', 'cold', 'warm')
})
}),
auth, createItems);

router.delete('/:itemId', celebrate({
  params: Joi.object().keys({
  itemId: Joi.string().alphanum().length(24).required(),
  })
}), auth, deleteItems);

router.put('/:itemId/likes', celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required(),
  })
}), auth, likeItem);

router.delete('/:itemId/likes', celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required(),
  })
}), auth, dislikeItem);

module.exports = router;