const BadRequestError = require('../utils/error/BadRequestError');
const ForbiddenError = require('../utils/error/ForbiddenError');
const NotFoundError = require('../utils/error/NotFoundError');

const ClothingItem = require('../models/clothingItem');
const { OK, CREATED } = require('../utils/errors');

const getItems = async (req, res, next) => {
  try {
  const items = await ClothingItem.find().sort({ createdAt: -1});
    return res.status(OK).send(items);
  } catch(err) {
      console.error(err);
      return next(err);
    }
};

const createItems = async (req, res, next) => {
  try {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  const newItem = await ClothingItem.create({ name, weather, imageUrl, owner, createdAt: Date.now() });
    return res.status(CREATED).send(newItem);
  } catch(err) {
    if(err.name === 'ValidationError'){
        return next(new BadRequestError(err.message));
      }
      return next(err);
  }
};

const deleteItems = async (req, res, next) => {
try {
  const {itemId} = req.params;

  const item = await ClothingItem.findBy(itemId).orFail();
  if (String(item.owner) !== req.user._id) {
    throw new ForbiddenError("You cannot delete this item");
  }
  await item.deleteOne();
  return res.status(OK).send({ message: "Successfully deleted"});
} catch (err) {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new BadRequestError("Invalid item ID format"));
  }
  if (err.name === 'DocumentNotFoundError') {
    return next(new NotFoundError('Item cannot be found'));
  }
  return next(err);
}
}

const likeItem = async (req, res, next) => {
  try {
  const { itemId } = req.params;
  const userId = req.user._id;

  const item = await ClothingItem.findByIdAndUpdate(
  itemId,
  { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
  { new: true },
)
.orFail(() => new NotFoundError("Item not found"));
return res.status(OK).send(item);
} catch(err) {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new BadRequestError("Invalid item ID format"));
  }
  return next(err);
}
}

const dislikeItem = async (req, res, next) => {
  try {
  const { itemId } = req.params;
  const userId = req.user._id;

 const item = await ClothingItem.findByIdAndUpdate(
  itemId,
  { $pull: { likes: userId } }, // remove _id from the array
  { new: true },
)
.orFail(() => new NotFoundError("Item not found"));
return res.status(OK).send(item);
} catch(err) {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new BadRequestError("Invalid item ID format"));
  }
  return next(err);
}
}

module.exports = { getItems, createItems, deleteItems, likeItem, dislikeItem};