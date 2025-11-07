import mongoose from "mongoose";
import { generatePublicId } from "../utils/idGenerator.js";

const productSchema = new mongoose.Schema({
    public_id: {
        type: String,
        unique: true,
        default: () => generatePublicId("prod"),
    },
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    description: { 
        type: String 
    },
    category: { 
        type: String, 
        default: "Uncategorized" 
    },
    stock: { 
        type: Number, 
        default: 0 
    },
    images: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length <= 5 && v.every(url => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url));
            },
            message: 'Images must be valid URLs (jpg/jpeg/png/gif/webp) and maximum 5 images allowed'
        }
    }
}, {
    timestamps: true,
});

export default mongoose.model("Product", productSchema);
