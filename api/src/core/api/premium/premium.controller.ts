import { NextFunction, Request, Response } from "express";
import { appError } from "../../error/appError";
import { User } from "../../../dal/entity/user.entity";

const profileViewers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new appError("User not found", 404));
    }

    const user = await User.createQueryBuilder("user")
      .leftJoinAndSelect("user.viewers", "viewers")
      .where("user.id = :userId", { userId })
      .getOne();

    if (!user) {
      return next(new appError("User not found", 404));
    }

    res.status(200).json({ success: true, viewers: user.viewers || [] });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// bank system
const buyPremiumPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json("Ok");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const premiumController = () => {
  return { profileViewers, buyPremiumPackage };
};
