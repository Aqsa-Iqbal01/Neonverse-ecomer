import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const checkoutSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, "Your cart is empty"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const adminProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().min(1, "Description is required").max(3000),
  price: z.number().int().positive("Price must be a positive amount"),
  category: z.string().trim().min(1, "Category is required").max(60),
  imageUrl: z.string().trim().min(1, "Image is required"),
  stock: z.number().int().min(0, "Stock can't be negative").max(100000),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1).max(40),
  tagline: z.string().trim().min(1).max(80),
  logoUrl: z.string().trim().max(500).optional().or(z.literal("")),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
