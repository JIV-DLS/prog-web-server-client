import { Router } from "express";
import { Document } from "mongoose";
import {Station} from "../../models/station.model";
import {logger, loggerToFile} from "../../utils/logger";
import {auth} from "../../middleware/auth";
import {currentUser} from "../../middleware/currentUser";

const router = Router();
var xMargin = 50000
var yMargin = 50000

router.get("/", async (req, res) => {
    try {
        return await Station.find();
    } catch (error) {
        logger.error(error);
        res.status(500).json({details: error});
    }
})

router.get("/latitude=:latitude&longitude=:longitude", async (req, res) => {
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
            i = i + 1
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

})
router.get("/:id", async (req, res) => {
    try {
        let pdv = await Station.findOne({"id": req.params.id});
        if(pdv==null) {
            const err = `Station ${req.params.id} not found`;
            logger.error(err);
            res.status(404).json({details: err});
        }else{
            while("pdv_content" in pdv){
                pdv = pdv["pdv_content"]
            }
            res.status(200).json(pdv);
        }


    } catch (error) {
        logger.error(error);
        try{
            res.status(500).json({details: error});
        }catch (error) {

        }
    }
})

router.put("/:id", auth, currentUser,async (req, res) => {
    try {

        let pdv = await Station.findOne({"id": req.params.id});
        if(pdv==null) {
            const err = `Station ${req.params.id} not found`;
            logger.error(err);
            res.status(404).json({details: err});
        }else{
            //await Station.deleteMany({"id": req.params.id});

            const price = req.body;
            price["maj"] = new Date();

            while("pdv_content" in pdv){
                pdv = pdv["pdv_content"]
            }

            pdv["prix"].push(price);

            const response = await Station.updateOne({"id": req.params.id},{"id":req.params.id,"pdv_content":pdv});

            console.log("Station " + response["id"] + " created at " + response.createdAt + " updated at " + response.updatedAt);
            res.status(200).json(response);
        }



/*
            Station.findOne({"id": req.params.id}, function(err, pdv) {
                if(!err) {
                    if(!pdv) {
                        const err = `Station ${req.params.id} not found`;
                        logger.error(err);
                        res.status(404).json({details: err});
                    }
                    const price = req.body;
                    price["maj"] = new Date();

                    while("pdv_content" in pdv){
                        pdv = pdv["pdv_content"]
                    }
                    console.log("pdv=>",pdv)
                    pdv["prix"].push(price);

                    Station.deleteMany({"id": req.params.id},{},async () => {

                        console.log("result after deletion",await Station.findOne({"id": req.params.id}))

                        const newPdv = new Station();
                        newPdv["id"] = req.params.id;

                        // @ts-ignore
                        newPdv["pdv_content"] = pdv;
                        res.status(200).json(pdv);

                        // @ts-ignore
                        newPdv.save(function (err) {
                            if (!err) {

                                console.log("Station " + pdv["id"] + " created at " + pdv.createdAt + " updated at " + pdv.updatedAt);
                                res.status(200).json(pdv);
                            } else {
                                const _err = "Error: could not save station " + pdv["id"];
                                loggerToFile.log(_err);
                                res.status(500).json({details: _err});
                            }
                        });
                    });

                }
            })
*/
    } catch (error) {
        logger.error(error);
        try{
            res.status(500).json({details: error});
        }catch (error) {

        }
    }
})
export const StationRouter = router;
