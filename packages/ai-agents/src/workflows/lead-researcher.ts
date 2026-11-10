import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { generateObject, streamText, tool } from 'ai'

// ===========================================
// TYPES & SCHEMAS
// ===========================================

export const LeadResearchInputSchema = z.object({
  category: z.string().describe('Business category (salon, clinic, gym, real-estate, restaurant, auto-repair)'),
  location: z.string().describe('City/area to search'),
  count: z.number().default(20).describe('Number of leads to find'),
  sources: z.array(z.enum(['justdial', 'indiamart', 'google-maps', 'instagram', 'linkedin'])).default(['justdial', 'indiamart', 'google-maps']),
})

export type LeadResearchInput = z.infer<typeof LeadResearchInputSchema>

export interface Lead {
  name: string
  business: string
  phone: string
  email?: string
  category: string
  location: string
  website?: string
  instagram?: string
  linkedin?: string
  whatsappNumber?: string
  hasWhatsAppWidget: boolean
  painPoints: string[]
  source: string
  confidence: number // 1-10
  employeeCount?: string
  establishedYear?: number
}

export interface EnrichedLead extends Lead {
  decisionMaker?: {
    name: string
    role: string
    linkedin?: string
  }
  techStack?: string[]
  recentActivity?: string
  outreachAngle: string
  personalizedHook: string
}

// ===========================================
// PAIN POINT TEMPLATES BY CATEGORY
// ===========================================

const PAIN_POINTS_BY_CATEGORY: Record<string, string[]> = {
  salon: [
    'Misses evening/weekend WhatsApp messages from clients',
    'Manual appointment booking via phone calls',
    'No automated reminders → high no-show rate',
    'Can\'t capture leads from Instagram/WhatsApp ads',
    'Staff overwhelmed during peak hours',
  ],
  clinic: [
    'Patient queries after hours (prescriptions, appointments)',
    'Manual appointment scheduling → double bookings',
    'Prescription refill requests overwhelm staff',
    'No automated follow-up for missed appointments',
    'WhatsApp Business but no auto-replies configured',
  ],
  gym: [
    'Missed membership inquiries on WhatsApp',
    'Class booking confusion → member complaints',
    'No automated renewal reminders',
    'Trial class leads not followed up',
    'Staff can\'t handle peak inquiry volume',
  ],
  'real-estate': [
    'Slow response to property inquiries → lost deals',
    'Viewing scheduling chaos (back-and-forth messages)',
    'Document follow-up delays',
    'No lead qualification → wasted site visits',
    'Multiple agents using personal WhatsApp',
  ],
  restaurant: [
    'Missed reservation requests on WhatsApp',
    'Delivery order errors via manual WhatsApp',
    'Menu/price inquiries during busy hours',
    'No automated order confirmation',
    'Catering/party booking leads lost',
  ],
  'auto-repair': [
    'Missed service/repair inquiries',
    'Estimate delays → customers go elsewhere',
    'Parts availability questions unanswered',
    'No appointment booking system',
    'Follow-up for periodic maintenance missing',
  ],
}

// ===========================================
// MOCK DATA GENERATOR (Replace with real scraping)
// ===========================================

function generateMockLeads(input: LeadResearchInput): Lead[] {
  const templates = {
    salon: [
      { name: 'Priya Sharma', business: 'Glow Salon & Spa', phone: '+91 98765 43210', email: 'priya@glowsalon.com', website: 'https://glowsalon.com', instagram: '@glowsalonmumbai', employeeCount: '5-10', establishedYear: 2019 },
      { name: 'Anjali Mehta', business: 'Style Studio', phone: '+91 87654 32109', email: 'anjali@stylestudio.in', website: 'https://stylestudio.in', instagram: '@stylestudio.delhi', employeeCount: '10-20', establishedYear: 2021 },
      { name: 'Ritu Singh', business: 'Bliss Beauty Bar', phone: '+91 76543 21098', email: 'ritu@blissbeauty.com', website: 'https://blissbeauty.com', instagram: '@blissbeautybar', employeeCount: '2-5', establishedYear: 2022 },
    ],
    clinic: [
      { name: 'Dr. Rajesh Kumar', business: 'City Multi-Specialty Clinic', phone: '+91 98765 43211', email: 'rajesh@cityclinic.in', website: 'https://cityclinic.in', employeeCount: '50-100', establishedYear: 2015 },
      { name: 'Dr. Meera Patel', business: 'Family Care Clinic', phone: '+91 87654 32110', email: 'meera@familycare.com', website: 'https://familycare.com', employeeCount: '10-20', establishedYear: 2018 },
      { name: 'Dr. Amit Shah', business: 'Shah Dental & Orthodontics', phone: '+91 76543 21099', email: 'amit@shahdental.com', website: 'https://shahdental.com', employeeCount: '5-10', establishedYear: 2020 },
    ],
    gym: [
      { name: 'Suresh Reddy', business: 'FitZone Gym', phone: '+91 98765 43212', email: 'suresh@fitzone.gym', website: 'https://fitzone.gym', instagram: '@fitzonegym', employeeCount: '10-20', establishedYear: 2019 },
      { name: 'Vikram Singh', business: 'Iron Paradise Fitness', phone: '+91 87654 32111', email: 'vikram@ironparadise.com', website: 'https://ironparadise.com', employeeCount: '20-50', establishedYear: 2017 },
      { name: 'Neha Gupta', business: 'Core Strength Studio', phone: '+91 76543 21097', email: 'neha@corestrength.in', website: 'https://corestrength.in', employeeCount: '2-5', establishedYear: 2022 },
    ],
    'real-estate': [
      { name: 'Amit Patel', business: 'Patel Realty Group', phone: '+91 98765 43213', email: 'amit@patelrealty.com', website: 'https://patelrealty.com', employeeCount: '100+', establishedYear: 2010 },
      { name: 'Rohit Agarwal', business: 'Agarwal Properties', phone: '+91 87654 32112', email: 'rohit@agarwalprops.in', website: 'https://agarwalprops.in', employeeCount: '20-50', establishedYear: 2016 },
      { name: 'Kavya Nair', business: 'Nair Homes', phone: '+91 76543 21096', email: 'kavya@nairhomes.com', website: 'https://nairhomes.com', employeeCount: '10-20', establishedYear: 2019 },
    ],
    restaurant: [
      { name: 'Anita Desai', business: 'Tasty Bites Cafe', phone: '+91 98765 43214', email: 'anita@tastybites.in', website: 'https://tastybites.in', instagram: '@tastybitescafe', employeeCount: '10-20', establishedYear: 2018 },
      { name: 'Rajesh Iyer', business: 'Spice Route Restaurant', phone: '+91 87654 32113', email: 'rajesh@spiceroute.com', website: 'https://spiceroute.com', instagram: '@spiceroute', employeeCount: '50-100', establishedYear: 2015 },
      { name: 'Meera Joshi', business: 'Green Leaf Bistro', phone: '+91 76543 21095', email: 'meera@greenleaf.in', website: 'https://greenleaf.in', employeeCount: '5-10', establishedYear: 2021 },
    ],
    'auto-repair': [
      { name: 'Suresh Kumar', business: 'Kumar Auto Care', phone: '+91 98765 43215', email: 'suresh@kumarauto.in', website: 'https://kumarauto.in', employeeCount: '10-20', establishedYear: 2016 },
      { name: 'Ramesh Yadav', business: 'Yadav Motors', phone: '+91 87654 32114', email: 'ramesh@yadavmotors.com', website: 'https://yadavmotors.com', employeeCount: '20-50', establishedYear: 2012 },
      { name: 'Deepak Singh', business: 'Singh Car Clinic', phone: '+91 76543 21094', email: 'deepak@singhcarclinic.in', website: 'https://singhcarclinic.in', employeeCount: '5-10', establishedYear: 2019 },
    ],
  }

  const categoryTemplates = templates[input.category as keyof typeof templates] || templates.salon
  const painPoints = PAIN_POINTS_BY_CATEGORY[input.category] || PAIN_POINTS_BY_CATEGORY.salon

  const leads: Lead[] = []
  const sources = input.sources

  for (let i = 0; i < Math.min(input.count, categoryTemplates.length * sources.length); i++) {
    const template = categoryTemplates[i % categoryTemplates.length]
    const source = sources[i % sources.length]

    // Simulate WhatsApp widget detection
    const hasWhatsAppWidget = Math.random() > 0.3
    const whatsappNumber = hasWhatsAppWidget ? template.phone.replace(' ', '').replace('+91 ', '+91') : undefined

    leads.push({
      ...template,
      category: input.category,
      location: input.location,
      whatsappNumber,
      hasWhatsAppWidget,
      painPoints: painPoints.sort(() => 0.5 - Math.random()).slice(0, 3),
      source,
      confidence: Math.floor(Math.random() * 3) + 7, // 7-10
    })
  }

  return leads
}

// ===========================================
// AI ENRICHMENT AGENT
// ===========================================

const ENRICHMENT_PROMPT = `You are a B2B sales intelligence agent for Kangiten Agency, an AI WhatsApp chatbot company targeting local businesses in India.

Given a lead, generate:
1. A personalized outreach angle (why now, why them)
2. A specific hook referencing their business
3. Likely decision maker info
4. Recent activity signals

Be specific, mention real details from their business. Use Indian business context.`

async function enrichLead(lead: Lead, model: 'openai' | 'anthropic' = 'openai'): Promise<EnrichedLead> {
  const selectedModel = model === 'openai' ? openai('gpt-4o') : anthropic('claude-3-5-sonnet-20241022')

  const { object: enrichment } = await generateObject({
    model: selectedModel,
    schema: z.object({
      decisionMaker: z.object({
        name: z.string(),
        role: z.string(),
        linkedin: z.string().optional(),
      }).optional(),
      techStack: z.array(z.string()).optional(),
      recentActivity: z.string().optional(),
      outreachAngle: z.string(),
      personalizedHook: z.string(),
    }),
    system: ENRICHMENT_PROMPT,
    prompt: `
Lead Details:
- Name: ${lead.name}
- Business: ${lead.business}
- Category: ${lead.category}
- Location: ${lead.location}
- Website: ${lead.website || 'N/A'}
- Instagram: ${lead.instagram || 'N/A'}
- Employee Count: ${lead.employeeCount || 'Unknown'}
- Established: ${lead.establishedYear || 'Unknown'}
- Has WhatsApp Widget: ${lead.hasWhatsAppWidget ? 'Yes' : 'No'}
- Pain Points: ${lead.painPoints.join(', ')}
- Source: ${lead.source}

Generate enrichment for cold outreach.
    `,
  })

  return {
    ...lead,
    ...enrichment,
    outreachAngle: enrichment.outreachAngle,
    personalizedHook: enrichment.personalizedHook,
  }
}

// ===========================================
// MAIN WORKFLOW
// ===========================================

export async function runLeadResearch(input: LeadResearchInput): Promise<EnrichedLead[]> {
  console.log(`🔍 Researching ${input.count} ${input.category} leads in ${input.location}...`)

  // Step 1: Generate/find leads (replace with real scraping later)
  const rawLeads = generateMockLeads(input)
  console.log(`📋 Found ${rawLeads.length} raw leads`)

  // Step 2: Enrich with AI
  console.log('🤖 Enriching leads with AI...')
  const enrichedLeads: EnrichedLead[] = []

  for (const lead of rawLeads) {
    try {
      const enriched = await enrichLead(lead)
      enrichedLeads.push(enriched)
      console.log(`✅ Enriched: ${lead.business}`)
    } catch (error) {
      console.error(`❌ Failed to enrich ${lead.business}:`, error)
      enrichedLeads.push({
        ...lead,
        outreachAngle: `We help ${lead.category}s in ${lead.location} automate WhatsApp`,
        personalizedHook: `Hi ${lead.name}, saw ${lead.business} on ${lead.source}...`,
      })
    }
  }

  // Step 3: Sort by confidence & WhatsApp presence
  enrichedLeads.sort((a, b) => {
    const aScore = a.confidence + (a.hasWhatsAppWidget ? 2 : 0)
    const bScore = b.confidence + (b.hasWhatsAppWidget ? 2 : 0)
    return bScore - aScore
  })

  console.log(`✨ Research complete. Top ${Math.min(5, enrichedLeads.length)} leads ready for outreach.`)
  return enrichedLeads
}

// ===========================================
// EXPORT TO CSV FOR OUTREACH TOOL
// ===========================================

export function leadsToCSV(leads: EnrichedLead[]): string {
  const headers = [
    'name', 'phone', 'email', 'business', 'category', 'location',
    'source', 'hasWhatsAppWidget', 'whatsappNumber', 'painPoints',
    'outreachAngle', 'personalizedHook', 'confidence', 'website',
    'instagram', 'employeeCount', 'establishedYear'
  ]

  const rows = leads.map(lead => [
    lead.name,
    lead.phone,
    lead.email || '',
    lead.business,
    lead.category,
    lead.location,
    lead.source,
    lead.hasWhatsAppWidget ? 'Yes' : 'No',
    lead.whatsappNumber || '',
    lead.painPoints.join('; '),
    lead.outreachAngle,
    lead.personalizedHook,
    lead.confidence.toString(),
    lead.website || '',
    lead.instagram || '',
    lead.employeeCount || '',
    lead.establishedYear?.toString() || '',
  ])

  return [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n')
}

// ===========================================
// CLI
// ===========================================

if (require.main === module) {
  const args = process.argv.slice(2)
  const input: LeadResearchInput = {
    category: args[0] || 'salon',
    location: args[1] || 'Mumbai',
    count: parseInt(args[2]) || 10,
  }

  runLeadResearch(input)
    .then(leads => {
      const csv = leadsToCSV(leads)
      const fs = require('fs')
      const filename = `leads-${input.category}-${input.location}-${Date.now()}.csv`
      fs.writeFileSync(filename, csv)
      console.log(`\n📄 Saved to ${filename}`)
      console.log('\nTop 3 leads:')
      leads.slice(0, 3).forEach((lead, i) => {
        console.log(`${i + 1}. ${lead.business} (${lead.confidence}/10) - ${lead.personalizedHook}`)
      })
    })
    .catch(console.error)
}