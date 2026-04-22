import api from './authService';
import { endpoints } from '@/constant/endpoints';
import {
  Product,
  CreateProductRequest as CreateProductData,
  UpdateProductRequest as UpdateProductData
} from '@/services/productSchemas';
// Keeping ProductFilters and others from old file if they are still needed
import {
  ProductsResponse,
  ProductResponse,
  ProductFilters,
  ProductStats
} from '@/constant/productTypes';

class ProductService {
  // Get all products
  async getProducts(filters?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.category) params.append('category', filters.category);
        if (filters.search) {
          params.append('search', filters.search);
          params.append('q', filters.search);
        }
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.status && filters.status !== 'all') {
          switch (filters.status) {
            case 'lowStock':
              params.append('lowStock', 'true');
              break;
            case 'outOfStock':
              params.append('stock', '0');
              break;
          }
        }
      }

      const response = await api.get(`${endpoints.products.list}?${params.toString()}`);

      // ✅ Cast to any to handle different response shapes
      const apiData = response.data as any;
      let products: Product[] = [];

      if (Array.isArray(apiData.data)) {
        products = apiData.data;
      } else if (Array.isArray(apiData)) {
        products = apiData;
      }

      // Determine total count
      const limit = 10;
      const total =
        apiData?.total ??
        apiData?.totalCount ??
        apiData?.pagination?.total ??
        apiData?.data?.total ??
        (products.length === (filters?.limit || limit) ? (filters?.page || 1) * (filters?.limit || limit) + 1 : products.length);

      // ✅ Transform price for the UI
      const transformedProducts = products.map((p: any) => ({
        ...p,
        price: typeof p.price === 'object' && p.price?.$numberDecimal
          ? parseFloat(p.price.$numberDecimal)
          : (typeof p.price === 'number' ? p.price : 0)
      }));

      return {
        data: transformedProducts,
        total,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
      };
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching products. Please try again later.');
      }
      throw error;
    }
  }

  // Get single product
  async getProduct(id: string): Promise<ProductResponse> {
    try {
      const response = await api.get<ProductResponse>(
        `${endpoints.products.list}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching product. Please try again later.');
      }
      throw error;
    }
  }

  // Create new product
  async createProduct(productData: CreateProductData): Promise<ProductResponse> {
    try {
      const response = await api.post<ProductResponse>(
        endpoints.products.create,
        productData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while creating product. Please try again later.');
      }
      throw error;
    }
  }

  // Update existing product
  async updateProduct(id: string, productData: UpdateProductData): Promise<ProductResponse> {
    try {
      const response = await api.put<ProductResponse>(
        `${endpoints.products.list}/${id}`,
        productData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while updating product. Please try again later.');
      }
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(
        `${endpoints.products.list}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while deleting product. Please try again later.');
      }
      throw error;
    }
  }

  // Toggle product status (active/inactive)
  async toggleProductStatus(id: string, isActive: boolean): Promise<ProductResponse> {
    const response = await api.patch<ProductResponse>(
      `${endpoints.products.list}/${id}/status`,
      { isActive }
    );
    return response.data;
  }

  // Update product stock
  async updateStock(id: string, stock: number): Promise<ProductResponse> {
    try {
      const response = await api.patch<ProductResponse>(
        `${endpoints.products.list}/${id}/stock`,
        { stock }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while updating product stock. Please try again later.');
      }
      throw error;
    }
  }

  // Get product statistics
  async getProductStats(): Promise<ProductStats> {
    try {
      const response = await api.get<ProductStats>(
        `${endpoints.products.list}/stats`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching product statistics. Please try again later.');
      }
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateProducts(
    productIds: string[],
    updates: Partial<CreateProductData>
  ): Promise<{ message: string; updatedCount: number }> {
    const response = await api.patch<{ message: string; updatedCount: number }>(
      `${endpoints.products.list}/bulk-update`,
      { productIds, updates }
    );
    return response.data;
  }

  // Bulk delete products
  async bulkDeleteProducts(productIds: string[]): Promise<{ message: string; deletedCount: number }> {
    const response = await api.delete<{ message: string; deletedCount: number }>(
      `${endpoints.products.list}/bulk-delete`,
      { data: { productIds } }
    );
    return response.data;
  }

  // Get low stock products
  async getLowStockProducts(threshold: number = 10): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>(
      `${endpoints.products.list}/low-stock?threshold=${threshold}`
    );
    return response.data;
  }

  // Search products
  async searchProducts(query: string): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>(
      `${endpoints.products.list}/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>(
      `${endpoints.products.list}/category/${encodeURIComponent(category)}`
    );
    return response.data;
  }
}

export const productService = new ProductService();