// Product-related type definitions for the admin system

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: {
    $numberDecimal: string;
  };
  category: string;
  imageUrl?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: {
    $numberDecimal: string;
  };
  category: string;
  imageUrl?: string;
  stock: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductsResponse {
  data: Product[];
  message: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  data: Product;
  message: string;
}

// Product categories - common categories for church products/merchandise
export const PRODUCT_CATEGORIES = [
  'Books',
  'Music/Audio',
  'Apparel',
  'Accessories',
  'Home & Office',
  'Events/Tickets',
  'Digital Products',
  'Gifts',
  'Ministry Resources',
  'Other'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Product status for filtering
export type ProductStatus = 'all' | 'active' | 'inactive' | 'lowStock' | 'outOfStock';

export interface ProductFilters {
  category?: string;
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventory: number;
  totalValue: number;
}