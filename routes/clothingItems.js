const router = require('express').Router();
const auth = require("../middlewares/auth");
const { getItems, createItems, deleteItems, likeItem, dislikeItem } = require('../controllers/clothingItems');
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validator");

router.post("/", auth, validateClothingItem, createItems);

router.get("/", getItems);

router.delete("/:itemId", auth, validateId, deleteItems);

router.put("/:itemId/likes", auth, validateId, likeItem);

router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;