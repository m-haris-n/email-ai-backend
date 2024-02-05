const asyncHanlder = require("express-async-handler");
const Form = require("../models/formModel");
const Field = require("../models/fieldModel");

//@desc Get all forms
//@route GET /api/forms
//@access public

const getAllForms = asyncHanlder(async (req, res) => {
   console.log("getting all forms");
   const forms = await Form.find();
   res.status(200).json({ forms });
});

const getAllFormsByUser = asyncHanlder(async (req, res) => {
   console.log("getting all forms by user");
   const forms = await Form.find({ userId: req.user.id });
   res.status(200).json({ forms });
});

//@desc Get all forms
//@route GET /api/forms
//@access public

const getFormById = asyncHanlder(async (req, res) => {
   const form = await Form.findOne({ _id: req.params.id });

   if (!form) {
      res.status(404);
      throw new Error("No form found");
   }

   console.log("working");
   const fields = await Field.find({ formId: form._id }).sort("-isRequired");
   res.status(200).json({ form: form, fields: fields });
});

//@desc Create field
//@route POST /api/fields
//@access private

const createForm = asyncHanlder(async (req, res) => {
   const { formName, prePrompt1, postPrompt1, prePrompt2, postPrompt2 } =
      req.body;
   console.log(req.body);
   if (
      !formName ||
      !prePrompt1 ||
      !prePrompt2 ||
      !postPrompt1 ||
      !postPrompt2
   ) {
      res.status(400);
      throw new Error("All fields are needed");
   }

   const form = await Form.create({
      userId: req.user.id,
      formName,
      prePrompt1,
      postPrompt1,
      prePrompt2,
      postPrompt2,
   });

   res.status(200).json({ msg: "Form Created", form: form });
});

//@desc Update field
//@route POST /api/fields
//@access private

const updateForm = asyncHanlder(async (req, res) => {
   const form = await Form.findById(req.params.id);
   if (!form) {
      res.status(404);
      throw new Error("Form not found");
   }

   if (form.userId != req.user.id) {
      res.status(401);
      throw new Error("You are not authorized to access this form");
   }

   const { formName, prePrompt1, postPrompt1, prePrompt2, postPrompt2 } =
      req.body;

   const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { formName, prePrompt1, postPrompt1, prePrompt2, postPrompt2 },
      {
         new: true,
      }
   );
   res.status(200).json(updatedForm);
});

//@desc Update field
//@route POST /api/fields
//@access private

const deleteForm = asyncHanlder(async (req, res) => {
   const form = await Form.findById(req.params.id);
   if (!form) {
      res.status(404);
      throw new Error("Form not found");
   }
   if (form.userId != req.user.id) {
      res.status(401);
      throw new Error("You are not authorized to access this form");
   }
   const deletedForm = await Form.findByIdAndDelete(req.params.id);
   const relevantFields = await Field.deleteMany({ formId: req.params.id });
   res.status(200).json(deletedForm);
});

module.exports = {
   getAllForms,
   getFormById,
   getAllFormsByUser,
   createForm,
   updateForm,
   deleteForm,
};
