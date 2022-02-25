import jwt from "jsonwebtoken";
import { Password } from "../models";
import {User} from "../models/user.model";

// @ts-ignore
export const auth = (req, res, next) => {
    try {
        const splitted = req.headers.authorization.split(" ");
        const token = splitted[1];
        const decodedToken = jwt.verify(token, Password);

        // @ts-ignore
        const userId = decodedToken.userId;
        req.body.userId = splitted[2];
        User.findOne({ _id: splitted[2] })
            // @ts-ignore
            .then((user) => {

                if (!user) {
                    res.status(401).json({ error: "Utilisateur non trouvé !" });
                }
                req.userDoingRequest = user;
                if (req.body.userId && req.body.userId !== userId) {
                    throw new Error("Invalid user ID");
                } else {
                    next();
                }
            })

            // @ts-ignore
            .catch((error) => res.status(500).json({ error }));

    } catch {
        res.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};
