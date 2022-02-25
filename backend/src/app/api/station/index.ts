import { Router } from "express";
import {Station} from "../../models/station.model";
import {logger} from "../../utils/logger";

const router = Router();
var xMargin = 50000
var yMargin = 50000

router.get("/",async(req,res)=> {
    try {
        return await Station.find();
    } catch (error) {
        logger.error(error);
        res.status(500).json({details: error});
    }
})

router.get("/latitude=:latitude&longitude=:longitude", async(req,res)=> {
        console.log('Called station request...');
        // @ts-ignore
        var x = parseFloat(req.params.latitude)
        // @ts-ignore
        var y = parseFloat(req.params.longitude)
        var leftMargin = x - xMargin
        var rightMargin = x + xMargin
        var topMargin = y + yMargin
        var bottomMargin = y - yMargin

        try {
            var stations = await Station.find();
            var stationsInZone: any[] = []
            console.log('size : ' + stations.length);
            var i = 0
            stations.forEach((element: { [x: string]: string; }) => {
                i = i+1
                // @ts-ignore
                var latitude = element['pdv_content']['latitude'];
                // @ts-ignore
                var longitude = element['pdv_content']['longitude'];
                var latitudeInt = parseInt(latitude)
                var longitudeInt = parseInt(longitude)

                if (latitudeInt > leftMargin && latitudeInt < rightMargin && longitudeInt > bottomMargin && longitudeInt < topMargin) {
                    stationsInZone.push(element);
                    console.log("added : " + element['_id'] + ", with latitude :" + latitudeInt + " and longitude : " + longitudeInt);
                }
            });
            console.log(stationsInZone.length)
            console.log('visited ' + i + " stations")
            res.status(200).json(stationsInZone);
        } catch (error) {
                logger.error(error);
                res.status(500).json({details: error});
        }

} )

export const StationRouter = router;
