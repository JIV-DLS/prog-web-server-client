import { Router } from "express";
import {Service} from "../../models/service.model";
import {Gas} from "../../models/gas.model";
import {logger} from "../../utils/logger";

const router = Router();

router.get("/", async(req,res)=> {
    try {
        const labels = await Service.distinct('label');
        res.status(200).json(labels.filter(label => label.length>2));
    } catch (error) {
        logger.error(error);
        res.status(500).json({details: error});
    }
} )

export const ServiceRouter = router;
