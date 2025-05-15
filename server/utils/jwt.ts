require("dotenv").config();
import { Response
, Request, NextFunction
 } from "express";
 import {IUser} from "../models/user.model";
 import {redis } from "./redis";
import { parse } from "path";
 interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none' | undefined;
    secure?: boolean;
}
 export const accessTokenExpire=parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300',10) ;
   export  const refreshTokenExpire=parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200',10) ;
    //set cookie options
    export const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire*3600 * 1000),   
        maxAge: accessTokenExpire *3600* 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
    };
    export const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire *24*3600* 1000),
        maxAge: refreshTokenExpire*24*3600 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
    };
export const sendToken = (user: IUser, statusCode :number, res : Response ) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    //upload refresh token to redis
    redis.set(String(user._id), JSON.stringify(user));
    //parse environment variables to integrate with fallback values
    
    //only set cookie if in production
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
    }
    res.cookie('access_token', accessToken, accessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
}