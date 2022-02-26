import { Router } from "express";

import {appAuth} from "../middleware/appAuth";
import {auth} from "../middleware/auth";
import {currentUser} from "../middleware/currentUser";
import {GasRouter} from "./gas";
import {get, login, emailValidity, signup} from "./user";
import {ServiceRouter} from "./service";
import {StationRouter} from "./station";



const router = Router();
router.get("/status", (req, res) => res.status(200).json("ok"));

// @ts-ignore
router.post("/auth/signup", signup);
// @ts-ignore
router.get("/auth/signup/pseudo_validity/:pseudo", appAuth, emailValidity);
// @ts-ignore
router.post("/auth/login", login);
// @ts-ignore
router.get("/auth/:_id", auth, currentUser, get);
router.use("/gas", GasRouter);
router.use("/service", ServiceRouter);
router.use('/station', StationRouter)


export const api = router;
