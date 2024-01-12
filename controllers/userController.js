const asyncHanlder = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Register a user
//@route POST /api/users/register
//@access public
const createUser = asyncHanlder(async (req, res) => {
   const { username, email, password } = req.body;
   console.log("creating user");
   if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory");
   }

   const userAvailable = await User.findOne({ email });
   if (userAvailable) {
      res.status(400);
      throw new Error("Email already in use");
   }

   //has pwd
   const hashedPassword = await bcrypt.hash(password, 10);
   console.log("hashed pw:", hashedPassword);
   const user = await User.create({
      username,
      email,
      password: hashedPassword,
   });

   if (user) {
      res.status(201).json({ _id: user.id, email: user.email });
   } else {
      res.status(400);
      throw new Error("data not valid");
   }
});

//@desc login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHanlder(async (req, res) => {
   const { email, pwd } = req.body;
   if (!email || !pwd) {
      res.status(400);
      throw new Error("All fields are mandatory");
   }

   const user = await User.findOne({ email });

   // compare pwd

   if (user && (await bcrypt.compare(pwd, user.password))) {
      const accessToken = jwt.sign(
         {
            user: {
               username: user.username,
               email: user.email,
               id: user.id,
            },
         },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: "21600m" }
      );

      res.status(200).json({ accessToken });
   } else {
      res.status(401);
      throw new Error("something wrong with your creds");
   }

   res.json({ msg: "login" });
});

//@desc get current user
//@route POST /api/users/me
//@access private
const getMe = asyncHanlder(async (req, res) => {
   res.json(req.user);
});

module.exports = { createUser, loginUser, getMe };
