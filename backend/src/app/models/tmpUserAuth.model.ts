import mongoose from "mongoose";

const tmpUserAuthSchema = new mongoose.Schema({
  code: {type: String},
  phoneNumber: {type: Number},
  verified: {type: Boolean},
});

// tslint:disable-next-line:align
export const TmpUserAuth = mongoose.model("tmpUser", tmpUserAuthSchema);
