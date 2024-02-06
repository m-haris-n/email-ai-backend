const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
   createForm,
   getAllForms,
   updateForm,
   deleteForm,
   getFormById,
   getAllFormsByUser,
} = require("../controllers/formController");

const router = express.Router();

router.route("/").get(getAllForms).post(validateToken, createForm);
router.route("/me").get(validateToken, getAllFormsByUser);
router
   .route("/:id")
   .get(getFormById)
   .patch(validateToken, updateForm)
   .delete(validateToken, deleteForm);

module.exports = router;
