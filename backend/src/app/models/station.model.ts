import mongoose, {Schema} from "mongoose";


const station = new Schema({
        "id":String,
        "pdv_content":{}
},
    {
      timestamps: true,
    });
export const Station = mongoose.model("Station", station);
