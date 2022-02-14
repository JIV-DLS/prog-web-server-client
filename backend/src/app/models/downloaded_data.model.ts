import mongoose from "mongoose";


const dataDowloaded = new mongoose.Schema({
  year: {type: String},
  time_slot_start: {type: Date},
  time_slot_end: {type: Date},

},
    {
      timestamps: true,
    });

function add_download_year(dataD,year){
    if (dataD != null){

        if("year" in dataD){
            dataD["year"] = year
        }

        if("time_slot_start" in dataD){
            dataD["time_slot_start"] = new Date(year, 1, 7, 0, 0, 0, 0)
        }

        if("time_slot_end" in dataD){
            dataD["time_slot_end"] = new Date(year, 12, 31, 0, 0, 0, 0)
        }

        return dataD;

    }
}

function add_download_Day(dataD,day:Date){
    if (dataD != null){

        if("year" in dataD && day.getFullYear() == dataD["year"]){

            if("time_slot_end" in dataD){
                dataD["time_slot_end"] = new Date(day.getFullYear(), day.getMonth(), day.getDay(), 0, 0, 0, 0)
            }
        }

        return dataD;

    }
}

export const DataDowloaded = mongoose.model("DataDowloaded", dataDowloaded);
