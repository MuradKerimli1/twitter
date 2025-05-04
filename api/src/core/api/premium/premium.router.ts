import express from "express";
import { auth } from "../../middleware/auth";
import premiumMiddleware from "../../middleware/isPremium";
import { premiumController } from "./premium.controller";
import adminMiddleware from "../../middleware/isAdmin";
export const premiumRouter = express.Router();
const controller = premiumController();

premiumRouter.get(
  "/viewers",
  auth,
  premiumMiddleware,
  controller.profileViewers
);
premiumRouter.post("/buy", auth, controller.buyPremiumPackage);
premiumRouter.get("/packages", auth, controller.getPremiumPackages);
premiumRouter.post("/create", auth, controller.createPremiumPackage);
premiumRouter.delete(
  "/package/delete/:id",
  auth,
  adminMiddleware,
  controller.deletePremiumPackage
);
