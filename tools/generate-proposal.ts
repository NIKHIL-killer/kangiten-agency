#!/usr/bin/env tsx
/**
 * Generate Proposal Tool
 * Creates customized proposals for leads
 *
 * Usage: npx tsx tools/generate-proposal.ts --name "Glow Salon" --type salon --plan growth
 */

import { Command } from 'commander'
import { generateProposal } from '@kangiten/ai-agents'
import * as fs from 'fs/promises'
import * as path from 'path'

const program = new Command()

program
  .name('generate-proposal')
  .description('Generate a customized proposal for a lead')
  .version('1.0.0')
  .requiredOption('-n, --name <name>', 'Business name')
  .requiredOption('-t, --type <type>', 'Business type (salon|clinic|gym|real-estate|restaurant|auto-repair)')
  .requiredOption('-c, --contact <name>', 'Contact person name')
  .option('-l, --location <city>', 'City/location', 'your city')
  .option('-p, --plan <plan>', 'Plan: starter|growth|scale', 'growth')
  .option('--pain-points <points>', 'Comma-separated pain points')
  .option('--notes <notes>', 'Custom notes')
  .option('-o, --output <file>', 'Output file path')

const PAIN_POINTS_BY_TYPE: Record<string, string[]> = {
  salon: ['Missed evening WhatsApp messages', 'Manual appointment booking', 'No lead tracking'],
  clinic: ['Patient queries after hours', 'Prescription refill requests', 'Appointment no-shows'],
  gym: ['Missed membership inquiries', 'Class booking confusion', 'Member retention'],
  'real-estate': ['Slow lead response', 'Viewing scheduling chaos', 'Document follow-up'],
  restaurant: ['Missed reservation requests', 'Delivery order errors', 'Menu inquiries'],
  'auto-repair': ['Missed service inquiries', 'Estimate delays', 'Parts availability questions'],
}

program.parse()

const options = program.opts()

const painPoints = options.painPoints
  ? options.painPoints.split(',').map((p: string) => p.trim())
  : PAIN_POINTS_BY_TYPE[options.type] || PAIN_POINTS_BY_TYPE.salon

async function main() {
  console.log('\n📄 Generating Proposal')
  console.log('='.repeat(40))
  console.log(`Business: ${options.name}`)
  console.log(`Type: ${options.type}`)
  console.log(`Contact: ${options.contact}`)
  console.log(`Location: ${options.location}`)
  console.log(`Plan: ${options.plan}`)
  console.log(`Pain Points: ${painPoints.join(', ')}`)
  console.log('='.repeat(40) + '\n')

  const proposal = await generateProposal({
    lead: {
      name: options.contact,
      business: options.name,
      category: options.type,
      location: options.location,
      painPoints,
    },
    plan: options.plan as 'starter' | 'growth' | 'scale',
    customNotes: options.notes,
  })

  const outputFile = options.output || `proposal-${options.name.toLowerCase().replace(/\s+/g, '-')}.md`

  await fs.writeFile(outputFile, proposal)

  console.log(`\n✅ Proposal saved to: ${outputFile}`)
  console.log('\n' + '-'.repeat(40))
  console.log('PREVIEW:')
  console.log('-'.repeat(40))
  console.log(proposal.slice(0, 500) + '...')
  console.log('-'.repeat(40))
}

main().catch(console.error)