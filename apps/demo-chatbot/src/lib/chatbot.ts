import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool, CoreMessage } from 'ai'
import { z } from 'zod'

export interface ClientConfig {
  id: string
  name: string
  businessType: 'salon' | 'clinic' | 'gym' | 'real-estate' | 'restaurant' | 'auto-repair' | 'custom'
  whatsappNumber: string
  systemPrompt: string
  faqs: FAQ[]
  bookingEnabled: boolean
  calendarUrl?: string
  crmWebhook?: string
  model: 'gpt-4o' | 'claude-3-5-sonnet'
  temperature: number
  maxTokens: number
}

export interface FAQ {
  question: string
  answer: string
  keywords: string[]
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

// Default system prompt template
export function buildSystemPrompt(config: ClientConfig): string {
  const basePrompt = `You are an AI assistant for ${config.name}, a ${config.businessType.replace('-', ' ')} business.

Your role:
- Answer customer questions accurately using the provided FAQ
- Help customers book appointments when booking is enabled
- Capture lead information (name, phone, email, service interest)
- Be friendly, professional, and concise
- Never make up information - if unsure, offer to connect with a human

Business Details:
- Name: ${config.name}
- Type: ${config.businessType}
- WhatsApp: ${config.whatsappNumber}
${config.calendarUrl ? `- Booking: ${config.calendarUrl}` : ''}

FAQ Knowledge Base:
${config.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

Guidelines:
1. Always greet new conversations warmly
2. Use the FAQ to answer common questions
3. For booking requests, collect: preferred date/time, service type, customer name/contact
4. For lead capture, ask for: name, phone, email, what they're looking for
5. If you can't help, say: "Let me connect you with our team who can assist better."
6. Keep responses under 160 characters when possible (WhatsApp limit)
7. Use emojis sparingly and professionally`

  return basePrompt
}

// Tools for the AI
export const tools = {
  bookAppointment: tool({
    description: 'Book an appointment for the customer',
    parameters: z.object({
      customerName: z.string().describe('Full name of the customer'),
      phone: z.string().describe('Phone number with country code'),
      email: z.string().email().optional().describe('Email address if provided'),
      service: z.string().describe('Service or treatment requested'),
      preferredDate: z.string().describe('Preferred date (YYYY-MM-DD)'),
      preferredTime: z.string().describe('Preferred time (HH:MM 24hr format)'),
      notes: z.string().optional().describe('Any special requests or notes'),
    }),
    execute: async (args) => {
      // In production: integrate with Calendly, Google Calendar, or custom booking system
      console.log('Booking appointment:', args)
      return {
        success: true,
        bookingId: `BK-${Date.now()}`,
        confirmation: `Your appointment for ${args.service} on ${args.preferredDate} at ${args.preferredTime} is confirmed! Booking ID: BK-${Date.now()}`,
      }
    },
  }),

  captureLead: tool({
    description: 'Capture lead information for follow-up',
    parameters: z.object({
      name: z.string().describe('Full name'),
      phone: z.string().describe('Phone number with country code'),
      email: z.string().email().optional().describe('Email address'),
      interest: z.string().describe('What they are interested in'),
      source: z.string().default('whatsapp').describe('Lead source'),
      urgency: z.enum(['low', 'medium', 'high']).default('medium').describe('Urgency level'),
    }),
    execute: async (args) => {
      // In production: send to CRM, database, or webhook
      console.log('Capturing lead:', args)
      return {
        success: true,
        leadId: `LD-${Date.now()}`,
        message: 'Thanks! Our team will reach out within 30 minutes.',
      }
    },
  }),

  checkAvailability: tool({
    description: 'Check available time slots for a service',
    parameters: z.object({
      service: z.string().describe('Service name'),
      date: z.string().describe('Date to check (YYYY-MM-DD)'),
    }),
    execute: async (args) => {
      // In production: query actual calendar/booking system
      const mockSlots = ['09:00', '10:30', '14:00', '15:30', '17:00']
      return {
        available: mockSlots,
        date: args.date,
        service: args.service,
      }
    },
  }),

  handoffToHuman: tool({
    description: 'Transfer conversation to a human agent',
    parameters: z.object({
      reason: z.string().describe('Reason for handoff'),
      summary: z.string().describe('Conversation summary for the human agent'),
      priority: z.enum(['low', 'medium', 'high']).default('medium'),
    }),
    execute: async (args) => {
      console.log('Handoff to human:', args)
      return {
        success: true,
        ticketId: `TK-${Date.now()}`,
        message: 'I\'ve connected you with our team. They\'ll be with you shortly.',
      }
    },
  }),
}

export async function generateResponse(
  messages: CoreMessage[],
  config: ClientConfig
) {
  const model = config.model === 'gpt-4o'
    ? openai('gpt-4o')
    : anthropic('claude-3-5-sonnet-20241022')

  const enabledTools = {
    ...tools,
    // Conditionally enable tools based on config
    ...(config.bookingEnabled ? { bookAppointment: tools.bookAppointment, checkAvailability: tools.checkAvailability } : {}),
    captureLead: tools.captureLead,
    handoffToHuman: tools.handoffToHuman,
  }

  const result = streamText({
    model,
    system: buildSystemPrompt(config),
    messages,
    tools: enabledTools,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
  })

  return result
}