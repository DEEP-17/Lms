import cloudinary from "cloudinary";
import { AnyARecord } from "dns";
import ejs from "ejs";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";
import NotificationModel from "../models/notification.model";
import { createCourse } from "../services/course.service";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import sendMail from "../utils/sendMail";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const course = await CourseModel.create(data);
      // Delete allCourses cache from Redis (once, after DB mutation)
      try {
        await redis.del("allCourses");
      } catch (err) {
        console.error("Redis error (uploadCourse):", err);
      }
      res.status(201).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//edit course

export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      const newThumbnail = data.newThumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(newThumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        {
          new: true,
        }
      );

      // Delete allCourses cache from Redis (once, after DB mutation)
      try {
        await redis.del("allCourses");
      } catch (err) {
        console.error("Redis error (editCourse):", err);
      }
      res.status(201).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get single course ---- without purchasing

export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCached = await redis.get(courseId);
      if (isCached) {
        res.status(200).json({
          success: true,
          course: JSON.parse(isCached),
        });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        if (!course) {
          return next(new ErrorHandler("Course not found", 404));
        }
        await redis.set(courseId, JSON.stringify(course), "EX", 240);
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//Rajat
//get all courses ---- without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCached = await redis.get("allCourses");
      if (isCached) {
        return res.status(200).json({
          success: true,
          courses: JSON.parse(isCached),
        });
      }
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      if (!courses || courses.length === 0) {
        return next(new ErrorHandler("No courses found", 404));
      }
      await redis.set("allCourses", JSON.stringify(courses), "EX", 240);
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get course content --- only for valid users
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("You are not logged in", 401));
      }
      const userCourseList = req.user?.courses;
      if (!userCourseList || userCourseList.length === 0) {
        return next(new ErrorHandler("You have not purchased any course", 404));
      }
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );
      if (!courseExists) {
        return next(
          new ErrorHandler("You have not purchased this course", 403)
        );
      }
      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add question in course
interface IAddQustion {
  courseId: string;
  question: string;
  contentId: string;
}

export const addQuestionInCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, question, contentId } = req.body;
      if (!courseId || !question || !contentId) {
        return next(new ErrorHandler("Please provide all fields", 400));
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      if (
        mongoose.Types.ObjectId.isValid(courseId) === false ||
        mongoose.Types.ObjectId.isValid(contentId) === false
      ) {
        return next(new ErrorHandler("Invalid course or content ID", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }
      const questionObject: any = {
        user: req.user,
        question,
        questionReplies: [],
      };
      courseContent.questions.push(questionObject);
      await NotificationModel.create({
        userId: req.user?._id,
        title: "New Question Received",
        message: `${req.user?.name} has asked a new question on your video ${courseContent.title}`,
      });
      await course.save();
      try {
        await redis.del("allCourses");
      } catch (err) {
        console.error("Redis error (addQuestionInCourse):", err);
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add answer in course question
interface IAddAnswer {
  courseId: string;
  questionId: string;
  answer: string;
  contentId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, questionId, answer, contentId } = req.body;
      if (!courseId || !questionId || !answer || !contentId) {
        return next(new ErrorHandler("Please provide all fields", 400));
      }
      if (
        mongoose.Types.ObjectId.isValid(courseId) === false ||
        mongoose.Types.ObjectId.isValid(contentId) === false ||
        mongoose.Types.ObjectId.isValid(questionId) === false
      ) {
        return next(
          new ErrorHandler("Invalid course, content or question ID", 400)
        );
      }
      const course = await CourseModel.findById(courseId);
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }
      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Question not found", 404));
      }
      const answerObject: any = {
        user: req.user,
        answer,
      };
      question.questionReplies.push(answerObject);
      await course?.save();
      if (req.user?._id === question.user._id) {
        await NotificationModel.create({
          userId: req.user?._id,
          title: "Your Question has been answered",
          message: `${req.user?.name} has answered your question on the video ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );
        try {
          await sendMail({
            email: question.user.email,
            subject: "Question reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      try {
        await redis.del("allCourses");
      } catch (err) {
        console.error("Redis error (addAnswer):", err);
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add review in course
interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      if (!userCourseList || userCourseList.length === 0) {
        return next(new ErrorHandler("You have not purchased any course", 404));
      }
      const courseId = req.params.id;
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId
      );
      if (!courseExists) {
        return next(
          new ErrorHandler("You have not purchased this course", 403)
        );
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const { review, rating } = req.body;
      if (!review || !rating) {
        return next(new ErrorHandler("Please provide all fields", 400));
      }
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };
      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((item: any) => {
        avg += item.rating;
      });
      course.ratings = avg / course.reviews.length;
      await course.save();
      try {
        await redis.del("allCourses");
      } catch (err) {
        console.error("Redis error (addReview):", err);
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add reply to review

interface IAddReviewData {
  courseId: string;
  reviewId: string;
  comment: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, reviewId, comment } = req.body;
      if (!courseId || !reviewId || !comment) {
        return next(new ErrorHandler("Please provide all fields", 400));
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const review = course.reviews.find((item: any) =>
        item._id.equals(reviewId)
      );
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }
      const replyObject: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies?.push(replyObject);
      await course.save();
      try {
        await redis.del("allCourses");
      } catch (err) {
        console.error("Redis error (addReplyToReview):", err);
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//delete course -- only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      await course.deleteOne({ id });
      try {
        await redis.del("allCourses");
      } catch (err) {
        console.error("Redis error (deleteCourse):", err);
      }
      res.status(200).json({
        succes: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
