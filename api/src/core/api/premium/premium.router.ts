import express from "express";
import { auth } from "../../middleware/auth";
import premiumMiddleware from "../../middleware/isPremium";
import { premiumController } from "./premium.controller";
export const premiumRouter = express.Router();
const controller = premiumController();

premiumRouter.get(
  "/viewers",
  auth,
  premiumMiddleware,
  controller.profileViewers
);
