import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import { CatchAsyncError } from "./catchAsyncErrors";
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Invalid token, please login again", 401));
    }
    const user = await redis.get(String(decoded.id));
    if (!user) {
      return next(new ErrorHandler("User not found, please login again", 400));
    }
    req.user = JSON.parse(user);
    next();
  }
);
// validate user
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${
            req.user?.role || ""
          } is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
