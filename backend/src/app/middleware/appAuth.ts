import jwt from "jsonwebtoken";
import { Password } from "../models";
import {User} from "../models/user.model";
export const appAuth = (req, res, next) => {
    try {
        const splitted = req.headers.authorization.split(" ");
        const token = splitted.length > 1 ? splitted[3] : splitted[0];
        if (token === "MIICXQIBAAKBgQCH2o48x1REMp+BWm27kVL8+pR0idQI9z1loCbuJ+MDIw9prirc") {
            next();
        } else { res.status(401).json({ error: "Cette clé d'application n'est pas valide!" }); }
        } catch {
        res.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};
