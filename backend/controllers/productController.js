import Product from "../models/Product.js";
import fs from "fs";
import CustomError from "../utils/CustomError.js";

export const getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const categories = req.query.categories;
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice);
        const search = req.query.search || "";
        const includeOutOfStock = req.query.includeOutOfStock === 'true';

        let query = {};

        // Price range filter
        if (minPrice && maxPrice) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) {
            query.price = { $gte: minPrice };
        } else if (maxPrice) {
            query.price = { $lte: maxPrice };
        }

        // Categories filter
        if (categories) {
            query.category = { $in: categories.split(',') };
        }

        // Name search
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Stock filter
        if (!includeOutOfStock) {
            query.stock = { $gt: 0 };
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        let products = await Product.find(query)
            .skip(skip)
            .limit(limit);

        // if (products.length === 0 && page === 1) {
        //  TODO :- if products not found i can implement to get data from fakestore api and add data dynamically   
        // }

        // Get total count for pagination
        const count = await Product.countDocuments(query);
        const hasMoreProducts = (page * limit) < count;

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            length: products.length,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
            },
            hasMoreProducts,
            products: products,
        });

    } catch (error) {
        console.error(error);
        const customError = new CustomError("Error fetching products", 500);
        return next(customError);
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, stock, images } = req.body;

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            stock,
            images
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(
            {
                success: true,
                message: "Product added successfully",
                product: savedProduct
            }
        );

    } catch (error) {
        console.error(error);
        const customError = new CustomError("Error adding products", 500);
        return next(customError);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const publicId = req.params.publicId;

        const product = await Product.findOne({ public_id: publicId });

        if (!product) {

            res.status(404).json({
                success: false,
                message: "Product not found"
            });

            return;
        }

        await Product.findOneAndDelete({ public_id: publicId });

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error(error);
        const customError = new CustomError("Error deleting product", 500);
        return next(customError);
    }
};


