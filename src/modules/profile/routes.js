import express from "express";
import mongoose from "mongoose";
let routerProfile = express.Router();
const userId = mongoose.Types.ObjectId;
import User from "./../users/model";
import * as helpers from "../../helpers/helpers.js";
import signale from "signale";
import terminal from "../../terminal.js";

//GET connected profile
routerProfile.get("/", [helpers.checkToken], (req, res) => {
  let connectedProfile = res.locals.user;
  console.log("Connected profile from route: ", connectedProfile);
  if (!connectedProfile) {
    res
      .status(401)
      .json({ success: false, message: "You should first get log in :)" });
  } else {
    res
      .status(200)
      .json({
        success: true,
        message: "Here is the connected profile",
        profile: connectedProfile
      });
  }
});

routerProfile.get("/:id", helpers.checkToken, (req, res) => {
  if (userId.isValid(req.params.id)) {
    console.log("Valid Token", userId);
    User.findById(req.params.id, (err, user) => {
      console.log("User found :", user);
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: "This user is not registered" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "User found", content: user });
      }
    });
  } else {
    res.status(404).json({ success: false, message: "This id is not valid" });
  }
});

//UPDATE connected profile details
routerProfile.put("/update-profile/:id", (req, res) => {
  const conditions = { _id: req.params.id };
  console.log("var conditions :", conditions);
  User.update(conditions, req.body)
    .then(doc => {
      if (!doc) {
        return res.status(404).end();
      }
      console.log("User updated :", doc);
      return res.status(200).json(doc);
      console.log("User not found");
    })
    .catch(err => next());
});

export default routerProfile;
