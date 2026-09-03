/** Shared types across client + server. */

export type Category = string;

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Price in cents. */
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
}

export interface CartItem {
  id: string; // product id
  slug: string;
  name: string;
  price: number; // cents
  imageUrl: string;
  quantity: number;
  stock: number;
  category: string;
}

export interface OrderItemDto {
  id: string;
  productId: string | null;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface OrderDto {
  id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  items: OrderItemDto[];
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
}

export type CheckoutInputItem = {
  id: string;
  quantity: number;
};
