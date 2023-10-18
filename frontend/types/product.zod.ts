import { z } from "zod";

const URLRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

// ------------------------------------------------------
// ZOD схемы для продукта
export const Product = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().min(0),
  discountPercentage: z.number().min(0).max(100),
  rating: z.number().min(0).max(5).default(0),
  stock: z.number().min(0).default(0),
  brand: z.string(),
  category: z.string(), // TODO: Нужен ли enum?
  thumbnail: z.string().regex(URLRegex),
  images: z.array(z.string().regex(URLRegex)),
});
export type Product = z.infer<typeof Product>;

export const ProductWithId = Product.extend({ id: z.number() });
export type ProductWithId = z.infer<typeof ProductWithId>;

// ------------------------------------------------------
// ZOD схемы для базы данных
export const ProductDB = z.object({
  products: z.array(ProductWithId),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});
export type ProductDB = z.infer<typeof ProductDB>;
