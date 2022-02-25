import { Router } from "express";

import {appAuth} from "../middleware/appAuth";
import {auth} from "../middleware/auth";
import {currentUser} from "../middleware/currentUser";
import {GasRouter} from "./gas";
import {confirmPhoneNumber, get, login, emailValidity, signinWithPhoneNumber, signup} from "./user";
import {ServiceRouter} from "./service";
import {StationRouter} from "./station";



const router = Router();
router.get("/status", (req, res) => res.status(200).json("ok"));

// @ts-ignore
router.post("/auth/signup/:_id", appAuth, signup);
// @ts-ignore
router.get("/auth/signup/pseudo_validity/:pseudo", appAuth, emailValidity);
// @ts-ignore
router.post("/auth/login", appAuth, login);
// @ts-ignore
router.get("/auth/:_id", appAuth, auth, currentUser, get);
router.use("/gas", GasRouter);
router.use("/service", ServiceRouter);
router.use('/station', StationRouter)


export const api = router;
