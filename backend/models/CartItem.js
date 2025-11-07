import mongoose from "mongoose";
import { generatePublicId } from "../utils/idGenerator.js";

const cartItemSchema = new mongoose.Schema({
  public_id: {
    type: String,
    unique: true,
    default: () => generatePublicId("crt"),
  },
  userId: {
    type: String,// Represents either a TempCartToken (guest user) or userId (logged in user)  
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'User ID is required'
    }
  },
  products: [{
    // Relation to Product model using public_id
    productId: {
      type: String,
      required: true,
      ref: 'Product',
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Product ID is required'
      }
    },
    qty: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: function (v) {
          return Number.isInteger(v);
        },
        message: 'Quantity must be a whole number'
      }
    }
  }],
}, {
  timestamps: true,
});

export default mongoose.model("CartItem", cartItemSchema);
