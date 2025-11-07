import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { assignCartToken } from "./utils/assignCartToken.js";


import CustomError from "./utils/CustomError.js";
import errorController from "./utils/errorController.js";
import productRoutes from "./routers/productRoutes.js"; 
import cartRoutes from "./routers/cartRoutes.js";
import checkoutRoutes from "./routers/checkoutRoutes.js"
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(assignCartToken); // This will assign cartTemp token which help to identify cart for guest users (persistent cart)

// TODO:-  if times remains implement middleware for user authentication for protected routes (Like checkout) , and replace this cartTemp token with userid after login

// APP ROUTES
app.get("/", (req, res) => {
  res.send("App is running...");
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/checkout" , checkoutRoutes);

// Catch all unmatched routes and forward to error handler
app.use((req, res, next) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(errorController);

// start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// In case of unhandled promise rejections: shut down the server gracefully
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err && err.name, err && err.message);
  console.error("Shutting down server due to unhandled promise rejection...");
  server.close(() => {
    process.exit(1);
  });
});
