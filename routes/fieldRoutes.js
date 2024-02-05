const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
   deleteField,
   updateField,
   createField,
   getAllFields,
   getAllFieldsByFormId,
} = require("../controllers/fieldController");

const router = express.Router();

router.get("/:id", getAllFieldsByFormId);
router.post("/", validateToken, createField);
router
   .route("/:id")
   .put(validateToken, updateField)
   .delete(validateToken, deleteField);

module.exports = router;
