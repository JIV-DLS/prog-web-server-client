import jwt from "jsonwebtoken";
import { Password } from "../models";
import {User} from "../models/user.model";
export const authMaster = (req, res, next) => {

        if (req.userDoingRequest.master) {
            next();
        }
        else {
        res.status(402).json({
            error: new Error("Not Authorized!"),
        });
        }
    };
