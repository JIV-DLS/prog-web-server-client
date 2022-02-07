import { Router } from "express";
import {Gas} from "../../models/gas.model";

const router = Router();

router.get("/", (req,res)=> {

     Gas.find().then((crepes)=> {
     //   let requestResponse= []
      //  crepes.forEach(function (value) {
      //     requestResponse.push(value)
      //  });
        res.status(200).json(crepes);
    }).catch((error) => res.status(400).json({ error }));
} )

export const GasRouter = router;
