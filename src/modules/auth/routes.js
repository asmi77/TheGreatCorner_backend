import express from "express";
let routerAuth = express.Router();
import jwt from "jsonwebtoken";
import User from "../users/model.js";
import signale from "signale";
import terminal from "../../terminal.js";
import nodemailer from "nodemailer"; 

//Sign up
routerAuth.post("/create-user", (req, res) => {
  let body = req.body;
  console.log("req.body: ", body);
  // terminal.authTerminal.note("Body: ", body);
  if (body) {
    console.log("we are here");
    if (body.userInfo.password === body.userInfo.cpassword) {
      User.findOne({ email: body.userInfo.email }, function(err, doc) {
        if (doc == null) {
          let newUser = new User();
          newUser.firstName = req.body.userInfo.firstName;
          newUser.lastName = req.body.userInfo.lastName;
          newUser.email = req.body.userInfo.email;
          newUser.password = req.body.userInfo.password;
          newUser.cpassword = req.body.userInfo.cpassword;
          newUser.userAddress = req.body.userInfo.userAddress;
          newUser.userCoords = req.body.userCoords;

          terminal.authTerminal.await("Before saving the new user: ", newUser);
          newUser.save(function(err) {
            if (err) {
              return err;
            } else {
              terminal.authTerminal.success("A new user has been created");
              return res
                .status(200)
                .send({ success: true, message: "New user has been created" });
            }
          });
        } else {
          terminal.authTerminal.warn("This user has already been created");
          return res.status(400).send({
            success: false,
            message: "This user has already been created"
          });
        }
      });
    } else {
      terminal.authTerminal.error("passwords do not match");
      return res
        .status(400)
        .send({ success: false, message: "Your passwords don't match" });
    }
  } else {
    terminal.authTerminal.warn("All the fields are required");
    return res
      .status(412)
      .send({ success: false, message: "All the fields are required" });
  }
});

//Login
routerAuth.post("/login", (req, res) => {
  let body = req.body;
  console.log("req.body: ", body);
  if (body.email && body.password) {
    User.findOne(
      {
        // find user by email
        email: body.email
      },
      (err, result) => {
        if (err) {
          terminal.authTerminal.warn("User not found :", err);
          return res
            .status(400)
            .json({ success: false, message: "No user found" });
        } else {
          //retrieve user id from result to be included in the token and retrieved in the front
          let userID = result._id;
          let userFirstName = result.firstName;
          let userLastName = result.lastName;
          let email = result.email;
          let lat = result.userCoords[0].lat;
          let lng = result.userCoords[0].lng;
          console.log("login lat: ", lat);
          console.log("login lng: ", lng);
          terminal.authTerminal.note("User ID found:", result._id);
          if (body.password == result.password) {
            terminal.authTerminal.success("DB found user: ", result);
            //Generates the token
            let token = jwt.sign(
              {
                // add here all relevant user identification elements
                userID,
                userFirstName,
                userLastName,
                email,
                lat,
                lng
              },
              "mysecret"
            );
            terminal.authTerminal.success("Generated token:", token);
            res.status(200).send({
              status: true,
              message: "Token delivered",
              // token: token
              token: token
            });
            // signale.pending({prefix: '[authConsole]', message: 'User logged in', suffix: '(marrant)'});
            terminal.authTerminal.success("You have been logged in");
          } else {
            terminal.authTerminal.error("Password invalid");
            res
              .status(401)
              .send({ sucess: false, message: "The password is invalid" });
          }
        }
      }
    );
  } else {
    terminal.authTerminal.warn("All the fields are required");
    res
      .status(401)
      .send({ sucess: false, message: "All the fields are required" });
  }
});

export default routerAuth;
