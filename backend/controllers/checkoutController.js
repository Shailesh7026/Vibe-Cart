import CartItem from "../models/CartItem.js";

export const checkout = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.cartToken;
    const { name, email } = req.body;

    const cart = await CartItem.findOne({ userId })
      .populate({
        path: 'products.productId',
        model: 'Product',
        localField: 'products.productId',
        foreignField: 'public_id'
      });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    // Format items so populated product docs include qty
    const formattedItems = cart.products.map((item) => {
      const prodDoc = item.productId && item.productId._doc ? item.productId._doc : (typeof item.productId === 'string' ? { public_id: item.productId } : {});
      return {
        ...prodDoc,
        qty: item.qty
      };
    });

    // Calculate total safely (handles missing price)
    const total = formattedItems.reduce(
      (sum, p) => sum + ((p.price || 0) * p.qty),
      0
    );

    // Remove cart after checkout
    await CartItem.deleteOne({ userId });

    res.status(200).json({
      success: true,
      message: "Checkout successful",
      receipt: {
        name,
        email,
        items: formattedItems,
        total,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
