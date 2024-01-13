const asyncHanlder = require("express-async-handler");
const Turns = require("../models/turnsModel");
const { model } = require("mongoose");

//@desc Get all fields
//@route GET /api/fields
//@access public

const getLatestTurn = asyncHanlder(async (req, res) => {
   const turn = await Turns.find().sort({ createdAt: -1 }).limit(1);
   console.log("working");
   res.status(200).json(turn[0]);
});

//@desc Create field
//@route POST /api/fields
//@access private

const createTurn = asyncHanlder(async (req, res) => {
   const { turns } = req.body;
   if (!turns) {
      res.status(400);
      throw new Error("ALL fields are needed");
   }

   const newTurn = await Turns.create({
      turns,
   });

   res.status(200).json({ msg: "Turn Created", newTurn });
});

module.exports = { getLatestTurn, createTurn };
