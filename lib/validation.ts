import { z } from 'zod';

export const collectionFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  type_id: z.string().min(1, { message: 'Collection type is required' }),
  is_featured: z.boolean().default(false),
  image_url: z.string().optional(),
  banner_url: z.string().optional(),
  marketing_images: z.array(z.string()).default([]),
  product_ids: z.array(z.string()).min(1, { message: 'At least one product is required' }),
});

export type CollectionFormValues = z.infer<typeof collectionFormSchema>;
