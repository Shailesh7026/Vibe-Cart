import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, getCategories } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import useResponsive from '../hooks/useResponsive';
import { getCart } from '../api/cartApi';

const Products = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { isMobile } = useResponsive();
    const observer = useRef();

    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    const lastProductRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Reset products and page when filters/search params change
    useEffect(() => {
        // Store the current scroll position
        const scrollPosition = window.scrollY;
        
        setProducts([]);
        setHasMore(true);
        setPage(1);

        // Restore scroll position after state updates
        requestAnimationFrame(() => {
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant'
            });
        });
    }, [category, searchParams.toString(), search]);

    // Fetch products whenever `page` or filters/search change
    useEffect(() => {
        let isMounted = true;
        const fetchProducts = async () => {
            try {
                if (page === 1) setLoading(true);
                const data = await getProducts({
                    page,
                    limit: 8,
                    categories: category,
                    minPrice: searchParams.get('minPrice'),
                    maxPrice: searchParams.get('maxPrice'),
                    search: search
                });

                if (!isMounted) return;

                if (page === 1) {
                    setProducts(data.products || []);
                    // Restore scroll to top only on filter/search changes
                    if (category || search) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                } else {
                    setProducts((prev) => [...(prev || []), ...(data.products || [])]);
                }

                // use the API-provided flag if available, otherwise infer
                if (typeof data.hasMoreProducts === 'boolean') {
                    setHasMore(data.hasMoreProducts);
                } else if (data.pagination) {
                    setHasMore(data.pagination.currentPage < data.pagination.totalPages);
                } else {
                    // Fallback: if returned less than limit, no more
                    setHasMore((data.products || []).length === 8);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();
        
        return () => {
            isMounted = false;
        };
    }, [page, category, searchParams.toString(), search]);

    const filteredProducts = Array.isArray(products) && !loading
        ? products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        ) : [];

    const handleFilterChange = ({ type, value }) => {
        // Handle filter changes here
        console.log(type, value);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
                {/* Filters - Desktop */}
                <div className="hidden md:block w-64">
                    <Filters
                        categories={categories}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Mobile Filter Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="fixed bottom-4 right-4 z-10 bg-primary text-white p-4 rounded-full shadow-lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                        </svg>
                    </button>
                </div>

                {/* Products Header */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}</h1>
                        
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.public_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                ref={
                                    index === filteredProducts.length - 1
                                        ? lastProductRef
                                        : null
                                }
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>

                    {loading && <Loader />}
                    
                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-10">
                            <h3 className="text-lg text-gray-600">No products found</h3>
                        </div>
                    )}

                    {!loading && !hasMore && filteredProducts.length > 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-600">No more products to load</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        key="filter-container"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        className="fixed left-0 top-0 h-full w-full"
                    >
                        <div 
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={() => setIsFilterOpen(false)}
                        />
                        <div className="relative w-80 h-full bg-white z-50 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Filters</h2>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <Filters
                                categories={categories}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;