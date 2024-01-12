const asyncHanlder = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get a contact
//@route GET /api/contacts/:id
//@access public

const getContact = asyncHanlder(async (req, res) => {
   res.status(200).json({ msg: "Hiya" });
});

//@desc Get all contacts
//@route GET /api/contacts
//@access public

const getAllContacts = asyncHanlder(async (req, res) => {
   const contacts = await Contact.find();
   res.status(200).json({ msg: "Hiya", contacts: contacts });
});

//@desc Create contact
//@route POST /api/contacts
//@access public

const createContact = asyncHanlder(async (req, res) => {
   const { name, email, phone } = req.body;
   if (!name || !email || !phone) {
      res.status(400);
      throw new Error("ALL fields are needed");
   }

   const contact = await Contact.create({
      name: name,
      emailid: email,
      phone: phone,
   });

   res.status(200).json({ msg: "Hiya", contact: contact });
});

//@desc Edit contact by id
//@route PUT /api/contacts/:id
//@access public

const editContact = asyncHanlder(async (req, res) => {
   res.status(200).json({ msg: "Hiya" });
});

//@desc Delete contact by id
//@route DELETE /api/contacts/:id
//@access public

const deleteContact = asyncHanlder(async (req, res) => {
   res.status(200).json({ msg: "Hiya" });
});

module.exports = {
   getContact,
   getAllContacts,
   createContact,
   editContact,
   deleteContact,
};
