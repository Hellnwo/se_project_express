const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, FORBIDDEN, CONFLICT, INTERNAL_SERVER_ERROR, OK, CREATED, NO_CONTENT } = require('../utils/errors');

const getItems = (req, res) => {
  ClothingItem.find({})
    .then(items => res.status(OK).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const createItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => { res.status(OK).send({ data: item });
  })
    .catch((err) => {
      console.error(err);
      if(err.name === 'ValidationError'){
        return res.status(BAD_REQUEST).send({ message: err.message});
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const updateItems = (req, res) => {
  const {itemId} = req.params;
  const {imageUrl} = req.body;

  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageUrl}})
  .orFail()
  .then(item => res.status(OK).send({data: item}))
  .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const deleteItems = (req, res) => {
const {itemId} = req.params;

  ClothingItem.findByIdAndDelete(itemId)
  .orFail()
  .then((item) => {
    if (item.owner.toString() !== req.user._id) { return res.status(NO_CONTENT).send({message: err.message});
}
return item.deleteOne().then(() => {
  res.status(OK).send({message: 'Item successfully deleted', data: item,});
});
  })
  .catch((err) => {
      console.error(err);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(BAD_REQUEST).send({ message: err.message});
  } else if (err.name === 'DocumentNotFoundError') {
    res.status(NOT_FOUND).send({ message: err.message });
  } else res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
});
};

const likeItem = (req, res) => {
  const owner = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
  itemId,
  { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
  { new: true },
)
.orFail()
.then((item) => {
  res.status(OK).send(item);
})
.catch((err) => {
  console.error(err);
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(BAD_REQUEST).send({ message: err.message});
  } else if (err.name === 'DocumentNotFoundError') {
    res.status(NOT_FOUND).send({ message: err.message });
  } else res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
});
};

const dislikeItem = (req, res) => {
  const owner = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
  itemId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true },
)
.orFail()
.then((item) => {
  res.status(OK).send(item);
})
.catch((err) => {
  console.error(err);
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(BAD_REQUEST).send({ message: err.message});
  } else if (err.name === 'DocumentNotFoundError') {
    res.status(NOT_FOUND).send({ message: err.message });
  } else res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
});
};

module.exports = { getItems, createItems, updateItems, deleteItems, likeItem, dislikeItem};