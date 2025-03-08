import { ProductStatus, ReviewStatus } from "@prisma/client";
import { Product } from "./product"; // Adjust the import path as necessary

export type CollectionType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  banner_url: string | null;
  display_order: number;
  is_featured: boolean;
  status: ProductStatus;
  type_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  marketing_images: string[];
  type?: CollectionType;
  creator?: User;
  products?: CollectionProduct[];
  _count?: {
    products: number;
  };
};

export type CollectionReview = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  banner_url: string | null;
  display_order: number;
  is_featured: boolean;
  status: ReviewStatus;
  type_id: string;
  created_by: string;
  reviewer_notes: string | null;
  created_at: Date;
  updated_at: Date;
  marketing_images: string[];
  type?: CollectionType;
  creator?: User;
  products?: CollectionReviewProduct[];
  _count?: {
    products: number;
  };
};

export type CollectionProduct = {
  id: string;
  collection_id: string;
  product_id: string;
  display_order: number;
  product?: Product;
};

export type CollectionReviewProduct = {
  id: string;
  collection_review_id: string;
  product_id: string;
  display_order: number;
  product?: Product;
};

export type User = {
  id: string;
  name: string | null;
  email: string | null;
};

export type CollectionFormData = {
  name: string;
  description: string;
  type_id: string;
  is_featured: boolean;
  image_url?: string;
  banner_url?: string;
  marketing_images?: string[];
  product_ids: string[];
};
