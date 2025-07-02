import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import Contact from "../models/contact.model";
import sendMail from "../utils/sendMail";
import User from "../models/user.model";

// User submits a contact form
export const submitContact = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    await Contact.create({ name, email, message });
    res
      .status(201)
      .json({ success: true, message: "Query submitted successfully." });
  }
);

// Admin gets all contact queries
export const getAllContacts = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    
    if (!req.user ) {
      //fetch user from database
      const user = await User.findById(id);
      if (!user) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      req.user = user;
    }
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  }
);

// Admin answers a query (sends email and marks as answered)
export const answerContact = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const { id } = req.params;
    const { answerText } = req.body;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Query not found." });
    }
    if (!answerText) {
      return res
        .status(400)
        .json({ success: false, message: "Answer text is required." });
    }
    // Send reply email
    await sendMail({
      email: contact.email,
      subject: "Your Query Has Been Answered",
      template: "question-reply.ejs",
      data: {
        name: contact.name,
        question: contact.message,
        answer: answerText,
      },
    });
    contact.answered = true;
    contact.answerText = answerText;
    await contact.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Answer sent and query marked as answered.",
      });
  }
);
