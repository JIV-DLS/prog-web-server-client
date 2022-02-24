import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UpdateWithAggregationPipeline, UpdateQuery, Document } from "mongoose";
import {Password} from "../../models";
import {TmpUserAuth} from "../../models/tmpUserAuth.model";
import {User} from "../../models/user.model";
import {logger} from "../../utils/logger"

import deleteProperty = Reflect.deleteProperty;

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

export const signinWithPhoneNumber = (req: { params: { phoneNumber: null; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: any; message?: string; }): void; new(): any; }; }; }) => {
    if (req.params.phoneNumber != null) {
        User.findOne({phoneNumber: req.params.phoneNumber}).then((_: any) => {
            //logger.info(_);
            if (_ == null) {
                new TmpUserAuth({
                    code: Math.floor(
                        Math.random() * (999999 - 100000) + 100000,
                    ),
                    phoneNumber: req.params.phoneNumber,
                    verified: false,
                }).save().then((tmpToComfirm) => {
                    res.status(201).json(tmpToComfirm._id);
                }).catch((error) => res.status(500).json({error}));
            } else {
                res.status(452).json(
                    {
                        error: "Cet numéro de téléphone est déja utilisé, si vous avez " +
                            "oubliez le mot de passe, veuillez procéder à la récupération."
                    });
            }
        }).catch((error: any) => res.status(500).json({error}));

    } else {
        res.status(400).json({message: "Aucun numéro de téléphone n'a été fourni"});
    }

};

export const confirmPhoneNumber = (req: { params: { _id: null; }; body: { code: string | number; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: any; message?: string; }): void; new(): any; }; }; }) => {
    if (req.params._id != null) {
        TmpUserAuth.findOne({_id: req.params._id}).then((tmpUserAuth: UpdateWithAggregationPipeline | UpdateQuery<Document<any, any, any>> | undefined) => {
        // @ts-ignore
            if (tmpUserAuth && +req.body.code / +tmpUserAuth["code"] == 1) {
            // @ts-ignore
                tmpUserAuth["verified"] = true;
                TmpUserAuth.updateOne({ _id: req.params._id }, tmpUserAuth).
                    // @ts-ignore
            then(() => res.status(201).json(tmpUserAuth._id)).
                // @ts-ignore
            catch((error) => res.status(500).json({ error }))
            ;
        } else { res.status(452).json({ error: "Le code fourni est incorrect! Veuillez réessayer" }); }
            // @ts-ignore
    }).catch((error) => res.status(500).json({ error }));
    } else {  res.status(400).json({ message: "Aucun idenetifiant de numéro à vérifié n'a été fourni" }); }

};
export const pseudoValidity = (req: { params: { pseudo: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: boolean): any; new(): any; }; }; }) => {
    User.findOne({pseudo: req.params.pseudo}).then((_: null) => res.status(200).json(_ == null )).
        // @ts-ignore
    catch((error: any) => res.status(200).json({"error": error}));
};

export const signup = (req: { body: { password: null|string; pseudo: string | null; firstName: string | null; }; params: { _id: null; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { userId?: any; token?: any; error?: any; message?: string; }): void; new(): any; }; }; }) => {
    if (req.body.password != null
    && req.body.pseudo != null
    && req.body.firstName != null
    && req.params._id != null) {
        TmpUserAuth.findOne({ _id: req.params._id }).
        then((tmpUserAuth: { [x: string]: any; }) => {

            // @ts-ignore
            bcrypt.hash(req.body.password, 10)
                .then((hash: any) => {
                    if (!req.body.firstName || !req.body.pseudo)return
                    const user = new User({
                        firstName: req.body.firstName.trim(),
                        password: hash,
                        phoneNumber: tmpUserAuth["phoneNumber"],
                        pseudo: req.body.pseudo.trim(),
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
        }).catch((error: any) => res.status(500).json({ error }));

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
export const login = (req: { body: { pseudo: null; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: any; userId?: any; token?: any; message?: string; }): void; new(): any; }; }; }) => {
    if (req.body.pseudo != null) {
        User.findOne({ pseudo: req.body.pseudo })
            .then((user: { [x: string]: any; }) => {
                if (!user) {
                    return res.status(452).json({ error: "Cet pseudo n'existe pas ! Veuillez réessayer" });
                }
                bcrypt.compare(req.body.password, user["password"])
                    .then((valid: boolean) => {
                        if (!valid) {
                            return res.status(452).json({ error: "Mot de passe incorrect ! Veuillez réessayer" });
                        }

                        // @ts-ignore
                        res.status(200).json(userTokenResponse(user));
                    })
                    .catch((error: any) => res.status(500).json({ error }));
            })
            .catch((error: any) => res.status(500).json({ error }));
    } else { res.status(400).json({ message: "Tous les paramètres requis n'ont pas été fournis" }); }

};
