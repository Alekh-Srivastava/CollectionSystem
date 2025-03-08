import { ProductStatus } from "@prisma/client";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  status: ProductStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
