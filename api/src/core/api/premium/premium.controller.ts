import { NextFunction, Request, Response } from "express";
import { appError } from "../../error/appError";
import { User } from "../../../dal/entity/user.entity";
import { PremiumPackage } from "../../../dal/entity/premiumPackage.entity";
import { Currency } from "../../../dal/enums/currencyEnum";
import { generatePaypalToken } from "../../services/paypal";
import axios from "axios";
import { UserPremiumHistory } from "../../../dal/entity/UserPremiumHistory.entity";
import { PaymentStatus } from "../../../dal/enums/paymentEnum";

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
    const orderId = req.query.token as string;
    const packageId = Number(req.query.packageId);

    if (!userId) {
      return next(new appError("User authentication required", 401));
    }

    if (!orderId) {
      return next(new appError("Order token is required", 400));
    }

    if (!packageId || isNaN(packageId)) {
      return next(new appError("Valid package ID is required", 400));
    }

    const [user, pkg] = await Promise.all([
      User.findOne({ where: { id: userId } }),
      PremiumPackage.findOne({ where: { id: packageId } }),
    ]);

    if (!user) {
      return next(new appError("User not found", 404));
    }

    if (!pkg) {
      return next(new appError("Premium package not found", 404));
    }

    const accessToken = await generatePaypalToken();
    if (!accessToken) {
      return next(
        new appError("Failed to authenticate with payment provider", 500)
      );
    }

    const captureRes = await axios.post(
      `${process.env.PAYPAL_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = captureRes.data;
    const paymentStatus = payment.status;

    if (paymentStatus !== "COMPLETED") {
      return next(
        new appError(`Payment not completed. Status: ${paymentStatus}`, 400)
      );
    }

    const amount = payment.purchase_units?.[0]?.amount?.value;
    const currency = payment.purchase_units?.[0]?.amount?.currency_code;
    const transactionId =
      payment.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    if (!amount || !currency || !transactionId) {
      return next(new appError("Invalid payment details received", 400));
    }

    const now = new Date();
    const expiredAt = new Date();
    expiredAt.setDate(now.getDate() + pkg.durationInDays);

    const history = await UserPremiumHistory.create({
      user,
      package: pkg,
      startedAt: now,
      expiredAt,
      paymentStatus: PaymentStatus.COMPLETED,
      paymentId: orderId,
      transactionId,
      amountPaid: amount,
      currency,
      paymentDetails: payment,
    }).save();

    user.isPremium = true;
    user.premiumExpiredAt = expiredAt;
    await user.save();

    const approvalUrl = payment.links?.find(
      (link: any) => link.rel === "approve"
    )?.href;

    res.status(200).json({
      success: true,
      message: "Premium package activated successfully",
      data: {
        orderId,
        transactionId,
        amountPaid: amount,
        currency,
        premiumExpiresAt: expiredAt,
        approvalUrl,
      },
    });
  } catch (error) {
    console.error("Premium Activation Error:", error);

    if (axios.isAxiosError(error)) {
      const paypalError = error.response?.data;
      console.error("PayPal API Error:", paypalError);
      return next(
        new appError(paypalError?.message || "Payment processing failed", 500)
      );
    }

    next(new appError("Failed to complete premium activation", 500));
  }
};

const getPremiumPackages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const packages = await PremiumPackage.find({
      order: { createdAt: "ASC" },
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
    const { name, durationInDays, price, description, currency, features } =
      req.body;
    if (!name || !durationInDays || !price || !currency || !features) {
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
      features,
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

const updatePremiumPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const packageId = Number(req.params.id);
    if (!packageId) {
      return next(new appError("Package ID is required", 400));
    }
    const packageToUpdate = await PremiumPackage.findOne({
      where: { id: packageId },
    });
    if (!packageToUpdate) {
      return next(new appError("Package not found", 404));
    }
    const { name, durationInDays, price, description, currency, features } =
      req.body;
    if (name) packageToUpdate.name = name;
    if (durationInDays) packageToUpdate.durationInDays = durationInDays;
    if (price) packageToUpdate.price = price;
    if (description) packageToUpdate.description = description;
    if (currency) packageToUpdate.currency = currency.toUpperCase();
    if (features) packageToUpdate.features = features;

    await packageToUpdate.save();
    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      package: packageToUpdate,
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
    updatePremiumPackage,
  };
};
