const mongoose = require("mongoose");

const frameworkSchema = mongoose.Schema(
   {
      frameworkName: {
         type: String,
         required: [true, "Please add the contact name"],
      },
      framework: {
         type: String,
         required: [true, "Please add the contact name"],
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Framework", frameworkSchema);
