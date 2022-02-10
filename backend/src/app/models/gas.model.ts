import mongoose from "mongoose";


const gas = new mongoose.Schema({
  cover: {type: String},
  description: {type: String},
  name: {type: String},
  price: {type: Number},
  maj: {type: Date},

},
    {
      timestamps: true,
    });

export const Gas = mongoose.model("Gas", gas);
