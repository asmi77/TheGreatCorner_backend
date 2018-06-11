import express from "express";
let routerMessages = express.Router();
import mongoose from "mongoose";
import User from "../users/model.js";
import Message from "./model.js";
import * as helpers from "../../helpers/helpers.js";
import signale from "signale";
import terminal from "../../terminal.js";
// const userId = mongoose.Types.ObjectId;

//create a message
routerMessages.post("/send-message", helpers.checkToken, (req, res) => {
  let body = req.body;
  console.log("Body content: ", body);
  // console.log('res de la route: ', res)
  User.findOne({ email: req.body.receiverId }, (err, userDb) => {
    console.log("found user :", userDb);
    if (userDb === null) {
      res
        .status(401)
        .json({ success: false, message: "This user does not exist" });
    } else {
      let createMessage = new Message(req.body);
      createMessage.title = req.body.title;
      createMessage.content = req.body.content;
      createMessage.readDateValue = new Date();
      console.log("new message is : ", createMessage);
      // createMessage will sent boolean values in addition to the createMessage object
      console.log("message id: ", createMessage.id);
      //an id for each message will be created to
      createMessage.save((err, myNewMessage) => {
        console.log("New message: ", myNewMessage);
        console.log("message created");
        if (err) {
          console.log("erreur du save : ", err);
          // res.status(500).json({ success: false }, 'Your message has not been posted');
        } else {
          console.log("message posted ok");
          console.log("New message du save else: ", myNewMessage);
          // res.json.stringify(res)
          // return res;
          res
            .status(200)
            .json({ success: true, message: "Your message has been posted" });
        }
      });
    }
  });
});

//GET list of all messages
routerMessages.get("/allmessages", (req, res) => {
  console.log();
  Message.find({}, function(err, messages) {
    //This syntax is ok with a return
    if (err) return res.status(404).send("No users found.");
    res.status(200).send(messages);
  });
});

//get list of messages of current user
routerMessages.get("/messages-list", [helpers.checkToken], (req, res) => {
  //what is retrieved form postman headers
  let user = res.locals.user;
  console.log("Connected user: ", user.email);
  Message.find({ receiverId: user.email }, (err, userMessages) => {
    console.log("Here are the users messages: ", userMessages);
    if (userMessages == null) {
      console.log("You have no messages");
      res
        .status(400)
        .json({ sucess: false, message: "You have no messages in your inbox" });
    } else {
      console.log("here are user messages", userMessages);
      res
        .status(200)
        .json({
          sucess: true,
          message: "Here are the your messages",
          userMessages: userMessages
        });
    }
  });
});

//   Display message of curent user with true read value
routerMessages.get("/show-message/:id", [helpers.checkToken], (req, res) => {
  let user = res.locals.user;
  let message = req.params.id;
  console.log("found user: ", user, "ID message: ", message);
  Message.findOne({ _id: message }, (err, messageID) => {
    console.log("This message has been found :", messageID);
    if (!messageID) {
      res
        .status(404)
        .json({ success: false, message: "No message has been found" });
    } else {
      console.log("Message to change read value", messageID);
      Message.update(
        { _id: messageID._id },
        { $set: { read: true, readDateValue: new Date() } },
        (err, readTrue) => {
          console.log("update message in process");
          if (err) {
            console.log("there is a problem");
          } else {
            console.log("read true: ", readTrue);
            console.log("here are user message details", messageID);
            res
              .status(200)
              .json({
                sucess: true,
                message: "Your message just has been read",
                messageID: messageID
              });
          }
        }
      );
    }
  });
});

// //UPDATE a message / read False
routerMessages.put(
  "/update-message-details/:id",
  [helpers.checkToken],
  (req, res) => {
    let messageId = req.params.id;
    console.log("messageId: ", messageId);
    let username = res.locals.user;
    console.log("User e-mail: ", username);
    // User.findOne({ 'username': username, 'token': req.headers.token }, (err, userID) => {
    // console.log("id of user found", userID)
    Message.find({ _id: messageId }, (err, messageDetails) => {
      console.log("user found message: ", messageDetails);
      if (err) {
        console.log("Don't find user message details");
        res
          .status(400)
          .json({ sucess: false, message: "This message has no details" });
      } else {
        // console.log("Read value: ", messageDetails[0].read);
        // console.log("Date value: ", messageDetails[0].readDateValue);
        console.log("Here are user message details for update", messageDetails);
        let readMessage = messageDetails[0].read;
        console.log("read value: ", readMessage);
        if ((readMessage = false)) {
          console.log("Cannot update message");
          res
            .status(400)
            .json({ success: false, message: "Message couldn't be updated" });
        } else {
          console.log("let's update this message to false");
          Message.update(
            { _id: req.params.id },
            { $set: { read: false } },
            (err, readFalse) => {
              if (err) {
                console.log("there is a problem");
              } else {
                console.log("read false: ", readFalse);
                console.log("here are user message details", messageDetails);
                res
                  .status(200)
                  .json({
                    sucess: true,
                    message: "Your message just has been read",
                    messageDetails: messageDetails
                  });
              }
            }
          );
        }
      }
    });
    // })
  }
);
// });
export default routerMessages;
