import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  pseudo: {type: String},
  // tslint:disable-next-line:object-literal-sort-keys
  email: {type: String, required: true, unique: true},
  lastName: {type: String, required: true},
  firstName: {type: String, required: true},
  password: {type: String, required: true},
  // email: {type: String},
  image: {type: String},
  sex: {type: String},
  bornDate: {type: String},
  master: {type: Boolean, default: false},
  phoneNumber: {type: Number},
},
    {
      timestamps: true,
    });

export const User = mongoose.model("User", userSchema);
