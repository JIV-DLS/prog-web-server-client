import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import {Password} from "../../models";
import {User} from "../../models/user.model";
import {logger} from "../../utils/logger"

function userTokenResponse(user: Document<any, any, any>) {
    return {
        userId: user._id,
        // tslint:disable-next-line:object-literal-sort-keys
        token: jwt.sign(
            {userId: user._id},
            Password,
        ),
    };
}

export const emailValidity = (req: { params: { email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: boolean): any; new(): any; }; }; }) => {
    User.findOne({email: req.params.email}).then((_: null) => res.status(200).json(_ == null )).
        // @ts-ignore
    catch((error: any) => res.status(200).json({"error": error}));
};

export const signup = (req: { body: { email: string;password: string; pseudo: string | null; firstName: string | null; }; params: { _id: null; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { userId?: any; token?: any; error?: any; message?: string; }): void; new(): any; }; }; }) => {
    if (req.body.password != null
    && req.body.email != null) {

            bcrypt.hash(req.body.password, 10)
                .then((hash: any) => {
                    if (!req.body.firstName || !req.body.email)return
                    const user = new User({
                        password: hash,
                        email: req.body.email.trim(),
                    });
                    user.save()
                        .then(() => res.status(201).json(userTokenResponse(user)))
                        .catch((error) => {
                            logger.error(error);
                            res.status(400).json({ error });
                        });
                })
                .catch((error: any) => {
                    res.status(500).json({ error });
                });

    } else { res.status(400).json({ message: "Tous les paramètres requis n'ont été fournis" }); }

};
export const get = (req: { userDoingRequest: { password: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
  try {
      req.userDoingRequest.password = "";
      res.status(200).json(req.userDoingRequest);
  } catch (err) {
    res.status(500).json(err);
  }
};

// eslint-disable-next-line consistent-return
export const login = (req: { body: { email: string|null; password: string|any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: any; userId?: any; token?: any; message?: string; }): void; new(): any; }; }; }) => {
    if (req.body.email != null) {
        User.findOne({ email: req.body.email })
            .then((user: { [x: string]: any; }) => {
                if (!user) {
                    return res.status(452).json({ error: "Cet email n'existe pas ! Veuillez réessayer !" });
                }
                bcrypt.compare(req.body.password, user["password"])
                    .then((valid: boolean) => {
                        if (!valid) {
                            return res.status(452).json({ error: "Mot de passe incorrect ! Veuillez réessayer !" });
                        }

                        // @ts-ignore
                        res.status(200).json(userTokenResponse(user));
                    })
                    .catch((error: any) => res.status(500).json({ error }));
            })
            .catch((error: any) => res.status(500).json({ error }));
    } else { res.status(400).json({ message: "Tous les paramètres requis n'ont pas été fournis" }); }

};
