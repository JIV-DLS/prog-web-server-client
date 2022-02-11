import mongoose, {Schema} from "mongoose";


const station = new Schema({
    name: {type: String},
    coordinates: Schema.Types.Mixed,
    automate_24_24: { type: Boolean },
    services: [Schema.Types.ObjectId],
    gases:[{
        _id: { type: Schema.Types.ObjectId },
        price: { type: Number },
        available: { type: Boolean },
        unavailabilityDate: {type: Date}
    }],
    addresses: {
        address: { type: String, trim: true },
        town: { type: String, trim: true }
    },
    closed:{
        state:{ type: Boolean },
        type:{ type: String },
        start:{ type: Date },
        end:{ type: Date },
    }
},
    {
      timestamps: true,
    });

export const Station = mongoose.model("Station", station);
