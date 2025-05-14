import {Request , Response, NextFunction} from 'express';
import userModel, { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import jwt, { Secret } from 'jsonwebtoken';
require('dotenv').config();
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';
//register user
interface IregistrationBody {
    name: string;
    email: string;
    password: string;
    avatar ?:string;
}
export const registerUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => 
{
    try 
    {
        const { name, email, password }= req.body ;
        const isEmailExist = await userModel.findOne({email});
        if (isEmailExist) 
        {
            return next(new ErrorHandler('User already exists', 400));
        }
        const user :IregistrationBody = {
            name,
            email,
            password,
        }
        const activationToken = createActivationToken(user);
        console.log(activationToken);
        const activationCode = activationToken.activationCode;
        const data ={user :{name :user.name},activationCode};
        const html=await ejs.renderFile(path.join(__dirname, '../mails/activation-mail.ejs'), data);
        try 
        {
            await sendMail({
                email: user.email,
                subject: 'Activate your account',
                template: 'activation-mail.ejs',
                data,
            });
            res.status(201).json({
                success: true,
                message: 'please check your email',
                activationToken: activationToken.token,
            });
        } 
        catch (error:any) 
        {
            return next(new ErrorHandler(error.message, 400));
        }
    }
        catch (error:any) 
        {
        return next(new ErrorHandler(error.message, 400));
    }
}
);
interface IActivationToken {
    token: string;
    activationCode: string;
}
export const createActivationToken = (user: any) :IActivationToken => {
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ user, activationCode },process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: '5m',
    });
    return { token, activationCode };
}
