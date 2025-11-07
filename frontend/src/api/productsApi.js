import axiosClient from './axiosClient';

export const getProducts = async ({
  page = 1,
  limit = 10,
  categories,
  minPrice,
  maxPrice,
  search,
  includeOutOfStock = false
} = {}) => {
  try {
    const params = {
      page,
      limit,
      ...(categories && { categories: Array.isArray(categories) ? categories.join(',') : categories }),
      ...(minPrice !== undefined && { minPrice }),
      ...(maxPrice !== undefined && { maxPrice }),
      ...(search && { search }),
      includeOutOfStock
    };

    const response = await axiosClient.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const getCategories = async () => {
  try {
    // Don't have api for categories yet send static data
    const categories = ['electronics', "men's clothing", 'jewelery', 'pet supplies'];
    
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};