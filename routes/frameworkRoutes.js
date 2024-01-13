const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
   getAllFrameworks,
   createFramework,
   updateFramework,
   deleteFramework,
} = require("../controllers/frameworkController");

const router = express.Router();

router.get("/", getAllFrameworks);
router.post("/", validateToken, createFramework);
router
   .route("/:id")
   .put(validateToken, updateFramework)
   .delete(validateToken, deleteFramework);

module.exports = router;
