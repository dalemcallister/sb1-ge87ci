import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  expiryDate: z.date().min(new Date(), 'Expiry date must be in the future'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  storageConditions: z.string().min(1, 'Storage conditions are required'),
});

export type ProductFormData = z.infer<typeof productSchema>;