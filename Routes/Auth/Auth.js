const express = require("express");
const Router = express.Router();
const User = require("../../Models/User/User");
const CryptoJS = require("crypto-js");
const Jwt = require("jsonwebtoken");


//SIGNUP 

Router.post("/register", async (req, res) => {
  const newuser = new User({
    username: req.body.username,
    emailid: req.body.emailid,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECOND).toString(),
    isAdmin: req.body.isAdmin,
  });
  try {
    const curuser = await newuser.save();
    res.status(201).json(curuser);
  }
  catch (err) {
    res.status(500).json(err);
  }
})

//LOGIN

Router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) res.status(401).json("wrong credentials");
    else {
      const hashedpass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECOND);
      const Opassword = hashedpass.toString(CryptoJS.enc.Utf8);
      // console.log(Opassword);
      // console.log(req.body.password);
      // console.log(user);
      // console.log(user._doc);
      if (Opassword !== req.body.password) res.status(401).json("wrong password");
      else {
        const accesstoken = Jwt.sign({
          id: user._id,
          isAdmin: user.isAdmin,
        },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "3d" },
        )
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accesstoken });
      }
    }
  }

  catch (err) {
    res.status(500).json(err);
  }
})

module.exports = Router;