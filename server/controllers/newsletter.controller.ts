import ejs from "ejs";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import NewsletterSubscriber from "../models/newsletter.model";
import sendMail from "../utils/sendMail";

// Subscribe to newsletter
export const subscribeNewsletter = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email)
        return res
          .status(400)
          .json({ success: false, message: "Email is required." });
      const exists = await NewsletterSubscriber.findOne({ email });
      if (exists)
        return res
          .status(409)
          .json({ success: false, message: "Already subscribed." });
      await NewsletterSubscriber.create({ email });
      return res
        .status(201)
        .json({ success: true, message: "Subscribed successfully." });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
  }
);

// Get all subscribers (admin only)
export const getAllSubscribers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Replace with real admin check
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Forbidden" });
    const subscribers = await NewsletterSubscriber.find().select(
      "email createdAt -_id"
    );
    return res.status(200).json({ success: true, subscribers });
  }
);

// Send email to subscribers (admin only)
export const sendNewsletterEmail = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Replace with real admin check
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Forbidden" });

    const { subject, message, emails } = req.body;
    if (!subject || !message || !emails || !Array.isArray(emails)) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields." });
    }

    try {
      // Send email to each subscriber using the sendMail utility
      const emailPromises = emails.map((email) =>
        sendMail({
          email,
          subject,
          template: "newsletter.ejs",
          data: { subject, message },
        })
      );

      await Promise.all(emailPromises);

      return res.status(200).json({ success: true, message: "Email(s) sent." });
    } catch (error) {
      console.error("Newsletter send error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send email." });
    }
  }
);
