import { z } from 'zod';

export const baseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export const startNodeSchema = baseSchema.extend({
  metadata: z.array(z.object({ key: z.string().min(1, 'Key required'), value: z.string() })).optional().default([]),
});

export const taskNodeSchema = baseSchema.extend({
  description: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  customFields: z.array(z.object({ key: z.string(), value: z.string() })).optional().default([]),
});

export const approvalNodeSchema = baseSchema.extend({
  approverRole: z.enum(['Manager', 'HRBP', 'Director']),
  autoApproveThreshold: z.number().optional().nullable(),
});

export const automatedNodeSchema = baseSchema.extend({
  actionId: z.string().min(1, 'Action is required'),
  params: z.record(z.string(), z.any()).optional().default({}),
});

export const endNodeSchema = baseSchema.extend({
  endMessage: z.string().optional(),
  isSummary: z.boolean().default(false),
});
