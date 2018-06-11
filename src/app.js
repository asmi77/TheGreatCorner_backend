import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import routerAuth from "./modules/auth/routes.js";
import routerMessages from "./modules/messages/routes.js";
import routerProducts from "./modules/products/routes.js";
import routerUsers from "./modules/users/routes.js";
import routerProfile from "./modules/profile/routes.js";
import fs from "fs";
import signale from "signale";
import dotEnv from 'dotenv'

dotEnv.config()

// import checkToken from './helpers/helpers.js';
// import dotEnv from 'dotenv';
// dotEnv.config();

let app = express();

console.log('dirname', __dirname); 
// dirname /home/asma/Documents/projects/leBonCoin/leboncoin/back/src

//Serve static files from the server 
app.use(express.static(__dirname + '/uploads'));

//Body Parser implementing
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, Token"
  );
  // allow preflight
  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

//Unauthenticated routes
app.use("/auth", routerAuth);

//Authenticated routes
app.use("/messages", routerMessages);
app.use("/products", routerProducts);
app.use("/users", routerUsers);
app.use("/profile", routerProfile);

//Mongoose DB local Connection
// mongoose.connect("mongodb://localhost:27017/greatcorner", function(err) {
  mongoose.connect(process.env.dataBase ||"mongodb://heroku_slmhnsz0:f95l215cja2dq2fhulp5rtjj1g@ds119768.mlab.com:19768/heroku_slmhnsz0", function(err) {
  if (err) {
    throw err;
  } else {
    console.log("Mongoose database is connected");
    let port = process.env.PORT || 8090
    app.listen(PORT, () => {
      //use backticks to use es6 variable without concatenation
      console.log('App listens on port: ' + port)
    });
  }
});

//Homepage
app.get("/", () => {
  console.log("Hello Asma");
});

//Validate token
app.get("/token", (req, res) => {
  let storedToken = req.headers.token;
  jwt.verify(storedToken, "mysecret", function(err, decoded) {
    if (err) {
      throw err;
    } else {
      res.status(200).send(decoded);
      console.log(decoded.iat);
    }
  });
});

//Display token properties of validation
app.get("/iat", (req, res) => {
  let username = req.headers.username;
  let userIat = req.headers.iat;
  res.send({
    username: username,
    iat: userIat
  });
  console.log({
    username: username,
    iat: userIat
  });
});
