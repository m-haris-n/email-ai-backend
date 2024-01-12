const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
   {
      username: {
         type: String,
         required: [true, "Username is required"],
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: [true, "Email already in use"],
      },
      password: {
         type: String,
         required: [true, "password not given"],
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("User", userSchema);
