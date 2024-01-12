const express = require("express");
const {
   getContact,
   getAllContacts,
   createContact,
   editContact,
   deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

router.route("/").get(getAllContacts).post(createContact);
router.route("/:id").get(getContact).put(editContact).delete(deleteContact);

module.exports = router;
