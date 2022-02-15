import { Router } from "express";

import {appAuth} from "../middleware/appAuth";
import {auth} from "../middleware/auth";
import {currentUser} from "../middleware/currentUser";
import {GasRouter} from "./gas";
import {confirmPhoneNumber, get, login, pseudoValidity, signinWithPhoneNumber, signup} from "./user";
import {ServiceRouter} from "./service";



const router = Router();
router.get("/status", (req, res) => res.status(200).json("ok"));



router.get("/auth/signupWithNumber/:phoneNumber", appAuth, signinWithPhoneNumber);
router.post("/auth/confirmWithNumber/:_id", appAuth, confirmPhoneNumber);
router.post("/auth/signup/:_id", appAuth, signup);
router.get("/auth/signup/pseudo_validity/:pseudo", appAuth, pseudoValidity);
router.post("/auth/login", appAuth, login);
router.get("/auth/:_id", appAuth, auth, currentUser, get);
router.use("/gas", GasRouter);
router.use("/service", ServiceRouter);


export const api = router;
