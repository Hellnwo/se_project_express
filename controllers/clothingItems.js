const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, OK, NO_CONTENT } = require('../utils/errors');

const getItems = (req, res) => {
  ClothingItem.find({})
    .then(items => res.send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
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
        return res.status(BAD_REQUEST).send({ message: 'Invalid data'});
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
    });
};

const deleteItems = (req, res) => {
const {itemId} = req.params;

  ClothingItem.findByIdAndDelete(itemId)
  .orFail()
  .then((item) => {
    if (item.owner.toString() !== req.user._id) { return res.status(NO_CONTENT).send({message: "You don't have permission to delete this item"});
}
return item.deleteOne().then(() => {
  res.status(OK).send({message: 'Item successfully deleted', data: item,});
});
  })
  .catch((err) => {
      console.error(err);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(BAD_REQUEST).send({ message: 'Invalid data'});
  } if (err.name === 'DocumentNotFoundError') {
    return res.status(NOT_FOUND).send({ message: 'Item cannot be found' });
  } return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
});
};

const likeItem = (req, res) => {
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
    return res.status(BAD_REQUEST).send({ message: 'Invalid data'});
  } if (err.name === 'DocumentNotFoundError') {
    return res.status(NOT_FOUND).send({ message: 'Item cannot be found' });
  } return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
});
};

const dislikeItem = (req, res) => {
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
    return res.status(BAD_REQUEST).send({ message: 'Invalid data'});
  } if (err.name === 'DocumentNotFoundError') {
    return res.status(NOT_FOUND).send({ message: 'Item cannot be found' });
  } return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
});
};

module.exports = { getItems, createItems, deleteItems, likeItem, dislikeItem};