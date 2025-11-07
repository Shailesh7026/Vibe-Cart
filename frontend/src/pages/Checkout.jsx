import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { fakeLogin } from '../api/authApi';
import { checkoutCart } from '../api/cartApi';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const total = cart.total;

  const handleSubmit = (e) => {
    e.preventDefault();
    fakeLogin(formData);
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const handleContinueShopping = () => {
    clearCart();
    navigate('/products');
  };


  if (cart.items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {step === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

            {/* Order Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.public_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-gray-600">
                          Quantity: {item.qty}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                onClick={checkoutCart(formData.name,formData.email)}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Continue to Payment
              </button>
            </form>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-semibold">Processing your payment...</h2>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-semibold mb-4">
              Order placed successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase, {formData.name}!
              <br />
              Order confirmation has been sent to {formData.email}
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;