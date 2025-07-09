const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');

router.use('/users', userRouter);
router.use('/item', itemRouter);

module.exports = router;