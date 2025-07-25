const mongoose = require("mongoose");
const BadRequestError = require('../utils/error/BadRequestError');
const ForbiddenError = require('../utils/error/ForbiddenError');
const NotFoundError = require('../utils/error/NotFoundError');
const UnauthorizedError = require('../utils/error/UnauthorizedError');

const ClothingItem = require('../models/clothingItem');

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};


const createItems = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new UnauthorizedError("Authorization required"));
  }
  const { name, weather, imageUrl } = req.body;
  const owner = req.user.id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
      }
    });
};


const deleteItems = (req, res, next) => {
const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("The id string is in an invalid format"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      if (item.owner.toString() !== req.user.id.toString()) {
        return next(new ForbiddenError("You can only delete your own items"));
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).send({ data: deletedItem })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("The id string is in an invalid format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("The id string is in an invalid format"));
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};


module.exports = { getItems, createItems, deleteItems, likeItem, dislikeItem};