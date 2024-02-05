const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fieldSchema = Schema(
   {
      fieldName: {
         type: String,
         required: [true, "Please add the contact name"],
      },
      fieldValue: {
         type: String,
         required: [true, "Please add the contact name"],
      },
      isRequired: {
         type: Boolean,
         required: [true, "Please add the contact name"],
      },
      formId: {
         type: Schema.Types.ObjectId,
         ref: "Form",
         required: [true, "Please refer to a valid form"],
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);
