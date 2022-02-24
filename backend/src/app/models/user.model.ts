import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  pseudo: {type: String, unique: true, required: true},
  // tslint:disable-next-line:object-literal-sort-keys
  lastName: {type: String},
  firstName: {type: String, required: true},
  password: {type: String, required: true},
  // email: {type: String},
  image: {type: String},
  sex: {type: String},
  bornDate: {type: String},
  master: {type: Boolean, default: false},
  phoneNumber: {type: Number, unique: true},
},
    {
      timestamps: true,
    });

export const User = mongoose.model("User", userSchema);
