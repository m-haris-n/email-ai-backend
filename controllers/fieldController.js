const asyncHanlder = require("express-async-handler");
const fs = require("node:fs");

const Field = require("../models/fieldModel");
const Form = require("../models/formModel");

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
      throw new Error("All fields are needed");
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
//@desc Create field
//@route POST /api/fields
//@access private

const createFieldsByCsv = asyncHanlder(async (req, res) => {
   const { formId } = req.body;

   if (!formId) {
      res.status(400);
      throw new Error("All fields are required");
   }

   const formExists = await Form.exists({ _id: formId });
   if (!formExists) {
      res.status(404);
      throw new Error("Form not found.");
   }
   console.log("uploading file to ", formId);

   const reqFile = req.file;
   console.log(reqFile.destination);
   console.log(reqFile.path);
   let filedata = "";
   try {
      const file = fs.readFileSync(reqFile.path);
      filedata = file.toString();
      console.log(filedata);
      fs.unlinkSync(reqFile.path);
      let lines = filedata.split("\n");
      lines.shift();
      lines.pop();
      console.log(lines);
      const fields = [];
      for (let line of lines) {
         let strippedLine = line.replace("\r", "");
         strippedLine = strippedLine.split(",");
         console.log(strippedLine);
         let field = {
            fieldName: strippedLine[0],
            fieldValue: strippedLine[0].replace(/\s/g, "").toLowerCase(),
            isRequired: strippedLine[1].toUpperCase() === "TRUE",
            formId: formId,
         };
         fields.push(field);
         // console.log(field);
      }
      console.log(fields);

      const createdFields = await Field.create(fields);
      res.status(200).json({ msg: "Field Created", fields: createdFields });
   } catch (error) {
      console.log(error);
   }

   // console.log(file.read());
   // console.log("success");
   // if (!formId) {
   //    res.status(400);
   //    throw new Error("ALL fields are needed");
   // }
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
   createFieldsByCsv,
   updateField,
   deleteField,
   getAllFieldsByFormId,
};
