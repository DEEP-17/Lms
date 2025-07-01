require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "strict" | "lax" | "none" | undefined;
  secure?: boolean;
}

// Utility to get secrets and expiry from env, with error if missing
function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const getAccessTokenSecret = () => getEnvOrThrow("ACCESS_TOKEN");
export const getRefreshTokenSecret = () => getEnvOrThrow("REFRESH_TOKEN");
console.log(process.env.ACCESS_TOKEN_EXPIRE);
console.log(process.env.REFRESH_TOKEN_EXPIRE);
export const getAccessTokenExpire = () =>
  parseInt(process.env.ACCESS_TOKEN_EXPIRE || "3", 10);
export const getRefreshTokenExpire = () =>
  parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);

export const accessTokenExpire = getAccessTokenExpire();
export const refreshTokenExpire = getRefreshTokenExpire();
//set cookie options
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 60 * 1000),
  maxAge: refreshTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();
  const userId = user._id as string;
  //upload refresh token to redis
  redis.set(userId, JSON.stringify(user), "EX", 240);
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
