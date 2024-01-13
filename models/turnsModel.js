const mongoose = require("mongoose");

const turnSchema = mongoose.Schema(
   {
      turns: {
         type: Number,
         required: [true, "Please add the contact name"],
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Turns", turnSchema);
