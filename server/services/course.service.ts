import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";

//Create course
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    // Delete allCourses cache from Redis
    await redis.del("allCourses");
    res.status(201).json({
      success: true,
      course,
    });
  }
);
