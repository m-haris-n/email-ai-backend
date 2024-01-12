const express = require("express");
const {
   createUser,
   loginUser,
   getMe,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.get("/me", validateToken, getMe);

module.exports = router;
