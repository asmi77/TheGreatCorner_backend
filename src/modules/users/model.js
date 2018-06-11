import mongoose from "mongoose";

//mongoose schema
let userAddress = new mongoose.Schema({
  street: String, 
  city: String,
  country: String
});

let userCoords = new mongoose.Schema({
  lat: String,
  lng: String
});

let userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  userAddress: [userAddress],
  // userAddress: {
  //   street: String,
  //   postCode: Number,
  //   country: String
  // },
  userCoords: [userCoords],
  password: {
    type: String,
    required: true
  },
  cpassword: {
    type: String,
    required: true
  },
  googleMapsPlaceID: {
    type: String
  },
  token: {
    type: String
  }
});

//mongoose model
let User = mongoose.model("User", userSchema);

export default User;
