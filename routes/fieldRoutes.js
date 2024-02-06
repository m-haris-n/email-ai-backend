const express = require("express");

const validateToken = require("../middleware/validateTokenHandler");
const { upload_csv } = require("../multerInstance");
const {
   deleteField,
   updateField,
   createField,
   getAllFields,
   getAllFieldsByFormId,
   createFieldsByCsv,
} = require("../controllers/fieldController");

const router = express.Router();

router.get("/:id", getAllFieldsByFormId);
router.post("/", validateToken, createField);
router
   .route("/:id")
   .put(validateToken, updateField)
   .delete(validateToken, deleteField);

router.post(
   "/bulk",
   validateToken,
   upload_csv.single("file"),
   createFieldsByCsv
);

module.exports = router;
