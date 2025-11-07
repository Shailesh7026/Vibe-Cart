import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.public_id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative pb-[100%]">
        <img
          src={product.images[0]} // Using the first image from the images array
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="text-sm text-gray-500 mb-2">
          Stock: {product.stock}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(product.price)}
          </span>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;