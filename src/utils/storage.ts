import { Product } from '../types';

const STORAGE_KEY = 'product-management-app-data';

// Load products from localStorage
export const loadProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsedData = JSON.parse(data);
    
    // Convert string dates back to Date objects
    return parsedData.map((product: any) => ({
      ...product,
      creacion: new Date(product.creacion)
    }));
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
    return [];
  }
};

// Save products to localStorage
export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};