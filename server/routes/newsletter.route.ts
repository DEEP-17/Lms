import express from "express";
import {
  getAllSubscribers,
  sendNewsletterEmail,
  subscribeNewsletter,
} from "../controllers/newsletter.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/newsletter/subscribe", subscribeNewsletter);
router.get(
  "/newsletter/subscribers",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllSubscribers
);
router.post(
  "/newsletter/send",
  isAuthenticated,
  authorizeRoles("admin"),
  sendNewsletterEmail
);

export default router;
