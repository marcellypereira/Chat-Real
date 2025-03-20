import { z } from 'zod';

// Validação de número de telefone
export const phoneSchema = z
  .string()
  .min(10, 'Número de telefone inválido')
  .max(15, 'Número de telefone inválido')
  .regex(/^\+?[0-9]+$/, 'Número deve conter apenas dígitos');

// Validação de mensagem
export const messageSchema = z
  .string()
  .min(1, 'A mensagem não pode estar vazia')
  .max(1000, 'A mensagem é muito longa');

// Validação do chat
export const chatSchema = z.object({
  id: z.string(),
  contactName: z.string().optional(),
  phoneNumber: phoneSchema,
  lastMessage: z.string().optional(),
  messages: z
    .array(
      z.object({
        id: z.string(),
        content: z.string(),
        sender: z.enum(['user', 'agent']),
        timestamp: z.date(),
        formattedTimestamp: z.string(),
      }),
    )
    .optional()
    .default([]),
  status: z.enum(['pending', 'active', 'finished']),
  receivedAt: z.date().optional(),
  attendedAt: z.date().optional(),
  finishedAt: z.date().optional(),
  formattedTime: z
    .object({
      received: z.string().optional(),
      attended: z.string().optional(),
      finished: z.string().optional(),
    })
    .optional(),
  waitTime: z.number().optional(),
  attendTime: z.number().optional(),
});
