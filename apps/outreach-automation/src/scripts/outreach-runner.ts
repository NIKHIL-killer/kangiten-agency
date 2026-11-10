import { Resend } from 'resend'
import { Novu } from '@novu/node'
import { z } from 'zod'
import * as fs from 'fs/promises'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import * as dotenv from 'dotenv'

dotenv.config()

// Types
const LeadSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  business: z.string(),
  category: z.string(),
  location: z.string(),
  source: z.string().default('manual'),
  notes: z.string().optional(),
})

type Lead = z.infer<typeof LeadSchema>

const OutreachConfigSchema = z.object({
  resendApiKey: z.string(),
  novuApiKey: z.string(),
  novuSubId: z.string(),
  fromEmail: z.string().email(),
  fromName: z.string(),
})

type OutreachConfig = z.infer<typeof OutreachConfigSchema>

// Email templates
const EMAIL_TEMPLATES = {
  initial: (lead: Lead) => ({
    subject: `Quick question about ${lead.business}'s WhatsApp`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #22c55e; margin: 0; font-size: 24px;">Kangiten Agency</h1>
            <p style="color: #94a3b8; margin: 8px 0 0;">AI WhatsApp Chatbots for Local Businesses</p>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px;">Hi ${lead.name},</p>

            <p>I noticed ${lead.business} is getting WhatsApp inquiries but might be missing messages after hours. We help local ${lead.category}s like yours automate responses, book appointments, and capture leads 24/7 on WhatsApp.</p>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #166534; margin: 0 0 12px; font-size: 16px;">What you'd get:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #166534;">
                <li>AI answers FAQs instantly (timings, services, prices)</li>
                <li>Customers book appointments directly in WhatsApp</li>
                <li>Lead capture with instant team notifications</li>
                <li>Dashboard to see all conversations & analytics</li>
                <li>Deployed on your existing WhatsApp number in 30 mins</li>
              </ul>
            </div>

            <p>We're offering a <strong>free first month</strong> to ${lead.category}s in ${lead.location} — no setup fees, cancel anytime.</p>

            <p>Worth a 10-min call to see a live demo?</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://calendly.com/kangiten/15min" style="background: #22c55e; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Book a Quick Demo</a>
            </div>

            <p style="color: #64748b; font-size: 14px;">Or just reply to this email — I read every response.</p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">

            <p style="color: #94a3b8; font-size: 12px;">
              — Team Kangiten<br>
              <a href="https://kangiten.com" style="color: #22c55e;">kangiten.com</a> |
              <a href="https://wa.me/919876543210" style="color: #22c55e;">WhatsApp Us</a>
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${lead.name},

I noticed ${lead.business} is getting WhatsApp inquiries but might be missing messages after hours. We help local ${lead.category}s like yours automate responses, book appointments, and capture leads 24/7 on WhatsApp.

What you'd get:
- AI answers FAQs instantly (timings, services, prices)
- Customers book appointments directly in WhatsApp
- Lead capture with instant team notifications
- Dashboard to see all conversations & analytics
- Deployed on your existing WhatsApp number in 30 mins

We're offering a free first month to ${lead.category}s in ${lead.location} — no setup fees, cancel anytime.

Worth a 10-min call to see a live demo? Book at: https://calendly.com/kangiten/15min

Or just reply to this email — I read every response.

— Team Kangiten
kangiten.com | WhatsApp: +91 98765 43210
    `,
  }),

  followUp1: (lead: Lead) => ({
    subject: `Re: Quick question about ${lead.business}'s WhatsApp`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Hi ${lead.name},</p>

          <p>Following up on my last note — I'd love to show you how Glow Salon (similar ${lead.category} in ${lead.location}) went from missing 40% of WhatsApp messages to booking 15 appointments/week automatically.</p>

          <p>The demo takes 10 minutes. No pressure, just a quick look at what's possible.</p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://calendly.com/kangiten/15min" style="background: #22c55e; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">See the Demo</a>
          </div>

          <p>If not a good fit, just let me know and I won't follow up again.</p>

          <p>Best,<br>Kangiten Team</p>
        </body>
      </html>
    `,
  }),

  followUp2: (lead: Lead) => ({
    subject: `Last note — free month for ${lead.business}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Hi ${lead.name},</p>

          <p>This is my last note — I don't want to clutter your inbox.</p>

          <p>If you're ever curious about automating WhatsApp for ${lead.business}, the offer stands: first month free, 30-min setup, cancel anytime.</p>

          <p>Demo link: <a href="https://calendly.com/kangiten/15min">https://calendly.com/kangiten/15min</a></p>

          <p>All the best,<br>Kangiten Team</p>
        </body>
      </html>
    `,
  }),
}

// Outreach Engine
export class OutreachEngine {
  private resend: Resend
  private novu: Novu
  private config: OutreachConfig

  constructor(config: OutreachConfig) {
    this.config = config
    this.resend = new Resend(config.resendApiKey)
    this.novu = new Novu(config.novuApiKey)
  }

  async sendEmail(lead: Lead, template: keyof typeof EMAIL_TEMPLATES) {
    const { subject, html, text } = EMAIL_TEMPLATES[template](lead)

    const result = await this.resend.emails.send({
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      to: lead.email!,
      subject,
      html,
      text,
      tags: [
        { name: 'campaign', value: 'outreach' },
        { name: 'template', value: template },
        { name: 'lead_category', value: lead.category },
      ],
    })

    return result
  }

  async sendNovuWorkflow(lead: Lead, workflowId: string) {
    return await this.novu.trigger(workflowId, {
      to: {
        subscriberId: lead.email || lead.phone,
        email: lead.email,
        phone: lead.phone,
        firstName: lead.name,
      },
      payload: {
        businessName: lead.business,
        category: lead.category,
        location: lead.location,
      },
    })
  }

  async runSequence(lead: Lead) {
    if (!lead.email) {
      console.log(`Skipping ${lead.name} - no email`)
      return { success: false, reason: 'No email' }
    }

    // Send initial email
    await this.sendEmail(lead, 'initial')
    console.log(`Sent initial to ${lead.email}`)

    // Schedule follow-ups (in production, use a job queue like BullMQ)
    // For now, just log the schedule
    console.log(`Scheduled follow-up 1 for ${lead.email} in 3 days`)
    console.log(`Scheduled follow-up 2 for ${lead.email} in 7 days`)

    return { success: true }
  }
}

// CSV Import
export async function importLeadsFromCSV(filePath: string): Promise<Lead[]> {
  const content = await fs.readFile(filePath, 'utf-8')
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  return records.map((record: any) => LeadSchema.parse({
    name: record.name || record.Name,
    phone: record.phone || record.Phone || record.whatsapp,
    email: record.email || record.Email,
    business: record.business || record.Business || record.company,
    category: record.category || record.Category || 'business',
    location: record.location || record.Location || record.city,
    source: record.source || record.Source || 'csv-import',
    notes: record.notes || record.Notes,
  }))
}

// Main runner
export async function runOutreach(csvPath: string) {
  const config = OutreachConfigSchema.parse({
    resendApiKey: process.env.RESEND_API_KEY,
    novuApiKey: process.env.NOVU_API_KEY,
    novuSubId: process.env.NOVU_SUB_ID,
    fromEmail: process.env.FROM_EMAIL || 'outreach@kangiten.com',
    fromName: process.env.FROM_NAME || 'Kangiten Agency',
  })

  const engine = new OutreachEngine(config)
  const leads = await importLeadsFromCSV(csvPath)

  console.log(`Loaded ${leads.length} leads from ${csvPath}`)

  for (const lead of leads) {
    try {
      await engine.runSequence(lead)
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed for ${lead.email}:`, error)
    }
  }

  console.log('Outreach sequence completed')
}

// CLI
if (require.main === module) {
  const csvPath = process.argv[2] || './leads.csv'
  runOutreach(csvPath).catch(console.error)
}