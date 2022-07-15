const express = require("express");
const { VerifyJWT, verifyTokenAuth, verifyTokenAdmin } = require("../../MiddleWare/VerifyJWT");
const User = require("../../Models/User/User");
const Router = express.Router();



//  UPDATE METHOD


Router.put("/:id", verifyTokenAuth, async (req, res) => {
  if (req.body.password) req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECOND).toString();
  try {
    const updateuser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true })
    res.status(200).json(updateuser);
  } catch (err) {
    res.status(500).json(err);
  }
})


//    DELETE METHOD

Router.delete("/del/:id", verifyTokenAuth, async (req, res) => {
  try {
    await User.findOneAndDelete(req.params.id);
    res.status(200).json("user has been deleted ... ");
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET USER METHOD  

Router.get("/find/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET ALL USER METHOD  

Router.get("/findall", verifyTokenAdmin, async (req, res) => {
  try {
    const query = req.query.new;
    const user = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
    res.status(200).json(user);
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET USER STATS

Router.get("/stats", verifyTokenAdmin, async (req, res) => {
  try {
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastyear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ])
    res.status(200).json(data);
  }
  catch (err) {
    res.status(500).json(err);
  }
})




module.exports = Router;