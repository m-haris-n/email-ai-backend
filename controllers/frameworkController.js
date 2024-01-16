const asyncHanlder = require("express-async-handler");
const Framework = require("../models/frameworkModel");

//@desc Get all fields
//@route GET /api/fields
//@access public

const getAllFrameworks = asyncHanlder(async (req, res) => {
   const framworks = await Framework.find();
   console.log("working");
   res.status(200).json({ framworks });
});

//@desc Create field
//@route POST /api/fields
//@access private

const createFramework = asyncHanlder(async (req, res) => {
   const { frameworkName, framework } = req.body;
   if (!frameworkName || !framework) {
      res.status(400);
      throw new Error("ALL fields are needed");
   }

   const newFramework = await Framework.create({
      frameworkName,
      framework,
   });

   res.status(200).json({ msg: "Framework Created", newFramework });
});

//@desc Update field
//@route POST /api/fields
//@access private

const updateFramework = asyncHanlder(async (req, res) => {
   const currentFw = await Framework.findById(req.params.id);
   if (!currentFw) {
      res.status(404);
      throw new Error("Framework not found");
   }

   const updatedFramework = await Framework.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
         new: true,
      }
   );
   res.status(200).json(updatedFramework);
});

//@desc Update field
//@route POST /api/fields
//@access private

const deleteFramework = asyncHanlder(async (req, res) => {
   const currFw = await Framework.findById(req.params.id);
   if (!currFw) {
      res.status(404);
      throw new Error("Framework not found");
   }

   const deletedFw = await Framework.findByIdAndDelete(req.params.id);
   res.status(200).json(deletedFw);
});

module.exports = {
   getAllFrameworks,
   createFramework,
   updateFramework,
   deleteFramework,
};
