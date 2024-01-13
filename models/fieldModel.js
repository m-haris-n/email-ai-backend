const mongoose = require("mongoose");

const fieldSchema = mongoose.Schema(
   {
      fieldName: {
         type: String,
         required: [true, "Please add the contact name"],
      },
      fieldValue: {
         type: String,
         required: [true, "Please add the contact name"],
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);
