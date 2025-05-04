import { NextFunction, Request, Response } from "express";
import { appError } from "../../error/appError";
import { User } from "../../../dal/entity/user.entity";
import { PremiumPackage } from "../../../dal/entity/premiumPackage.entity";
import { Currency } from "../../../dal/enums/currencyEnum";

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

const buyPremiumPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const packageId = Number(req.body.packageId);

    if (!userId) {
      return next(new appError("User not found", 404));
    }

    if (!packageId) {
      return next(new appError("Package ID is required", 400));
    }

    const premiumPackage = await PremiumPackage.findOne({
      where: { id: packageId },
    });

    if (!premiumPackage) {
      return next(new appError("Package not found", 404));
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(new appError("User not found", 404));
    }

    // stripe payment logic would go here
    // For now, we will assume the payment is successful
    

    res.status(200).json({
      success: true,
      message: "Premium package purchased successfully",
      package: premiumPackage,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getPremiumPackages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const packages = await PremiumPackage.find({
      order: { createdAt: "DESC" },
    });
    if (!packages) {
      return next(new appError("No packages found", 404));
    }
    res.status(200).json({ success: true, packages });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createPremiumPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, durationInDays, price, description, currency } = req.body;
    if (!name || !durationInDays || !price || !currency) {
      return next(new appError("Please provide all required fields", 400));
    }
    if (currency && !Object.values(Currency).includes(currency.toUpperCase())) {
      return next(new appError("Invalid currency", 400));
    }

    if (durationInDays <= 0) {
      return next(new appError("Duration must be greater than 0", 400));
    }
    if (price <= 0) {
      return next(new appError("Price must be greater than 0", 400));
    }
    if (description && description.length > 500) {
      return next(new appError("Description is too long", 400));
    }

    const packageExists = await PremiumPackage.findOne({ where: { name } });
    if (packageExists) {
      return next(new appError("Package already exists", 400));
    }
    const newPackage = await PremiumPackage.create({
      name,
      durationInDays,
      price,
      description,
      currency: currency.toUpperCase(),
    }).save();

    if (!newPackage) {
      return next(new appError("Failed to create package", 500));
    }
    res.status(201).json({
      success: true,
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deletePremiumPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const packageId = Number(req.params.id);
    if (!packageId) {
      return next(new appError("Package ID is required", 400));
    }
    const packageToDelete = await PremiumPackage.findOne({
      where: { id: packageId },
    });
    if (!packageToDelete) {
      return next(new appError("Package not found", 404));
    }
    await PremiumPackage.delete({ id: packageId });
    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const premiumController = () => {
  return {
    profileViewers,
    buyPremiumPackage,
    getPremiumPackages,
    createPremiumPackage,
    deletePremiumPackage,
  };
};
