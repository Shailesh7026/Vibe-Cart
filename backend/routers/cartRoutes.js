import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/items", getCart);
router.post("/items", addToCart);
router.delete("/items/:productId", removeFromCart);
router.delete("/items", clearCart);

export default router;
