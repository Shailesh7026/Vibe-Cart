import { createContext, useContext, useState, useEffect } from 'react';
import * as cartApi from '../api/cartApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const result = await cartApi.getCart();
      setCart(result);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err.message);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    try {

      // Check if item already exists in cart
      const existingItem = cart.items.find(item => item.public_id === productId);
       await cartApi.addToCart(productId, existingItem ? existingItem.qty + quantity : quantity);

       fetchCart();
      
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      
        await cartApi.removeFromCart(productId);

      // call get cart to change cart state
      await cartApi.getCart();

      fetchCart();
      

    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      setError(err.message);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      // We only have addToCart API, we'll use that for updates
      await cartApi.addToCart(productId, quantity);
      
      // call get cart to change cart state
      await cartApi.getCart();

      fetchCart();

    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      fetchCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.message);
    }
  };



  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};