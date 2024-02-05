const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formSchema = Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: [true, "Please refer to a valid user"],
      },
      formName: {
         type: String,
         required: false,
      },
      prePrompt1: {
         type: String,
         required: [true, "Please add prompt"],
      },
      prePrompt2: {
         type: String,
         required: [true, "Please add prompt"],
      },
      postPrompt1: {
         type: String,
         required: [true, "Please add prompt"],
      },
      postPrompt2: {
         type: String,
         required: [true, "Please add prompt"],
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
