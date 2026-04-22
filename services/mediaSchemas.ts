import { z } from 'zod';

export const MediaSchema = z.object({
  _id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  media_url: z.string().url('Invalid URL').or(z.string().min(1)),
  type: z.enum(['video', 'audio', 'document', 'other']).default('video'),
  category_id: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      name: z.string(),
    })
  ]).optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  isLive: z.boolean().default(false),
  isActive: z.boolean().default(true),
  duration: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  is_downloadable: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateMediaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  media_url: z.string().min(1, 'Media URL is required'),
  type: z.enum(['video', 'audio', 'document', 'other']),
  category_id: z.string().optional(),
  thumbnail: z.string().optional(),
  isLive: z.boolean(),
  author: z.string().optional(),
  duration: z.string().optional(),
  is_downloadable: z.boolean(),
});

export const UpdateMediaSchema = CreateMediaSchema.partial();

export type Media = z.infer<typeof MediaSchema>;
export type CreateMediaRequest = z.infer<typeof CreateMediaSchema>;
export type UpdateMediaRequest = z.infer<typeof UpdateMediaSchema>;
