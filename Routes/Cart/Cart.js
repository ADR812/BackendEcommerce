const express = require("express");
const { VerifyJWT, verifyTokenAuth, verifyTokenAdmin } = require("../../MiddleWare/VerifyJWT");
const Cart = require("../../Models/Cart/Cart.js");



const Router = express.Router();

// CREATE CART METHOD 

Router.post("/create", verifyTokenAuth, async (req, res) => {
  try {
    const newcart = new Cart(req.body);
    const savedcart = await newcart.save();
    res.status(200).json(savedcart);
  } catch (err) {
    res.status(500).json(err);
  }
})

//  UPDATE METHOD


Router.put("/:id", verifyTokenAuth, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true })
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(500).json(err);
  }
})


//    DELETE METHOD

Router.delete("/del/:id", verifyTokenAuth, async (req, res) => {
  try {
    await Cart.findOneAndDelete(req.params.id);
    res.status(200).json("cart has been deleted ... ");
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET USER CART METHOD  

Router.get("/find/:userId", verifyTokenAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET carts

Router.get("/", verifyTokenAdmin, async (req, res) => {
  const querynew = req.query.new;
  const querycat = req.query.category;
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  }
  catch (err) {
    res.status(500).json(err);
  }
})





module.exports = Router;