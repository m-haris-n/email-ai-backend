const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
   createForm,
   getAllForms,
   updateForm,
   deleteForm,
   getFormById,
   getAllFormsByUser,
   testFormByCsv,
} = require("../controllers/formController");
const { upload_csv } = require("../multerInstance");

const router = express.Router();

router.route("/").get(getAllForms).post(validateToken, createForm);
router.route("/me").get(validateToken, getAllFormsByUser);
router
   .route("/:id")
   .get(getFormById)
   .patch(validateToken, updateForm)
   .delete(validateToken, deleteForm);

router.post(
   "/:id/test",
   validateToken,
   upload_csv.single("file"),
   testFormByCsv
);

module.exports = router;
