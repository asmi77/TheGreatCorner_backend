import express from "express";
let routerUsers = express.Router();
import mongoose from "mongoose";
const userId = mongoose.Types.ObjectId;
import User from "./model.js";
import * as helpers from "../../helpers/helpers.js";
import signale from "signale";
import terminal from "../../terminal.js";

//GET list of all users
routerUsers.get("/list", [helpers.checkToken], function(req, res) {
  console.log("get users list");
  console.log("Connected Profile", res.locals.user);
  let connectedProfile = res.locals.user;
  User.find({}, function(err, users) {
    if (err) {
      return res.status(404).send("No user has been found found.");
    } else {
      // res.status(200).set({ 'connectedProfile' : connectedProfile});
      res
        .status(200)
        .json({ userList: users, connectedProfile: connectedProfile });
      // res.status(201).send(connectedProfile)
      console.log("Users list: ", users);
    }
  });
});

//GET one user from users list
routerUsers.get("/users/:id", helpers.checkToken, (req, res) => {
  if (userId.isValid(req.params.id)) {
    console.log("Valid Token", userId);
    User.findById(req.params.id, (err, user) => {
      console.log("Users route found with mongo :", user);
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: "This user is not registered" });
      } else {
        res.status(200).json({
          success: true,
          message: "Users route found this : ",
          content: user
        });
      }
    });
  } else {
    res.status(404).json({ success: false, message: "This id is not valid" });
  }
});

//UPDATE user details
routerUsers.put("/users/:id", (req, res) => {
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

//UPDATE geolocation coordinates
// routerUsers.put("/geolocate", [helpers.checkToken], (req, res) => {
//   User.update(
//     { _id: res.locals.user.userID }, 
//     { $set: { userGeolocation: { lat: req.body.lat, lng: req.body.lng } } },
//     (err, userGeolocated) => {
//       if (err) {
//         console.log("UserGeolocation has not been set", err);
//       } else {
//         console.log("UserGeolocation has been set", userGeolocated);
//         res
//               .status(200)
//               .json({
//                 sucess: true,
//                 message: "User coordinates saved",
//                 userGeolocated: userGeolocated, 
//               });
//       }
//     }
//   );
// });

export default routerUsers;
