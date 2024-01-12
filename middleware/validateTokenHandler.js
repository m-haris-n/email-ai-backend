const asyncHanlder = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHanlder(async (req, res, next) => {
   let token;
   let authHeader = req.headers.Authorization || req.headers.authorization;
   if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
         if (err) {
            res.status(401);
            throw new Error("unauthed");
         }
         console.log(decoded);
         req.user = decoded.user;
         next();
      });
      if (!token) {
         res.status(401);
         throw new Error("unauthed or no token");
      }
   }
});

module.exports = validateToken;
