import mongoose from "mongoose";

//mongoose schema
let messageSchema = new mongoose.Schema({
  title: {
    type: String
    // required: true
  },
  content: {
    type: String
    // required: true
  },
  senderId: {
    type: String
    // required: true
  },
  receiverId: {
    type: String
    // required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  readDateValue: {
    type: Date
  }
});

//mongoose model
let Message = mongoose.model("Message", messageSchema);

export default Message;
