import express from "express";
import {
  answerContact,
  getAllContacts,
  submitContact,
} from "../controllers/contact.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

// User submits a contact form
router.post("/contact", submitContact);

// Admin gets all contact queries
router.get("/contacts", isAuthenticated, authorizeRoles("admin"), getAllContacts);

// Admin answers a query
router.post(
  "/contact/:id/answer",
  isAuthenticated,
  authorizeRoles("admin"),
  answerContact
);

export default router;
