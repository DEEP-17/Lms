import express from "express";
import {
  addAnswer,
  addQuestionInCourse,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAllCourses,
  getAllCoursesForAdmin,
  getCourseByUser,
  getEnrolledCourses,
  getSingleCourse,
  getSingleCourseForAdmin,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-all-courses", getAllCourses);
courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);
courseRouter.put("/add-question", isAuthenticated, addQuestionInCourse);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);
courseRouter.put(
  "/add-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);
courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);
courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

// Admin-specific routes for editing courses with full details
courseRouter.get(
  "/admin/get-all-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCoursesForAdmin
);
courseRouter.get(
  "/admin/get-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  getSingleCourseForAdmin
);

// User-specific routes
courseRouter.get("/get-enrolled-courses", isAuthenticated, getEnrolledCourses);

export default courseRouter;
