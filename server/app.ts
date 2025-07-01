require("dotenv").config();
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { ErrorMiddleware } from "./middleware/error";
import analyticsRouter from "./routes/analytics.route";
import contactRoute from "./routes/contact.route";
import courseRouter from "./routes/course.route";
import layoutRouter from "./routes/layout.route";
import newsletterRoute from "./routes/newsletter.route";
import notificationRouter from "./routes/notification.route";
import orderRouter from "./routes/order.route";
import userRouter from "./routes/user.route";
import { validateEnv } from "./utils/validateEnv";

export const app = express();

//body parser
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
//testing api
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
//routes
app.use(
  "/api/v1/",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter,
  newsletterRoute,
  contactRoute
);
app.use("/api/newsletter", newsletterRoute);
app.use("/api/contact", contactRoute);

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

//unknown routes
// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//   const err = new Error(`Route not found: ${req.originalUrl}`) as any;
//   err.statusCode = 404;
//   next(err);
// });
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route not found: ${req.originalUrl}`) as any;
  err.statusCode = 404;
  next(err);
});
//error middleware
app.use(ErrorMiddleware);

validateEnv();
