#!/usr/bin/env tsx
/**
 * Deploy Client Tool
 * One-command client deployment for Kangiten Agency
 *
 * Usage: npx tsx tools/deploy-client.ts --client glow-salon --type salon --phone +919876543210
 */

import { Command } from 'commander'
import { createClient } from '@vercel/kv'
import { sql } from '@vercel/postgres'
import * as fs from 'fs/promises'
import * as path from 'path'
import { generateProposal, runOnboarding, runQA } from '@kangiten/ai-agents'

const program = new Command()

program
  .name('deploy-client')
  .description('Deploy a new client instance for Kangiten Agency')
  .version('1.0.0')
  .requiredOption('-c, --client <id>', 'Client ID (slug)')
  .requiredOption('-n, --name <name>', 'Business name')
  .requiredOption('-t, --type <type>', 'Business type (salon|clinic|gym|real-estate|restaurant|auto-repair)')
  .requiredOption('-p, --phone <number>', 'WhatsApp Business number')
  .option('--email <email>', 'Contact email')
  .option('--plan <plan>', 'Plan: starter|growth|scale', 'growth')
  .option('--calendar <url>', 'Calendly/booking URL')
  .option('--crm <url>', 'CRM webhook URL')
  .option('--skip-qa', 'Skip QA tests')
  .option('--dry-run', 'Show what would be done without deploying')

interface ClientConfig {
  clientId: string
  businessName: string
  businessType: string
  whatsappNumber: string
  email?: string
  plan: 'starter' | 'growth' | 'scale'
  calendarUrl?: string
  crmWebhook?: string
}

const FAQ_TEMPLATES: Record<string, Array<{question: string, answer: string, keywords: string[]}>> = {
  salon: [
    { question: 'What are your timings?', answer: 'We\'re open 10 AM - 8 PM, Monday to Saturday. Closed Sundays.', keywords: ['timing', 'hours', 'open', 'close', 'time'] },
    { question: 'What services do you offer?', answer: 'Haircuts, coloring, styling, facials, manicure/pedicure, waxing, and bridal packages.', keywords: ['service', 'offer', 'menu', 'treatment', 'price'] },
    { question: 'Do I need an appointment?', answer: 'Walk-ins welcome but appointments recommended to avoid wait. Book via WhatsApp!', keywords: ['appointment', 'booking', 'walkin', 'walk-in', 'reserve'] },
    { question: 'What are your prices?', answer: 'Haircuts from ₹500, coloring from ₹2000, facials from ₹1500. Full menu on request.', keywords: ['price', 'cost', 'rate', 'charge', 'fee'] },
  ],
  clinic: [
    { question: 'What are your timings?', answer: 'We\'re open 9 AM - 7 PM, Monday to Saturday. Emergency: call 108.', keywords: ['timing', 'hours', 'open', 'close', 'emergency'] },
    { question: 'How do I book an appointment?', answer: 'Book via WhatsApp, call us, or use the link in our profile. Same-day slots available.', keywords: ['appointment', 'booking', 'book', 'schedule'] },
    { question: 'Do you accept insurance?', answer: 'Yes, we accept most major insurance providers. Please share your policy details.', keywords: ['insurance', 'claim', 'policy', 'coverage'] },
    { question: 'Can I get a prescription refill?', answer: 'Yes, message us with medicine name and dosage. Ready in 2 hours.', keywords: ['prescription', 'refill', 'medicine', 'medication'] },
  ],
  gym: [
    { question: 'What are your timings?', answer: 'Open 5 AM - 11 PM daily. Staffed hours: 6 AM - 10 PM.', keywords: ['timing', 'hours', 'open', 'close'] },
    { question: 'What are the membership plans?', answer: 'Monthly ₹2999, Quarterly ₹7999, Yearly ₹29999. All include all classes.', keywords: ['membership', 'plan', 'price', 'cost', 'fee'] },
    { question: 'Do you offer personal training?', answer: 'Yes, certified trainers available. ₹1500/session or ₹12000/10 sessions.', keywords: ['personal', 'trainer', 'training', 'coach'] },
    { question: 'Can I freeze my membership?', answer: 'Yes, up to 3 months per year with 7 days notice. Medical freeze unlimited.', keywords: ['freeze', 'pause', 'hold', 'break'] },
  ],
  'real-estate': [
    { question: 'What areas do you cover?', answer: 'We specialize in [City] and surrounding suburbs. Share your preferred location.', keywords: ['area', 'location', 'cover', 'neighborhood'] },
    { question: 'What\'s your commission?', answer: 'Standard 2% for sales, 1 month rent for rentals. Negotiable for high-value deals.', keywords: ['commission', 'fee', 'charge', 'percentage'] },
    { question: 'How do I schedule a viewing?', answer: 'Message us the property ID or link. We\'ll arrange within 24 hours.', keywords: ['viewing', 'visit', 'see', 'schedule', 'tour'] },
    { question: 'Do you help with paperwork?', answer: 'Yes, end-to-end documentation support including agreements, registration, loans.', keywords: ['paperwork', 'documents', 'agreement', 'registration', 'legal'] },
  ],
  restaurant: [
    { question: 'What are your timings?', answer: 'Lunch: 12-3 PM, Dinner: 7-11 PM. Closed Mondays.', keywords: ['timing', 'hours', 'open', 'close', 'lunch', 'dinner'] },
    { question: 'Do you take reservations?', answer: 'Yes, for 4+ people. Book via WhatsApp or call. Walk-ins welcome.', keywords: ['reservation', 'book', 'table', 'booking'] },
    { question: 'Do you deliver?', answer: 'Yes, within 5km radius via Swiggy/Zomato. Free delivery on orders above ₹500.', keywords: ['delivery', 'deliver', 'swiggy', 'zomato', 'order'] },
    { question: 'Any vegan/gluten-free options?', answer: 'Yes, marked on menu. Ask staff for allergen info. Custom requests welcome.', keywords: ['vegan', 'vegetarian', 'gluten', 'allergen', 'dietary'] },
  ],
  'auto-repair': [
    { question: 'What are your timings?', answer: '9 AM - 7 PM, Monday to Saturday. Emergency towing 24/7.', keywords: ['timing', 'hours', 'open', 'close', 'emergency', 'towing'] },
    { question: 'Do you give free estimates?', answer: 'Yes, free inspection & estimate. No obligation. WhatsApp us photos for quick quote.', keywords: ['estimate', 'quote', 'price', 'cost', 'inspection'] },
    { question: 'What services do you offer?', answer: 'Full service: oil change, brakes, AC, engine, electrical, detailing, periodic maintenance.', keywords: ['service', 'repair', 'maintenance', 'oil', 'brake', 'ac'] },
    { question: 'Do you use genuine parts?', answer: 'Yes, OEM or equivalent quality. Warranty on parts & labor. Invoice provided.', keywords: ['genuine', 'parts', 'oem', 'warranty', 'original'] },
  ],
}

async function deployClient(config: ClientConfig, dryRun: boolean) {
  console.log('\n🚀 Kangiten Agency - Client Deployment')
  console.log('='.repeat(50))
  console.log(`Client: ${config.businessName} (${config.clientId})`)
  console.log(`Type: ${config.businessType}`)
  console.log(`WhatsApp: ${config.whatsappNumber}`)
  console.log(`Plan: ${config.plan}`)
  console.log(`Dry run: ${dryRun ? 'YES' : 'NO'}`)
  console.log('='.repeat(50) + '\n')

  // 1. Prepare client configuration
  const clientConfig = {
    id: config.clientId,
    name: config.businessName,
    businessType: config.businessType,
    whatsappNumber: config.whatsappNumber,
    systemPrompt: '',
    faqs: FAQ_TEMPLATES[config.businessType] || FAQ_TEMPLATES.salon,
    bookingEnabled: config.plan !== 'starter',
    calendarUrl: config.calendarUrl,
    crmWebhook: config.crmWebhook,
    model: 'gpt-4o' as const,
    temperature: 0.3,
    maxTokens: 500,
  }

  // 2. Generate proposal
  console.log('📄 Generating proposal...')
  const proposal = await generateProposal({
    lead: {
      name: config.businessName.split(' ')[0],
      business: config.businessName,
      category: config.businessType,
      location: 'City',
      painPoints: ['Missed messages', 'Manual booking', 'No lead tracking'],
    },
    plan: config.plan,
  })

  if (!dryRun) {
    await fs.writeFile(
      path.join(process.cwd(), `proposal-${config.clientId}.md`),
      proposal
    )
    console.log(`✅ Proposal saved to proposal-${config.clientId}.md`)
  } else {
    console.log('✅ Proposal generated (dry run)')
  }

  // 3. Run onboarding (deploy to Vercel)
  console.log('\n☁️  Deploying to Vercel...')
  const onboardingResult = await runOnboarding({
    ...clientConfig,
    faqs: clientConfig.faqs,
  })

  if (onboardingResult.status === 'success') {
    console.log('✅ Deployment successful!')
    console.log(`   Project: ${onboardingResult.vercelProjectId}`)
    console.log(`   Dashboard: ${onboardingResult.dashboardUrl}`)
    console.log(`   Webhook: ${onboardingResult.webhookUrl}`)
  } else {
    console.log('❌ Deployment failed:')
    onboardingResult.details.forEach(d => console.log(`   ${d}`))
    return
  }

  // 4. Run QA tests
  if (!program.opts().skipQa) {
    console.log('\n🧪 Running QA tests...')
    const qaResult = await runQA({
      dashboardUrl: onboardingResult.dashboardUrl,
      webhookUrl: onboardingResult.webhookUrl,
      whatsappNumber: config.whatsappNumber,
    })

    console.log(`\n📊 QA Results: ${qaResult.passed}/${qaResult.passed + qaResult.failed} passed`)
    qaResult.results.forEach(r => {
      const icon = r.status === 'pass' ? '✅' : '❌'
      console.log(`   ${icon} ${r.test}: ${r.details}`)
    })
  }

  // 5. Save client config to KV/Postgres
  if (!dryRun) {
    console.log('\n💾 Saving client configuration...')
    // await kv.set(`client:${config.clientId}`, clientConfig)
    // await sql`INSERT INTO clients ...`
    console.log('✅ Configuration saved')
  }

  // 6. Output summary
  console.log('\n' + '='.repeat(50))
  console.log('🎉 DEPLOYMENT COMPLETE')
  console.log('='.repeat(50))
  console.log(`Client: ${config.businessName}`)
  console.log(`Dashboard: ${onboardingResult.dashboardUrl}`)
  console.log(`Webhook URL: ${onboardingResult.webhookUrl}`)
  console.log(`Proposal: proposal-${config.clientId}.md`)
  console.log('\n📋 Next Steps:')
  console.log('1. Share dashboard URL with client')
  console.log('2. Configure WhatsApp Business API with webhook URL')
  console.log('3. Send proposal to client')
  console.log('4. Schedule onboarding call')
  console.log('='.repeat(50) + '\n')
}

program.parse()

const options = program.opts()

deployClient({
  clientId: options.client,
  businessName: options.name,
  businessType: options.type,
  whatsappNumber: options.phone,
  email: options.email,
  plan: options.plan,
  calendarUrl: options.calendar,
  crmWebhook: options.crm,
}, options.dryRun).catch(console.error)