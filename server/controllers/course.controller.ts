import cloudinary from 'cloudinary';
import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";
import { createCourse} from "../services/course.service";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from '../utils/redis';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';
import { AnyARecord } from 'dns';
import NotificationModel from '../models/notification.model';

export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
         const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder: "courses"
         });

         data.thumbnail = {
            public_id: myCloud.public_id,
            url:myCloud.secure_url
         }
      }
      createCourse(data, res, next);
   } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
   }
});


//edit course

export const editCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
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
            url: myCloud.secure_url
         };
      }
      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(courseId, {
         $set: data
      },
         {
            new: true,
         });
      
      res.status(201).json({ success: true, course });
      
   } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
   }
});

//get single course ---- without purchasing

export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {

      const courseId = req.params.id;

      const isCached =  await redis.get(courseId);
      if (isCached) {
         res.status(200).json({
            success: true,
            course: JSON.parse(isCached)
         });
      }
      else {
         const course = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

      if (!course) {
         return next(new ErrorHandler("Course not found", 404));
      }
      await redis.set(courseId, JSON.stringify(course),"EX",240);
      res.status(200).json({
         success: true,
         course
      });
      }
   } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
   }
});
//Rajat
//get all courses ---- without purchasing
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
      const isCached = await redis.get("allCourses");
      if (isCached) {
         return res.status(200).json({
            success: true,
            courses: JSON.parse(isCached)
         });
      }
      const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

      if (!courses || courses.length === 0) {
         return next(new ErrorHandler("No courses found", 404));
      }
      await redis.set("allCourses", JSON.stringify(courses), "EX", 240);
      res.status(200).json({
         success: true,
         courses
      });
   } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
   }
});

//get course content --- only for valid users
export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
      if (!req.user) {
         return next(new ErrorHandler("You are not logged in", 401));
      }
      const userCourseList = req.user?.courses;
      if (!userCourseList || userCourseList.length === 0) {
         return next(new ErrorHandler("You have not purchased any course", 404));
      }
      const courseId = req.params.id;

      const courseExists = userCourseList?.find((course: any) => course._id.toString() === courseId);
      if (!courseExists) {
         return next(new ErrorHandler("You have not purchased this course", 403));
      }
      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;
      res.status(200).json({
         success: true,
         content
      });
   } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
   }
});


//add question in course
interface IAddQustion{
   courseId: string;
   question: string;
   contentId: string;
}

export const addQuestionInCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
      await redis.del("allCourses");
      const { courseId, question, contentId }: IAddQustion = req.body;

      if (!courseId || !question || !contentId) {
         return next(new ErrorHandler("Please provide all fields", 400));
      }
      const course = await CourseModel.findById(courseId);

      if (!course) {
         return next(new ErrorHandler("Course not found", 404));
      }

      if (mongoose.Types.ObjectId.isValid(courseId) === false || mongoose.Types.ObjectId.isValid(contentId) === false) {
         return next(new ErrorHandler("Invalid course or content ID", 400));
      }
      const courseContent = course?.courseData?.find((item:any) => item._id.equals(contentId));
      
      if (!courseContent) {
         return next(new ErrorHandler("Content not found", 404));
      }

      //Create a new question object
      const questionObject:any = {
         user: req.user,
         question,
         questionReplies: []
      };

      //Add this question to our course content

      courseContent.questions.push(questionObject);

      await NotificationModel.create({
         userId: req.user?._id,
         title: "New Question Received",
         message: `${req.user?.name} has asked a new question on your video ${courseContent.title}`
      });
      await course.save();
      res.status(200).json({
         success: true,
         course
      });
   }
   catch (error: any) {
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

export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
      await redis.del("allCourses");
      const { courseId, questionId, answer, contentId }: IAddAnswer = req.body;
      //Check if all fields are provided
      if (!courseId || !questionId || !answer || !contentId) {
         return next(new ErrorHandler("Please provide all fields", 400));
      }

      if( mongoose.Types.ObjectId.isValid(courseId) === false || mongoose.Types.ObjectId.isValid(contentId) === false || mongoose.Types.ObjectId.isValid(questionId) === false) {
         return next(new ErrorHandler("Invalid course, content or question ID", 400));
      }

      const course = await CourseModel.findById(courseId);

      const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));
      if (!courseContent) {
         return next(new ErrorHandler("Content not found", 404));
      }
      const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId));

      if (!question) {
         return next(new ErrorHandler("Question not found", 404));
      }

      //Create a new answer object
      const answerObject: any = {
         user: req.user,
         answer
      };

      //Add this answer to our question
      question.questionReplies.push(answerObject);
      await course?.save();
      if (req.user?._id === question.user._id) {
         //create a notification
         await NotificationModel.create({
            userId: req.user?._id, 
            title: "Your Question has been answered",
            message: `${req.user?.name} has answered your question on the video ${courseContent.title}`
         });
      } else {
         const data = {
            name: question.user.name,
            title:courseContent.title
         }
         const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data);
         
         try {
            await sendMail({
               email: question.user.email,
               subject: "Question reply",
               template: "question-reply.ejs",
               data,
            });
         }catch (error:any) {
            return next(new ErrorHandler(error.message, 500));
         }
      }
      res.status(200).json({
         success: true,
         course
      });
   } catch (error: any) {
      return next(new ErrorHandler(error. message, 500));
   }
});


//add review in course
interface IAddReviewData {
   review: string;
   courseId: string;
   rating: number;
   userId: string;
}

export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
      await redis.del("allCourses");
      const userCourseList = req.user?.courses;
      if (!userCourseList || userCourseList.length === 0) {
         return next(new ErrorHandler("You have not purchased any course", 404));
      }
      const courseId = req.params.id;
      const courseExists = userCourseList?.some((course: any) => course._id.toString() === courseId);
      if (!courseExists) {
         return next(new ErrorHandler("You have not purchased this course", 403));
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
         return next(new ErrorHandler("Course not found", 404));
      }

      const { review, rating } = req.body as IAddReviewData;
      if (!review || !rating) {
         return next(new ErrorHandler("Please provide all fields", 400));
      }
      const reviewData:any = {
         user: req.user,
         comment: review,
         rating
      }

      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((item: any) => {
         avg += item.rating;
      });

      course.ratings = avg / course.reviews.length;
      await course.save();
      const notification = {
         title: "New Review",
         message: `${req.user?.name} has given a new review on your course ${course.name}`,

      }

      //Create a notification for the course owner

      res.status(200).json({
         success: true,
         course,
      });
   } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
   }
});

//add reply to review

interface IAddReviewData {
   courseId: string;
   reviewId: string;
   comment: string;
}

export const addReplyToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
      await redis.del("allCourses");
      const { courseId, reviewId, comment }: IAddReviewData = req.body;

      if (!courseId || !reviewId || !comment) {
         return next(new ErrorHandler("Please provide all fields", 400));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
         return next(new ErrorHandler("Course not found", 404));
      }

      const review = course.reviews.find((item: any) => item._id.equals(reviewId));
      if (!review) {
         return next(new ErrorHandler("Review not found", 404));
      }

      //Create a new reply object
      const replyObject: any = {
         user: req.user,
         comment
      };

      if(!review.commentReplies) {
         review.commentReplies = [];
      }
      //Add this reply to our review
      review.commentReplies?.push(replyObject);
      await course.save();
      
      res.status(200).json({
         success: true,
         course
      });
   } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
   }
});

//delete course -- only for admin
export const deleteCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
      await redis.del("allCourses");
    const { id }= req.params;
    const course = await CourseModel.findById(id);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    await course.deleteOne({ id });
    
    await redis.del(id);
    await redis.del("allCourses");
    res.status(200).json({
      succes: true,
      message:"Course deleted successfully"
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

