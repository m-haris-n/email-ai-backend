const asyncHanlder = require("express-async-handler");
const Field = require("../models/fieldModel");

//@desc Get all fields
//@route GET /api/fields
//@access public

const getAllFields = asyncHanlder(async (req, res) => {
   const fields = await Field.find().sort("-isRequired");
   console.log("working");
   res.status(200).json({ fields });
});

const getAllFieldsByFormId = asyncHanlder(async (req, res) => {
   const fields = await Field.find({ formId: req.params.id }).sort(
      "-isRequired"
   );
   console.log("working");
   res.status(200).json({ fields });
});

//@desc Create field
//@route POST /api/fields
//@access private

const createField = asyncHanlder(async (req, res) => {
   const { fieldName, isRequired, formId } = req.body;
   console.log(req.body);
   if (!fieldName || isRequired == null || !formId) {
      res.status(400);
      throw new Error("ALL fields are needed");
   }

   const fieldValue = fieldName.replace(/\s/g, "").toLowerCase();
   const field = await Field.create({
      fieldName: fieldName,
      fieldValue: fieldValue,
      isRequired: isRequired,
      formId: formId,
   });

   res.status(200).json({ msg: "Field Created", field });
});

//@desc Update field
//@route POST /api/fields
//@access private

const updateField = asyncHanlder(async (req, res) => {
   const field = await Field.findById(req.params.id);
   if (!field) {
      res.status(404);
      throw new Error("Field not found");
   }

   const { fieldName, isRequired } = req.body;
   const fieldValue = fieldName.replace(/\s/g, "").toLowerCase();

   const updatedField = await Field.findByIdAndUpdate(
      req.params.id,
      { fieldName, fieldValue, isRequired },
      {
         new: true,
      }
   );
   res.status(200).json(updatedField);
});

//@desc Update field
//@route POST /api/fields
//@access private

const deleteField = asyncHanlder(async (req, res) => {
   const field = await Field.findById(req.params.id);
   if (!field) {
      res.status(404);
      throw new Error("Field not found");
   }

   const deletedfield = await Field.findByIdAndDelete(req.params.id);
   res.status(200).json(deletedfield);
});

module.exports = {
   getAllFields,
   createField,
   updateField,
   deleteField,
   getAllFieldsByFormId,
};
