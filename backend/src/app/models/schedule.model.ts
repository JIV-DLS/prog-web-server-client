import mongoose, {Schema} from "mongoose";


const schedule = new mongoose.Schema({
        station: Schema.Types.ObjectId,
        week: {type: Number},
        year: {type: Number},
        monday:{
            open: {type: Boolean},
            start: {type: String},
            end:{type: String}
        },
        tuesday:{
            open: {type: Boolean},
            start: {type: String},
            end:{type: String}
        },
        wednesday:{
            open: {type: Boolean},
            start: {type: String},
            end:{type: String}
        },
        thursday:{
            open: {type: Boolean},
            start: {type: String},
            end:{type: String}
        },
        friday:{
            open: {type: Boolean},
            start: {type: String},
            end:{type: String}
        },
        Saturday:{
            open: {type: Boolean},
            start: {type: String},
            end:{type: String}
        },
        Sunday:{
            open: {type: Boolean},
            start: {type: String},
            end:{type: String}
        }
    },
    {
      timestamps: true,
    });

export const Schedule = mongoose.model("Schedule", schedule);
