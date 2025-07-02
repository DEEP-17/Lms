import cloudinary from "cloudinary";
import crypto from "crypto";
import ejs from "ejs";
import { NextFunction, Request, Response } from "express";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  Secret,
  TokenExpiredError,
} from "jsonwebtoken";
import path from "path";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel, { IUser } from "../models/user.model";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import ErrorHandler from "../utils/ErrorHandler";
import {
  accessTokenOptions,
  getAccessTokenExpire,
  getRefreshTokenExpire,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import sendMail from "../utils/sendMail";

require("dotenv").config();
//register user
interface IregistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("User already exists", 400));
      }
      const user: IregistrationBody = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: "please check your email",
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};
//activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
        avatar: {
          url: "https://example.com/default-avatar.png",
          public_id: "default_avatar",
        },
      });
      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//login user
interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", {
        maxAge: 1,
      });
      res.cookie("refresh_token", "", {
        maxAge: 1,
      });
      //delete refresh token from redis
      const userId = req.user?._id as string;
      await redis.del(String(userId));
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update excess token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Updating access token");
      let refresh_token = req.cookies.refresh_token as string;
      console.log("Refresh Token:", refresh_token);
      if (!refresh_token) {
        return next(new ErrorHandler("Please login again", 400));
      }

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN as string
        ) as JwtPayload;
      } catch (jwtError) {
        if (jwtError instanceof TokenExpiredError) {
          return next(
            new ErrorHandler(
              "Refresh token has expired, please login again",
              401
            )
          );
        } else if (jwtError instanceof JsonWebTokenError) {
          return next(
            new ErrorHandler("Invalid refresh token, please login again", 401)
          );
        } else {
          return next(
            new ErrorHandler(
              "Token verification failed, please login again",
              401
            )
          );
        }
      }

      const message = "Invalid refresh token, please login again";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const user = await userModel.findById(decoded.id);
      if (!user) {
        return next(new ErrorHandler(message, 400));
      }
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: `${getAccessTokenExpire()}m`,
        }
      );
      res.locals.user = user;
      res.cookie("access_token", accessToken, accessTokenOptions);
      await redis.set(String(user._id), JSON.stringify(user), "EX", 240);
      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as string;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}
//social authentication
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({
          email,
          name,
          avatar: avatar || {
            url: "https://example.com/default-avatar.png",
            public_id: "default_avatar",
          },
        });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}
export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as string;
      const { name } = req.body as IUpdateUserInfo;
      const user = await userModel.findById(userId);

      if (name && user) {
        user.name = name;
      }
      await user?.save();
      await redis.set(userId, JSON.stringify(user), "EX", 240);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user password

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }
      const user = await userModel.findById(req.user?._id).select("+password");
      const userId = req.user?._id as string;

      await redis.del(userId);
      if (user?.password == undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatched = await user?.comparePassword(oldPassword);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid old password", 400));
      }
      user.password = newPassword;

      await user.save();

      //Temp
      await redis.set(String(req.user?._id), JSON.stringify(user), "EX", 240);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateProfilePicture {
  avatar: string;
}
//update profile picture

export const updateProfilePicture = CatchAsyncError(
  async (req: Request, resizeBy: Response, next: NextFunction) => {
    {
      try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);
        await redis.del(String(userId));

        if (avatar && user) {
          if (user?.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar?.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });
            user.avatar = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
          } else {
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });
            user.avatar = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
          }
        }

        await user?.save();

        await redis.set(String(userId), JSON.stringify(user), "EX", 240);

        resizeBy.status(200).json({
          succes: true,
          user,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  }
);

//get all users
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user role -- only for admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      updateUserRoleService(res, id, role);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Delete user -- only for admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await user.deleteOne();

      await redis.del(String(id));

      res.status(200).json({
        succes: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Generate email verification token
export const generateEmailVerificationToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;
      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      if (user.isVerified) {
        return next(new ErrorHandler("User already verified", 400));
      }
      const verificationToken = jwt.sign(
        { id: user._id },
        process.env.EMAIL_VERIFICATION_SECRET as Secret,
        {
          expiresIn: "5m",
        }
      );
      user.verifyToken = verificationToken;
      user.verifyTokenExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      await user.save();
      // Send verification email
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      const data = { user: { name: user.name }, verificationLink };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/verification-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Verify your email",
          template: "verification-mail.ejs",
          data,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
      // Respond with verification token
      await redis.set(String(user._id), JSON.stringify(user), "EX", 240);
      await user.save();
      res.status(200).json({
        success: true,
        verificationToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Verify email
export const verifyEmail = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.isVerified) {
        return next(new ErrorHandler("User already verified", 400));
      }
      const { verificationToken } = req.body;
      if (!verificationToken) {
        return next(new ErrorHandler("Verification token is required", 400));
      }
      const decoded = jwt.verify(
        verificationToken,
        process.env.EMAIL_VERIFICATION_SECRET as Secret
      ) as JwtPayload;
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      user.isVerified = true;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// --- Password Reset ---
export const forgotPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorHandler("Please provide your email", 400));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.forgotPasswordTokenExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save({ validateBeforeSave: false });
    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}&email=${email}`;
    const data = { name: user.name, resetUrl };
    try {
      await sendMail({
        email: user.email,
        subject: "Password Reset Request",
        template: "reset-password.ejs",
        data,
      });
      res
        .status(200)
        .json({ success: true, message: "Reset link sent to email" });
    } catch (error: any) {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler("Email could not be sent", 500));
    }
  }
);

export const resetPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({
      email,
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpire: { $gt: new Date() },
    });
    if (!user) {
      return next(new ErrorHandler("Invalid or expired token", 400));
    }
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpire = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  }
);
