const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
   getAllFIelds,
   deleteField,
   updateField,
   createField,
} = require("../controllers/fieldController");

const router = express.Router();

router.get("/", getAllFIelds);
router.post("/", validateToken, createField);
router
   .route("/:id")
   .put(validateToken, updateField)
   .delete(validateToken, deleteField);

module.exports = router;
