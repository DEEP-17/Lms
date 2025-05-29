import NotificationModel from "../models/notification.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";

//Get all notifications ---- only for admin
export const getNotifications = CatchAsyncError(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const notifications = await NotificationModel.find().sort({createdAt:-1});

         res.status(200).json({
            success: true,
            notifications,
         });
      }catch (error:any) {
         return next(new ErrorHandler("Error fetching notifications", 500));
      }
   }
);

//update notification status -- only for admin
export const updateNotification = CatchAsyncError(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const notification = await NotificationModel.findById(req.params.id);

         if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
         }

         notification.status = "read";
         await notification.save();
         const notifications = await NotificationModel.find().sort({createdAt:-1});
         res.status(200).json({
            success: true,
            message: "Notification status updated successfully",
            notifications,
         });
      } catch (error:any) {
         return next(new ErrorHandler("Error updating notification status", 500));
      }
   }
);

//delete notification -- only for admin
cron.schedule("0 0 0 * * *", async () => {
   try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const notifications = await NotificationModel.find();
      if (notifications.length > 0) {
         await NotificationModel.deleteMany({status: "read", createdAt: { $lt: thirtyDaysAgo }});
      }
   } catch (error:any) {
      console.error("Error deleting notifications:", error.message);
   }
});