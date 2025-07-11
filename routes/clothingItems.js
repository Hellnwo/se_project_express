const router = require('express').Router();
const { getItems, createItems, deleteItems, updateItems, likeItem, dislikeItem } = require('../controllers/clothingItems');

router.get('/', getItems);

router.post('/', createItems);

router.delete('/:itemId', deleteItems);

router.put('/:itemId/likes', likeItem);

router.delete('/:itemId/likes', dislikeItem);

module.exports = router;