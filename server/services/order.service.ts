import { NextFunction,Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";
import ErrorHandler from "../utils/ErrorHandler";
//Create new order
export const newOrder = CatchAsyncError(
  async (data:any,res:Response, next: NextFunction) => {
    try {
       const order = await OrderModel.create(data);
       res.status(201).json({
         success: true,
         order
      });
    } catch (error: any) {
      return next(new ErrorHandler("Error creating order", 500));
    }
  }
);

//Get all orders
export const getAllOrdersService = async (res: Response) => {
   const orders = await OrderModel.find().sort({ createdAt: -1 });
   res.status(200).json({
     success: true,
     orders,
   });
};