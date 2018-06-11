import express from "express";
let routerProducts = express.Router();
import mongoose from "mongoose";
import Product from "./model.js";
import User from "../users/model.js";
import * as helpers from "../../helpers/helpers.js";
import signale from "signale";
import terminal from "../../terminal.js";
import fs from "fs";
import multer from "multer";
const ObjectId = mongoose.Types.ObjectId;

// var upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

var upload = multer({ storage: storage });

// //GET list of all products
routerProducts.get("/all-products", helpers.checkToken, (req, res) => {
  Product.find({}, (err, products) => {
    terminal.productsTerminal.note("Here is the list of all produts", products);
    if (err) return res.status(404).json("No products found.");
    res.status(200).send(products);
  });
});

//GET list of the last 10 items
routerProducts.get("/last-products", helpers.checkToken, (req, res) => {
  Product.find({})
    .sort({ createdDate: -1 })
    .limit(10)
    .exec(function(err, products) {
      terminal.productsTerminal.note(
        "Here is the list of all produts",
        products
      );
      if (err) return res.status(404).json("No products found.");
      res.status(200).send(products);
    });
});

//POST / create a product
routerProducts.post(
  "/send-product",
  upload.single("image"),
  [helpers.checkToken],
  (req, res) => {
    let user = res.locals.user;
    const createdProduct = new Product({
      title: req.body.title,
      content: req.body.content,
      price: req.body.price,
      location: req.body.location,
      lat: res.locals.user.lat,
      lng: res.locals.user.lng,
      image: req.file.filename,
      senderId: user.userID,
      createdDate: new Date()
    });
    console.log("req.file: ", req.file);
    console.log("req.body: ", req.body);
    createdProduct.save((err, myNewProduct) => {
      if (err) {
        res
          .status(500)
          .json({ success: false }, "Your product has not been posted");
      } else {
        console.log("Your new product has been posted: ", myNewProduct);
        res.status(200).json({
          success: true,
          message: "Your product has been posted",
          myNewProduct: myNewProduct
        });
      }
    });
  }
);

//Get list of products of a specific user

routerProducts.get("/user-products-list", [helpers.checkToken], (req, res) => {
  //what is retrieved form postman headers
  let user = res.locals.user;
  console.log("User found in product route: ", user);
  Product.find({ senderId: user.userID }, (err, userProducts) => {
    console.log("Products: ", userProducts);
    if (err) {
      console.log("Don't find user products");
      res.status(400).json({
        sucess: false,
        message: "This user has no registered product"
      });
    } else {
      console.log("here are user products", userProducts);
      res.status(200).json({
        sucess: true,
        message: "Here are the user products",
        userProducts: userProducts
      });
    }
  });
});

//Get a specific product
routerProducts.get("/product-details/:id", helpers.checkToken, (req, res) => {
  let productId = req.params.id;
  console.log("Id du produit: ", productId);
  Product.findOne({ _id: productId }, (err, foundProduct) => {
    console.log("Produit trouvé", foundProduct);
    if (err) {
      console.log("Don't find product details");
      res
        .status(400)
        .json({ sucess: false, message: "This product has no details" });
    } else {
      console.log("here are product details", foundProduct);
      res.status(200).json({
        sucess: true,
        message: "here are product details",
        foundProduct: foundProduct
      });
    }
  });
});

routerProducts.put("/product-details", (req, res) => {
  const conditions = {_id: req.body._id};
  console.log("var conditions :", conditions);
  Product.update(conditions, req.body)
    .then(doc => {
      if (!doc) {
        return res.status(404).end();
      }
      console.log("User product updated :", doc);
      return res.status(200).json(doc);
      console.log("User product not found");
    })
    .catch(err => next());
});

//delete a product 

routerProducts.delete("/product-details/:id", helpers.checkToken, (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err, prod) => { 
    if (err) return res.status(500).send(err);
    const response = {
        message: "Product successfully deleted",
        id: prod._id
    };
    return res.status(200).send(response);
});
  });




export default routerProducts;
