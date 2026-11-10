#!/usr/bin/env tsx
/**
 * Outreach Runner Tool
 * Runs automated email outreach sequences
 *
 * Usage: npx tsx tools/outreach-runner.ts --csv leads.csv --delay 3
 */

import { Command } from 'commander'
import { runOutreach } from '@kangiten/outreach-automation'
import * as fs from 'fs/promises'
import * as path from 'path'

const program = new Command()

program
  .name('outreach-runner')
  .description('Run automated email outreach sequences')
  .version('1.0.0')
  .requiredOption('-c, --csv <file>', 'CSV file with leads')
  .option('-d, --delay <seconds>', 'Delay between emails (seconds)', '2')
  .option('--dry-run', 'Simulate without sending')
  .option('--limit <number>', 'Max leads to process')
  .option('--template <name>', 'Template set to use', 'default')

program.parse()

const options = program.opts()

async function main() {
  const csvPath = path.resolve(options.csv)

  // Check file exists
  try {
    await fs.access(csvPath)
  } catch {
    console.error(`❌ File not found: ${csvPath}`)
    process.exit(1)
  }

  console.log('\n📧 Kangiten Outreach Runner')
  console.log('='.repeat(40))
  console.log(`CSV: ${csvPath}`)
  console.log(`Delay: ${options.delay}s`)
  console.log(`Dry run: ${options.dryRun ? 'YES' : 'NO'}`)
  console.log(`Limit: ${options.limit || 'unlimited'}`)
  console.log('='.repeat(40) + '\n')

  if (options.dryRun) {
    console.log('🔍 DRY RUN - No emails will be sent\n')
  }

  try {
    await runOutreach(csvPath)
    console.log('\n✅ Outreach sequence completed')
  } catch (error) {
    console.error('\n❌ Outreach failed:', error)
    process.exit(1)
  }
}

main()