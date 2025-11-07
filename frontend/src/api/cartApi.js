import axiosClient from './axiosClient';

export const getCart = async () => {
  try {
    const response = await axiosClient.get('/cart/items');
    return response.data;
    
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart');
  }
};

export const addToCart = async (productId, qty = 1) => {
  try {
    const response = await axiosClient.post('/cart/items', {
      productId,
      qty
    });
    
    if (!response.data?.cart?.products) {
      throw new Error('Invalid response from server');
    }
    return {
      items: response.data.cart.products,
      message: response.data.message
    };
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to add item to cart');
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await axiosClient.delete(`/cart/items/${productId}`);
    if (!response.data?.cart?.products) {
      return { items: [] };
    }
    return {
      items: response.data.cart.products,
      message: response.data.message
    };
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
  }
};

export const updateCartItemQuantity = async (productId, quantity) => {
  try {
    const response = await axiosClient.patch(`/cart/items/${productId}`, {
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update cart item quantity:', error);
    throw new Error(error.response?.data?.message || 'Failed to update cart item quantity');
  }
};

export const clearCart = async () => {
  try {
    const response = await axiosClient.delete('/cart');
    return response.data;
  } catch (error) {
    console.error('Failed to clear cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to clear cart');
  }
};

export const checkoutCart = async (name,email) => {
  try {
    const response = await axiosClient.post('/checkout',{
        name: name || "Test User",
        email:email || "Test@email.in"
    });

    return response.data;
  } catch (error) {
    console.error('Failed to checkout cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to checkout cart');
  }
};
