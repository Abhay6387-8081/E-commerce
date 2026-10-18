import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const checkoutSchema = z.object({
  fullName:z.string().min(2,'Full name is required.'),
  phone:z.string().min(10,'Enter a valid phone number.'),
  line1:z.string().min(5,'Address is required.'),
  city:z.string().min(2,'City is required.'),
  state:z.string().min(2,'State is required'),
  pincode:z.string().regex(/^\d{6}$/,'Enter a valid 6-digit PIN code.')
})