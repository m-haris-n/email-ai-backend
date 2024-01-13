const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { getLatestTurn, createTurn } = require("../controllers/turnController");

const router = express.Router();

router.get("/", getLatestTurn);
router.post("/", validateToken, createTurn);

module.exports = router;
