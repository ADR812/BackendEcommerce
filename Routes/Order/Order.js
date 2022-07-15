const express = require("express");
const { VerifyJWT, verifyTokenAuth, verifyTokenAdmin } = require("../../MiddleWare/VerifyJWT");
const Order = require("../../Models/Order/Order.js");



const Router = express.Router();

// CREATE Order METHOD 

Router.post("/create", verifyTokenAuth, async (req, res) => {
  try {
    const neworder = new Order(req.body);
    const savedorder = await neworder.save();
    res.status(200).json(savedorder);
  } catch (err) {
    res.status(500).json(err);
  }
})

//  UPDATE METHOD


Router.put("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true })
    res.status(200).json(updateOrder);
  } catch (err) {
    res.status(500).json(err);
  }
})


//    DELETE METHOD

Router.delete("/del/:id", verifyTokenAdmin, async (req, res) => {
  try {
    await Order.findOneAndDelete(req.params.id);
    res.status(200).json("Order has been deleted ... ");
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET USER ORDER METHOD  

Router.get("/find/:userId", verifyTokenAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET carts

Router.get("/", verifyTokenAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  }
  catch (err) {
    res.status(500).json(err);
  }
})

// get Monthly INCOME

Router.get("/income", verifyTokenAdmin, async (req, res) => {
  try {
    const productId = req.query.pid;
    const date = new Date();
    const lastmonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevmonth = new Date(new Date().setMonth(lastmonth.getMonth() - 1));

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: prevmonth },...(productId&&{
        products:{$elemMatch : {productId}}
      }) } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount"
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
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