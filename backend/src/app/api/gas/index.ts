import { Router } from "express";
import {Gas} from "../../models/gas.model";
import {logger} from "../../utils/logger";

const router = Router();

router.get("/", async (req, res) => {

    try {
        const names = await Gas.distinct('name');
        res.status(200).json(names);
    } catch (error) {
        logger.error(error);
        res.status(500).json({details: error});
    }
} )

export const GasRouter = router;
