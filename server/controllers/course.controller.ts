import axios from "axios";
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

      // Only upload to cloudinary if thumbnail is a valid string (base64 or URL)
      if (
        thumbnail &&
        typeof thumbnail === "string" &&
        thumbnail.trim() !== ""
      ) {
        try {
          const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder: "courses",
          });

          data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } catch (cloudinaryError: any) {
          console.error("Cloudinary upload error:", cloudinaryError);
          // If cloudinary upload fails, keep the original thumbnail or set a default
          if (
            cloudinaryError.message.includes(
              "Missing required parameter - file"
            )
          ) {
            // If it's an invalid file, remove the thumbnail
            delete data.thumbnail;
          } else {
            return next(new ErrorHandler("Failed to upload thumbnail", 500));
          }
        }
      } else {
        // If no thumbnail provided, set a default empty structure
        data.thumbnail = {
          public_id: "",
          url: "",
        };
      }

      const course = await CourseModel.create(data);
      // Delete allCourses cache from Redis (once, after DB mutation)
      try {
        await redis.del("allCourses");
        await redis.del("allCoursesForAdmin");
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

      // Handle thumbnail update
      if (
        thumbnail &&
        newThumbnail &&
        typeof newThumbnail === "string" &&
        newThumbnail.trim() !== ""
      ) {
        try {
          // Delete old thumbnail if it exists
          if (thumbnail.public_id) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);
          }

          // Upload new thumbnail
          const myCloud = await cloudinary.v2.uploader.upload(newThumbnail, {
            folder: "courses",
          });

          data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } catch (cloudinaryError: any) {
          console.error("Cloudinary upload error:", cloudinaryError);
          // If cloudinary upload fails, keep the original thumbnail
          if (
            cloudinaryError.message.includes(
              "Missing required parameter - file"
            )
          ) {
            // If it's an invalid file, keep the existing thumbnail
            delete data.thumbnail;
            delete data.newThumbnail;
          } else {
            return next(new ErrorHandler("Failed to upload thumbnail", 500));
          }
        }
      } else {
        // If no new thumbnail provided, keep the existing thumbnail structure
        delete data.newThumbnail;
        // Don't modify the existing thumbnail
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
        await redis.del("allCoursesForAdmin");
        await redis.del(`courseForAdmin_${courseId}`);
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

//get all courses with full details for admin ---- for editing purposes
export const getAllCoursesForAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCached = await redis.get("allCoursesForAdmin");
      if (isCached) {
        return res.status(200).json({
          success: true,
          courses: JSON.parse(isCached),
        });
      }
      const courses = await CourseModel.find(); // Fetch all fields without exclusions

      if (!courses || courses.length === 0) {
        return next(new ErrorHandler("No courses found", 404));
      }
      await redis.set("allCoursesForAdmin", JSON.stringify(courses), "EX", 240);
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get single course with full details for admin ---- for editing purposes
export const getSingleCourseForAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCached = await redis.get(`courseForAdmin_${courseId}`);
      if (isCached) {
        res.status(200).json({
          success: true,
          course: JSON.parse(isCached),
        });
      } else {
        const course = await CourseModel.findById(courseId); // Fetch all fields without exclusions

        if (!course) {
          return next(new ErrorHandler("Course not found", 404));
        }
        await redis.set(
          `courseForAdmin_${courseId}`,
          JSON.stringify(course),
          "EX",
          240
        );
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

//Generate video URL

export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        {
          ttl: 300,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get enrolled courses for the current user
export const getEnrolledCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("You are not logged in", 401));
      }

      const userCourseList = req.user?.courses;
      if (!userCourseList || userCourseList.length === 0) {
        return res.status(200).json({
          success: true,
          courses: [],
        });
      }

      // Get course IDs from user's enrolled courses
      const courseIds = userCourseList.map((course: any) => course._id);

      // Fetch the actual course details
      const courses = await CourseModel.find({
        _id: { $in: courseIds },
      }).select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
