const router = require('express').Router();
const { getItem, createItem, deleteItem, updateItems, likeItem, dislikeItem } = require('../controllers/clothingItems');

router.get('/items', getItem);

router.post('/', createItem);

router.delete('/:itemId', deleteItem);

router.put('/:itemId', updateItems);

router.put('/:itemId/likes', likeItem);

router.delete('/:itemId/likes', dislikeItem);

module.exports = router;