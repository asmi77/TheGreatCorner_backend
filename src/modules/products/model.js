import mongoose from "mongoose";

//mongoose schemas

// let productCoords = new mongoose.Schema({
//   lat: String,
//   lng: String
// });

let productSchema = new mongoose.Schema({
  title: {
    type: String
    // required: true
  },
  content: {
    type: String
    // required: true
  },
  price: {
    type: String
    // required: true
  },
  location: {
    type: String
    // required: true
  },
  // productCoords: [productCoords],
  image: {
    type: String
    // required: true
  },
  senderId: {
    type: String
    // required: true
  },
  createdDate: {
    type: Date
  }, 
  lat: {
    type: Number
  },
  lng: {
    type: Number
  }
});

//mongoose model
let Product = mongoose.model("Product", productSchema);

export default Product;
