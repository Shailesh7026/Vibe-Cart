import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Filters = ({ categories }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const currentCategory = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || priceRange[0];
  const maxPrice = searchParams.get('maxPrice') || priceRange[1];

  const handleCategoryClick = (category) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (category) {
      newSearchParams.set('category', category);
    } else {
      newSearchParams.delete('category');
    }
    setSearchParams(newSearchParams);
  };

  const handlePriceChange = (min, max) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('minPrice', min);
    newSearchParams.set('maxPrice', max);
    setSearchParams(newSearchParams);
    setPriceRange([min, max]);
  };

  useEffect(() => {
    setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
  }, [minPrice, maxPrice]);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick('')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              currentCategory === ''
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            All Products
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                currentCategory === category
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <span>to</span>
            <div className="flex-1">
              <input
                type="number"
                min={priceRange[0]}
                max="10000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="relative pt-1">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-2 bg-primary rounded-full"
                style={{
                  left: `${(priceRange[0] / 10000) * 100}%`,
                  right: `${100 - (priceRange[1] / 10000) * 100}%`
                }}
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;