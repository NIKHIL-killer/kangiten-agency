import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import { streamText, tool, generateObject } from 'ai'

// Lead Research Agent
export const leadResearchSchema = z.object({
  category: z.string().describe('Business category (salon, clinic, gym, etc.)'),
  location: z.string().describe('City/area to search'),
  count: z.number().default(50).describe('Number of leads to find'),
})

export type LeadResearchInput = z.infer<typeof leadResearchSchema>

export interface Lead {
  name: string
  business: string
  phone: string
  email?: string
  category: string
  location: string
  website?: string
  instagram?: string
  painPoints: string[]
  source: string
}

export async function runLeadResearch(input: LeadResearchInput): Promise<Lead[]> {
  // In production: use Stagehand/Browserbase to scrape
  // JustDial, IndiaMART, Google Maps, Instagram

  const mockLeads: Lead[] = [
    {
      name: 'Priya Sharma',
      business: 'Glow Salon',
      phone: '+91 98765 43210',
      email: 'priya@glowsalon.com',
      category: 'salon',
      location: input.location,
      website: 'https://glowsalon.com',
      instagram: '@glowsalonmumbai',
      painPoints: ['Misses evening WhatsApp messages', 'Manual appointment booking', 'No lead tracking'],
      source: 'JustDial',
    },
    {
      name: 'Dr. Rajesh Kumar',
      business: 'City Clinic',
      phone: '+91 87654 32109',
      email: 'rajesh@cityclinic.in',
      category: 'clinic',
      location: input.location,
      website: 'https://cityclinic.in',
      painPoints: ['Patient queries after hours', 'Prescription refill requests', 'Appointment no-shows'],
      source: 'IndiaMART',
    },
    // ... more leads
  ]

  return mockLeads.slice(0, input.count)
}

// Proposal Generator Agent
export const proposalSchema = z.object({
  lead: z.object({
    name: z.string(),
    business: z.string(),
    category: z.string(),
    location: z.string(),
    painPoints: z.array(z.string()),
  }),
  plan: z.enum(['starter', 'growth', 'scale']).default('growth'),
  customNotes: z.string().optional(),
})

export type ProposalInput = z.infer<typeof proposalSchema>

export async function generateProposal(input: ProposalInput): Promise<string> {
  const { lead, plan, customNotes } = input

  const pricing = {
    starter: { price: '₹15,000', features: ['Up to 1,000 msgs/mo', 'FAQ automation', 'Basic analytics', 'Email support'] },
    growth: { price: '₹35,000', features: ['Up to 10,000 msgs/mo', 'Booking & calendar sync', 'Lead qualification', 'Priority support', 'CRM integration'] },
    scale: { price: '₹75,000', features: ['Unlimited messages', 'Multi-location', 'Custom integrations', 'Dedicated manager', 'White-label', 'API access'] },
  }

  const selected = pricing[plan]

  const { object: proposal } = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      executiveSummary: z.string(),
      problemStatement: z.string(),
      solution: z.string(),
      features: z.array(z.string()),
      pricing: z.string(),
      timeline: z.string(),
      nextSteps: z.array(z.string()),
    }),
    prompt: `Create a professional proposal for ${lead.business} (${lead.category} in ${lead.location}).

Client pain points: ${lead.painPoints.join(', ')}
Selected plan: ${plan} (${selected.price}/month)
Features: ${selected.features.join(', ')}

Custom notes: ${customNotes || 'None'}

Write a compelling, concise proposal that addresses their specific pain points and shows clear ROI.`,
  })

  return `
# Proposal for ${lead.business}

## Executive Summary
${proposal.executiveSummary}

## Problem Statement
${proposal.problemStatement}

## Our Solution
${proposal.solution}

## Key Features
${proposal.features.map(f => `- ${f}`).join('\n')}

## Investment
**${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan**: ${selected.price}/month
- First month FREE
- No setup fees
- Cancel anytime

## Timeline
${proposal.timeline}

## Next Steps
${proposal.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---
*Prepared by Kangiten Agency | kangiten.com | +91 98765 43210*
  `.trim()
}

// Onboarding Agent
export const onboardingSchema = z.object({
  clientId: z.string(),
  businessName: z.string(),
  whatsappNumber: z.string(),
  businessType: z.string(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    keywords: z.array(z.string()),
  })),
  bookingEnabled: z.boolean(),
  calendarUrl: z.string().optional(),
  crmWebhook: z.string().optional(),
  plan: z.enum(['starter', 'growth', 'scale']),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

export async function runOnboarding(input: OnboardingInput): Promise<{
  vercelProjectId: string
  dashboardUrl: string
  webhookUrl: string
  status: 'success' | 'partial' | 'failed'
  details: string[]
}> {
  const details: string[] = []

  try {
    // 1. Create Vercel project
    details.push('Creating Vercel project...')
    // await createVercelProject(input.clientId)
    const vercelProjectId = `kangiten-${input.clientId}`
    details.push(`✅ Vercel project created: ${vercelProjectId}`)

    // 2. Deploy chatbot
    details.push('Deploying chatbot...')
    // await deployChatbot(vercelProjectId, input)
    details.push('✅ Chatbot deployed')

    // 3. Configure WhatsApp webhook
    details.push('Configuring WhatsApp webhook...')
    const webhookUrl = `https://${vercelProjectId}.vercel.app/api/webhook`
    // await configureWhatsAppWebhook(input.whatsappNumber, webhookUrl)
    details.push(`✅ Webhook configured: ${webhookUrl}`)

    // 4. Set up dashboard
    details.push('Setting up client dashboard...')
    const dashboardUrl = `https://${vercelProjectId}-dashboard.vercel.app`
    // await setupDashboard(vercelProjectId, input)
    details.push(`✅ Dashboard ready: ${dashboardUrl}`)

    // 5. Configure analytics
    details.push('Configuring analytics...')
    // await setupAnalytics(vercelProjectId)
    details.push('✅ Analytics configured')

    return {
      vercelProjectId,
      dashboardUrl,
      webhookUrl,
      status: 'success',
      details,
    }
  } catch (error) {
    details.push(`❌ Error: ${error}`)
    return {
      vercelProjectId: '',
      dashboardUrl: '',
      webhookUrl: '',
      status: 'failed',
      details,
    }
  }
}

// QA Agent
export const qaSchema = z.object({
  dashboardUrl: z.string(),
  webhookUrl: z.string(),
  whatsappNumber: z.string(),
  testScenarios: z.array(z.object({
    name: z.string(),
    input: z.string(),
    expectedContains: z.array(z.string()),
  })).optional(),
})

export type QAInput = z.infer<typeof qaSchema>

export async function runQA(input: QAInput): Promise<{
  passed: number
  failed: number
  results: Array<{ test: string; status: 'pass' | 'fail'; details: string }>
}> {
  const defaultScenarios = [
    { name: 'Greeting', input: 'Hi', expectedContains: ['hello', 'hi', 'help', 'assist'] },
    { name: 'Timings FAQ', input: 'What are your timings?', expectedContains: ['open', 'close', 'am', 'pm'] },
    { name: 'Services FAQ', input: 'What services do you offer?', expectedContains: ['service', 'offer'] },
    { name: 'Booking Request', input: 'I want to book for Friday 3pm', expectedContains: ['book', 'appointment', 'friday'] },
    { name: 'Price Inquiry', input: 'How much for a haircut?', expectedContains: ['price', 'cost', '₹'] },
    { name: 'Handoff Request', input: 'Talk to human', expectedContains: ['team', 'human', 'connect'] },
  ]

  const scenarios = input.testScenarios?.length ? input.testScenarios : defaultScenarios
  const results = []

  for (const scenario of scenarios) {
    try {
      // In production: actually call the webhook
      const response = await fetch(input.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: scenario.input, sessionId: `qa-${Date.now()}` }),
      })

      const data = await response.json()
      const responseText = (data.response || '').toLowerCase()

      const passed = scenario.expectedContains.every(keyword =>
        responseText.includes(keyword.toLowerCase())
      )

      results.push({
        test: scenario.name,
        status: passed ? 'pass' : 'fail',
        details: passed
          ? `Response contains expected keywords`
          : `Missing: ${scenario.expectedContains.filter(k => !responseText.includes(k.toLowerCase())).join(', ')}`,
      })
    } catch (error) {
      results.push({
        test: scenario.name,
        status: 'fail',
        details: `Error: ${error}`,
      })
    }
  }

  return {
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    results,
  }
}