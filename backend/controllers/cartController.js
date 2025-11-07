import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.cartToken;
    const cart = await CartItem.findOne({ userId })
      .populate({
        path: 'products.productId',
        model: 'Product',
        localField: 'products.productId',
        foreignField: 'public_id'
      });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        items: [],
        total: 0
      });
    }

    // Total calculation for cart items
    const total = cart.products.reduce(
      (acc, { productId, qty }) => acc + (productId.price * qty),
      0
    );

    // Format products to unwrap productId
    const formattedItems = cart.products.map(item => ({
      ...item.productId._doc,
      qty: item.qty,
      _id: item._id
    }));

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully", 
      items: formattedItems,
      total
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.cartToken;
    const { productId, qty } = req.body;

    // Check for valid product via public_id
    const product = await Product.findOne({ public_id: productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with ID: " + productId,
      });
    }

    let cart = await CartItem.findOne({ userId });

    // Create cart if not exists
    if (!cart) {
      cart = await CartItem.create({
        userId,
        products: [{ productId: product.public_id, qty: qty || 1 }],
      });
    } else {
      // Check if product already in cart
      const existingProduct = cart.products.find(
        (p) => p.productId === product.public_id
      );

      if (existingProduct) {
        // Overwrite quantity if product exists this can be use to update (increment/decrement) quantity as well
        existingProduct.qty = qty;
      } else {
        cart.products.push({ productId: product.public_id, qty: qty || 1 });
      }

      await cart.save();
    }

    // Now populate the products after saving
    await cart.populate({
      path: 'products.productId',
      model: 'Product',
      localField: 'products.productId',
      foreignField: 'public_id'
    });

    // Add qty in products fields
    const formattedProducts = cart.products.map((item) => ({
      ...item.productId._doc,
      qty: item.qty,
    }));

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart: {
        _id: cart._id,
        userId: cart.userId,
        products: formattedProducts,
      },
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.cartToken;
    const productId = req.params.productId;

    const cart = await CartItem.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.products = cart.products.filter(
      p => p.productId.toString() !== productId
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      cart
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.cartToken;
    const cart = await CartItem
      .findOneAndUpdate(
        { userId },
        { $set: { products: [] } },
        { new: true }
      );
    res.json({
      success: true,
      message: "Cart cleared",
      cart
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

