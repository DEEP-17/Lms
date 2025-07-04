import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders, newPayment, sendStripePublishableKey } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);

orderRouter.get("/get-all-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

orderRouter.get("/payment/stripePublishableKey", isAuthenticated, sendStripePublishableKey);

orderRouter.post("/payment", isAuthenticated, newPayment);


export default orderRouter;