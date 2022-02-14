import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Password} from "../../models";
import {TmpUserAuth} from "../../models/tmpUserAuth.model";
import {User} from "../../models/user.model";
import {logger} from "../../utils/logger"

import deleteProperty = Reflect.deleteProperty;

function userTokenResponse(user) {
  return {
    userId: user._id,
      // tslint:disable-next-line:object-literal-sort-keys
    token: jwt.sign(
      { userId: user._id },
      Password,
    ),
  };
}

export const signinWithPhoneNumber = (req, res) => {
    if (req.params.phoneNumber != null) {
        User.findOne({phoneNumber: req.params.phoneNumber}).then((_) => {
            //logger.info(_);
            if (_ == null) {
                new TmpUserAuth({
                    code: Math.floor(
                        Math.random() * (999999 - 100000) + 100000,
                    ),
                    phoneNumber: req.params.phoneNumber,
                    verified: false,
                }).save().
                then((tmpToComfirm) => {
                    res.status(201).json(tmpToComfirm._id);
                }).catch((error) => res.status(500).json({ error }));
            } else { res.status(452).json(
                { error: "Cet numéro de téléphone est déja utilisé, si vous avez " +
                        "oubliez le mot de passe, veuillez procéder à la récupération." });
            }
        }).catch((error) => res.status(500).json({ error }));

    } else {  res.status(400).json({ message: "Aucun numéro de téléphone n'a été fourni" }); }

};

export const confirmPhoneNumber = (req, res) => {
    if (req.params._id != null) {
    TmpUserAuth.findOne({ _id: req.params._id }).
    then((tmpUserAuth) => {
        if (+req.body.code / +tmpUserAuth["code"] == 1) {
            tmpUserAuth["verified"] = true;
            TmpUserAuth.updateOne({ _id: req.params._id }, tmpUserAuth).
            then((tmpUserUpdated) => res.status(201).json(tmpUserAuth._id)).
            catch((error) => res.status(500).json({ error }))
            ;
        } else { res.status(452).json({ error: "Le code fourni est incorrect! Veuillez réessayer" }); }
    }).catch((error) => res.status(500).json({ error }));
    } else {  res.status(400).json({ message: "Aucun idenetifiant de numéro à vérifié n'a été fourni" }); }

};
export const pseudoValidity = (req, res) => {
    User.findOne({pseudo: req.params.pseudo}).then((_) => res.status(200).json(_ == null )).
    catch((error) => res.status(200).json({ error}));
};
export const signup = (req, res) => {
    if (req.body.password != null
    && req.body.pseudo != null
    && req.body.firstName != null
    && req.params._id != null) {
        TmpUserAuth.findOne({ _id: req.params._id }).
        then((tmpUserAuth) => {
            bcrypt.hash(req.body.password, 10)
                .then((hash) => {
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
                .catch((error) => {
                    res.status(500).json({ error });
                });
        }).catch((error) => res.status(500).json({ error }));

    } else { res.status(400).json({ message: "Tous les paramètres requis n'ont été fournis" }); }

};
export const get = (req, res) => {
  try {
      req.userDoingRequest.password = "";
      res.status(200).json(req.userDoingRequest);
  } catch (err) {
    res.status(500).json(err);
  }
};

// eslint-disable-next-line consistent-return
export const login = (req, res) => {
    if (req.body.pseudo != null) {
        User.findOne({ pseudo: req.body.pseudo })
            .then((user) => {
                if (!user) {
                    return res.status(452).json({ error: "Cet pseudo n'existe pas ! Veuillez réessayer" });
                }
                bcrypt.compare(req.body.password, user["password"])
                    .then((valid) => {
                        if (!valid) {
                            return res.status(452).json({ error: "Mot de passe incorrect ! Veuillez réessayer" });
                        }
                        res.status(200).json(userTokenResponse(user));
                    })
                    .catch((error) => res.status(500).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));
    } else { res.status(400).json({ message: "Tous les paramètres requis n'ont été fournis" }); }

};
