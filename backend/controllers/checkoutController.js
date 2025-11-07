import CartItem from "../models/CartItem.js";

export const checkout = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.cartToken;
    const { name, email } = req.body;

    const cart = await CartItem.findOne({ userId })
      .populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const total = cart.products.reduce(
      (sum, { productId, qty }) => sum + (productId.price * qty),
      0
    );


    // Delete Cart
    await CartItem.deleteOne({ userId });

    //In future add Order record here

    res.status(200).json({
      success: true,
      message: "Checkout successful",
      receipt: {
        name,
        email,
        items: cart.products,
        total,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
