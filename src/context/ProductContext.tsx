import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Product, SortField, SortDirection, SortOption } from '../types';
import { loadProducts, saveProducts } from '../utils/storage';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  sortOption: SortOption;
}

type ProductAction =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: number }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_SORT'; payload: SortOption };

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  searchTerm: '',
  sortOption: { field: 'creacion', direction: 'desc' },
};

const ProductContext = createContext<{
  state: ProductState;
  addProduct: (product: Omit<Product, 'creacion'>) => void;
  deleteProduct: (codigo: number) => void;
  searchProducts: (term: string) => void;
  sortProducts: (field: SortField, direction?: SortDirection) => void;
} | undefined>(undefined);

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const newProducts = [...state.products, action.payload];
      return {
        ...state,
        products: newProducts,
        filteredProducts: filterAndSortProducts(
          newProducts,
          state.searchTerm,
          state.sortOption
        ),
      };
    }
    case 'DELETE_PRODUCT': {
      const newProducts = state.products.filter(
        (product) => product.codigo !== action.payload
      );
      return {
        ...state,
        products: newProducts,
        filteredProducts: filterAndSortProducts(
          newProducts,
          state.searchTerm,
          state.sortOption
        ),
      };
    }
    case 'SET_SEARCH': {
      return {
        ...state,
        searchTerm: action.payload,
        filteredProducts: filterAndSortProducts(
          state.products,
          action.payload,
          state.sortOption
        ),
      };
    }
    case 'SET_SORT': {
      return {
        ...state,
        sortOption: action.payload,
        filteredProducts: filterAndSortProducts(
          state.products,
          state.searchTerm,
          action.payload
        ),
      };
    }
    default:
      return state;
  }
};

const filterAndSortProducts = (
  products: Product[],
  searchTerm: string,
  sortOption: SortOption
): Product[] => {
  // Filter products by search term
  let result = searchTerm
    ? products.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [...products];

  // Sort products
  result.sort((a, b) => {
    const field = sortOption.field;
    const direction = sortOption.direction === 'asc' ? 1 : -1;

    if (field === 'codigo' || field === 'cantidad') {
      return (a[field] - b[field]) * direction;
    } else if (field === 'nombre') {
      return a[field].localeCompare(b[field]) * direction;
    } else if (field === 'creacion') {
      return (
        (new Date(a[field]).getTime() - new Date(b[field]).getTime()) * direction
      );
    }
    return 0;
  });

  return result;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(productReducer, {
    ...initialState,
    products: loadProducts(),
    filteredProducts: filterAndSortProducts(
      loadProducts(),
      '',
      initialState.sortOption
    ),
  });

  useEffect(() => {
    saveProducts(state.products);
  }, [state.products]);

  const addProduct = (productData: Omit<Product, 'creacion'>) => {
    const newProduct: Product = {
      ...productData,
      creacion: new Date(),
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const deleteProduct = (codigo: number) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: codigo });
  };

  const searchProducts = (term: string) => {
    dispatch({ type: 'SET_SEARCH', payload: term });
  };

  const sortProducts = (field: SortField, direction?: SortDirection) => {
    const newDirection = direction || 
      (state.sortOption.field === field 
        ? (state.sortOption.direction === 'asc' ? 'desc' : 'asc')
        : 'asc');
    
    dispatch({
      type: 'SET_SORT',
      payload: { field, direction: newDirection },
    });
  };

  return (
    <ProductContext.Provider
      value={{ state, addProduct, deleteProduct, searchProducts, sortProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};