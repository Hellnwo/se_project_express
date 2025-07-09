const ClothingItem = require('../models/clothingItem');

const getItems = (req, res) => {
  ClothingItem.find({})
    .then(items => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log(req.user._id);

  ClothingItem.create({ name, weather, imageUrl })
    .then(item => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const updateItems = (req, res) => {
  const {itemId} = req.params;
  const {imageUrl} = req.body;

  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageUrl}})
  .orFail()
  .then(item => res.status(200).send({data: item}))
  .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const deleteItems = (req, res) => {
const {itemId} = req.params;

  ClothingItem.findByIdAndDelete(itemId)
  .orFail()
  .then(item => res.status(204).send({}))
  .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });;
};

const likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
  { new: true },
);

const dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true },
);

module.exports = { getItems, createItems, updateItems, deleteItems, likeItem, dislikeItem};