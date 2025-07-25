const router = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const auth = require("../middlewares/auth");
const { validateUserProfileUpdate } = require("../middlewares/validator");

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateUserProfileUpdate, updateUser);

module.exports = router;