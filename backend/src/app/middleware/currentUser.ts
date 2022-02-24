
import {logger} from "../utils/logger"
import jwt from "jsonwebtoken";

// @ts-ignore
export const currentUser = (req, res, next) => {
    try {
        if ((req.userDoingRequest._id + "").localeCompare( req.params._id + "")) {
            throw new Error("Invalid user ID");
        } else {
            // tslint:disable-next-line:no-console
            //logger.info("here2");
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error("Invalid request, You are registared as employee!"),
        });
    }
};
