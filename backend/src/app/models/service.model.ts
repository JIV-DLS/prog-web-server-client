import mongoose from "mongoose";


const service = new mongoose.Schema({
  label: {type: String},
},
    {
      timestamps: true,
    });

export const Service = mongoose.model("Service", service);
