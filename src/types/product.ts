import type { User } from './user';

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  status: 'SELLING' | 'RESERVED' | 'SOLD';
  images: string[];
  sellerId: number;
  seller: User;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductRequest = {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export type UpdateProductRequest = {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  status?: 'SELLING' | 'RESERVED' | 'SOLD';
  images?: string[];
}

export type ProductFilter = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'SELLING' | 'RESERVED' | 'SOLD';
  sortBy?: 'latest' | 'price-low' | 'price-high' | 'views';
  page?: number;
  size?: number;
}
