const express = require("express");
const { NotFoundError } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const auth = require("../middlewares/auth");
const {
  validateUserInfo,
  validateUserAuth,
} = require("../middlewares/validator");

const router = express.Router();

router.get("/", auth, (req, res) => {
  res.send({ message: "Authentication successful" });
});

router.post("/signin", validateUserAuth, login);
router.post("/signup", validateUserInfo, createUser);
router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;