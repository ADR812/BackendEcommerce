const express = require("express");
const { VerifyJWT, verifyTokenAuth, verifyTokenAdmin } = require("../../MiddleWare/VerifyJWT");
const Product = require("../../Models/Product/Product.js")



const Router = express.Router();

// CREATE PRODUCT METHOD 

Router.post("/create",verifyTokenAdmin,async (req,res)=>{
  try{
    const newproduct = new Product(req.body);
    const savedproduct = await newproduct.save();
    res.status(200).json(savedproduct);
  }catch(err){
    res.status(500).json(err);
  }
})

//  UPDATE METHOD


Router.put("/:id", verifyTokenAdmin , async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true })
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
})


//    DELETE METHOD

Router.delete("/del/:id", verifyTokenAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete(req.params.id);
    res.status(200).json("Product has been deleted ... ");
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET PRODUCT METHOD  

Router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  }
  catch (err) {
    res.status(500).json(err);
  }
})


//    GET ALL Products METHOD  

Router.get("/", async (req, res) => {
  const querynew = req.query.new;
    const querycat = req.query.category;
  try {

    let products;
    if(querynew){
      products = await Product.find().sort({ createdAt: -1 }).limit(10);
    }
    else if(querycat){
      products = await Product.find({category:{
        $in:[querycat]
      }})
    }else{
      products = await Product.find();
    }


    res.status(200).json(products);
  }
  catch (err) {
    res.status(500).json(err);
  }
})





module.exports = Router;