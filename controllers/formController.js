const asyncHanlder = require("express-async-handler");
const fs = require("fs");
const openai = require("openai");
const Form = require("../models/formModel");
const Framework = require("../models/frameworkModel");
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
   console.log("trying fws");
   console.log(form.frameworks);
   console.log(form.userId);
   const frameworks = await Framework.find({ _id: { $in: form.frameworks } });
   res.status(200).json({ form: form, fields: fields, frameworks: frameworks });
   console.log("response sent");
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

   const {
      formName,
      prePrompt1,
      postPrompt1,
      prePrompt2,
      postPrompt2,
      frameworks,
   } = req.body;

   const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      {
         formName,
         prePrompt1,
         postPrompt1,
         prePrompt2,
         postPrompt2,
         frameworks,
      },
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

const gpt = new openai.OpenAI({
   apiKey: process.env.OPENAI_KEY,
});

const testFormByCsv = asyncHanlder(async (req, res) => {
   const file = req.file;
   const filepath = file.path;
   const frameworkId = req.body.frameworkId;

   const form = await Form.findOne({ _id: req.params.id });
   if (!form) {
      res.status(404);
      throw new Error("Form not found.");
   }
   const framework = await Framework.findById(frameworkId);
   if (!form) {
      res.status(404);
      throw new Error("Framework not found.");
   }

   // console.log(form);
   // console.log(framework.framework);

   const data = fs.readFileSync(file.path).toString().split("\n");

   // console.log(data);
   let fields = data[0].split(",");
   let values = data[1].split(",");

   let formdata = ``;

   for (let i = 0; i < fields.length; i++) {
      let fieldLine = `${fields[i].replace("\r", "")}: ${values[i].replace(
         "\r",
         ""
      )}\n`;
      formdata += fieldLine;
   }

   let gptReq1 = `${form.prePrompt1}
${formdata}
framework of email:
${framework.framework}
${form.postPrompt1}
`;
   let gptReq2 = `${form.prePrompt2}
${formdata}
framework of email:
${framework.framework}
${form.postPrompt2}
`;

   const [response1, response2] = await Promise.all([
      gpt.chat.completions.create({
         messages: [
            {
               role: "user",
               content: gptReq1,
            },
         ],
         model: "gpt-3.5-turbo",
      }),
      gpt.chat.completions.create({
         messages: [
            {
               role: "user",
               content: gptReq2,
            },
         ],
         model: "gpt-3.5-turbo",
      }),
   ]);

   let resp1 = response1.choices[0].message.content;
   let resp2 = response2.choices[0].message.content;

   // console.log(resp1);
   // console.log(resp2);

   let fieldString = `${data[0].replace("\r", "")},Response 1,Response 2\n`;
   let valueString = `${data[1].replace("\r", "")},"${resp1}","${resp2}"`;

   const respFileName = `${file.filename.split(".")[0]}-response.csv`;

   // console.log(respFileName);

   fs.writeFileSync(
      `${process.env.TEMP_PATH}/${respFileName}`,
      fieldString + valueString
   );

   res.download(`${process.env.TEMP_PATH}/${respFileName}`, (err) => {
      if (err) {
         res.status(500);
         throw new Error("Something went wrong");
      }
      fs.unlinkSync(file.path);
      fs.unlinkSync(`${process.env.TEMP_PATH}/${respFileName}`);
   });
});

module.exports = {
   getAllForms,
   getFormById,
   getAllFormsByUser,
   createForm,
   updateForm,
   deleteForm,
   testFormByCsv,
};
