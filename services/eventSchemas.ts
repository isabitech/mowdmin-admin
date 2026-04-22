import { z } from 'zod';

export const EventTypeSchema = z.enum([
  'Crusade',
  'Baptism',
  'Conference',
  'Service',
  'Prayer',
  'Other',
]);

export const EventSchema = z.object({
  _id: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  date: z.string(),
  time: z.string(),
  location: z.string().min(2, 'Location is required'),
  type: EventTypeSchema,
  image: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  registeredCount: z.number().int().nonnegative().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(2, 'Location is required'),
  type: EventTypeSchema,
  capacity: z.number().int().positive().optional(),
  image: z.any().optional(), // File type is handled in FormData
});

export const UpdateEventSchema = CreateEventSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type Event = z.infer<typeof EventSchema>;
export type CreateEventRequest = z.infer<typeof CreateEventSchema>;
export type UpdateEventRequest = z.infer<typeof UpdateEventSchema>;
export type EventType = z.infer<typeof EventTypeSchema>;
