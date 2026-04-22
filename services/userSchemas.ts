import { z } from 'zod';

const UserStatusSchema = z.enum(['active', 'inactive', 'suspended']);

const AdminUserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  isAdmin: z.boolean(),
  isVerified: z.boolean(),
  role: z.string().optional(),
  status: UserStatusSchema.optional().default('active'),
  lastLogin: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const AdminUserListSchema = z.array(AdminUserSchema);

const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  isAdmin: z.boolean().optional(),
  status: UserStatusSchema.optional(),
});
type AdminUserSchema = z.infer<typeof AdminUserSchema>;
type UpdateUserSchema = z.infer<typeof UpdateUserSchema>;
type UserStatusSchema = z.infer<typeof UserStatusSchema>;

export { AdminUserSchema, AdminUserListSchema, UpdateUserSchema, UserStatusSchema, };