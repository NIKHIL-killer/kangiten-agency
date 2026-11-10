#!/usr/bin/env tsx
/**
 * Personalized Video Renderer
 * Generates custom outreach videos for each lead
 *
 * Usage: npx tsx tools/render-personalized-video.ts --lead glow-salon --name "Priya" --business "Glow Salon" --category salon --location Mumbai
 */

import { Command } from 'commander'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { bundle } from '@remotion/bundler'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as csv from 'csv-parse/sync'

const program = new Command()

program
  .name('render-personalized-video')
  .description('Render personalized outreach videos for leads')
  .version('1.0.0')
  .option('-l, --lead <id>', 'Lead ID (used for output filename)')
  .option('-n, --name <name>', 'Contact person name')
  .option('-b, --business <name>', 'Business name')
  .option('-c, --category <type>', 'Business category (salon|clinic|gym|real-estate|restaurant|auto-repair)')
  .option('--location <city>', 'City/location', 'Mumbai')
  .option('--pain-point <text>', 'Specific pain point')
  .option('--case-study <name>', 'Case study business name', 'Glow Salon')
  .option('--case-result <text>', 'Case study result', '15 appointments/week automated')
  .option('--demo-url <url>', 'Demo URL', 'https://demo.kangiten.com')
  .option('--calendly-url <url>', 'Calendly URL', 'https://calendly.com/kangiten/15min')
  .option('--csv <file>', 'CSV file with multiple leads')
  .option('-o, --output <dir>', 'Output directory', './out/videos')
  .option('--composition <id>', 'Composition ID', 'personalized-outreach')
  .option('--concurrency <number>', 'Parallel threads', '2')
  .option('--crf <number>', 'Quality (lower = better)', '23')

const COMPOSITIONS = {
  'personalized-outreach': {
    entry: '@kangiten/video-pipeline/src/compositions/PersonalizedOutreachVideo',
    defaultOutput: 'personalized-outreach',
  },
  'personalized-outreach-horizontal': {
    entry: '@kangiten/video-pipeline/src/compositions/PersonalizedOutreachVideo',
    defaultOutput: 'personalized-outreach-horizontal',
  },
}

interface LeadData {
  leadId: string
  name: string
  business: string
  category: string
  location: string
  painPoint: string
  caseStudyName: string
  caseStudyResult: string
  demoUrl: string
  calendlyUrl: string
}

async function renderVideo(lead: LeadData, options: any) {
  const compositionId = options.composition
  const compositionConfig = COMPOSITIONS[compositionId as keyof typeof COMPOSITIONS]

  if (!compositionConfig) {
    throw new Error(`Unknown composition: ${compositionId}`)
  }

  const outputDir = path.resolve(options.output)
  await fs.mkdir(outputDir, { recursive: true })

  const outputFile = path.join(outputDir, `${lead.leadId}-${compositionConfig.defaultOutput}.mp4`)

  console.log(`\n🎬 Rendering video for ${lead.business} (${lead.leadId})`)
  console.log(`   Output: ${outputFile}`)
  console.log(`   Composition: ${compositionId}`)

  try {
    console.log('📦 Bundling...')
    const bundleLocation = await bundle({
      entryPoint: path.resolve(__dirname, '../packages/video-pipeline/src/compositions/PersonalizedOutreachVideo.tsx'),
      webpackOverride: (config) => config,
    })

    console.log('🎯 Selecting composition...')
    const composition = await selectComposition({
      bundleLocation,
      id: compositionId,
      inputProps: {
        leadName: lead.name,
        businessName: lead.business,
        category: lead.category,
        location: lead.location,
        painPoint: lead.painPoint,
        caseStudyName: lead.caseStudyName,
        caseStudyResult: lead.caseStudyResult,
        demoUrl: lead.demoUrl,
        calendlyUrl: lead.calendlyUrl,
      },
    })

    console.log(`📐 ${composition.width}x${composition.height} @ ${composition.fps}fps`)
    console.log(`⏱️  ${composition.durationInFrames / composition.fps}s (${composition.durationInFrames} frames)`)

    console.log('\n🎥 Rendering...')
    const startTime = Date.now()

    await renderMedia({
      bundleLocation,
      composition,
      outputLocation: outputFile,
      codec: 'h264',
      crf: parseInt(options.crf),
      concurrency: parseInt(options.concurrency),
      onProgress: ({ progress, frame, totalFrames }) => {
        const percent = (progress * 100).toFixed(1)
        const elapsed = (Date.now() - startTime) / 1000
        const eta = progress > 0 ? (elapsed / progress - elapsed) : 0
        process.stdout.write(`\r   Frame ${frame}/${totalFrames} (${percent}%) - ETA: ${eta.toFixed(0)}s`)
      },
    })

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n\n✅ Render complete in ${duration}s`)

    const stats = await fs.stat(outputFile)
    console.log(`📁 Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`)

    return outputFile
  } catch (error) {
    console.error(`\n❌ Render failed for ${lead.business}:`, error)
    throw error
  }
}

function parseCSV(csvPath: string): LeadData[] {
  const content = require('fs').readFileSync(csvPath, 'utf-8')
  const records = csv.parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  return records.map((record: any, i: number) => ({
    leadId: record.leadId || record.id || `lead-${i + 1}`,
    name: record.name || record.contactName || record.contact_name || 'Owner',
    business: record.business || record.businessName || record.business_name || 'Business',
    category: record.category || record.type || 'salon',
    location: record.location || record.city || 'Mumbai',
    painPoint: record.painPoint || record.pain_point || `Misses ${record.category || 'customer'} inquiries on WhatsApp`,
    caseStudyName: record.caseStudyName || record.case_study_name || 'Glow Salon',
    caseStudyResult: record.caseStudyResult || record.case_study_result || '15 appointments/week automated',
    demoUrl: record.demoUrl || record.demo_url || `https://demo.kangiten.com/${record.leadId || record.id || `lead-${i + 1}`}`,
    calendlyUrl: record.calendlyUrl || record.calendly_url || 'https://calendly.com/kangiten/15min',
  }))
}

async function main() {
  const options = program.opts()

  console.log('\n🎬 Kangiten Personalized Video Renderer')
  console.log('='.repeat(50))

  const leads: LeadData[] = []

  if (options.csv) {
    // Batch mode from CSV
    console.log(`📋 Loading leads from ${options.csv}...`)
    const csvLeads = parseCSV(path.resolve(options.csv))
    leads.push(...csvLeads)
    console.log(`   Found ${leads.length} leads`)
  } else if (options.lead && options.name && options.business && options.category) {
    // Single lead mode
    leads.push({
      leadId: options.lead,
      name: options.name,
      business: options.business,
      category: options.category,
      location: options.location,
      painPoint: options.painPoint || `Misses ${options.category} inquiries on WhatsApp`,
      caseStudyName: options.caseStudy,
      caseStudyResult: options.caseResult,
      demoUrl: options.demoUrl,
      calendlyUrl: options.calendlyUrl,
    })
  } else {
    console.error('❌ Either provide --csv or all of: --lead, --name, --business, --category')
    program.help()
    process.exit(1)
  }

  // Render each video
  const results = []
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i]
    console.log(`\n[${i + 1}/${leads.length}]`)
    try {
      const outputFile = await renderVideo(lead, options)
      results.push({ lead: lead.leadId, business: lead.business, outputFile, status: 'success' })
    } catch (error) {
      results.push({ lead: lead.leadId, business: lead.business, error: String(error), status: 'failed' })
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 RENDER SUMMARY')
  console.log('='.repeat(50))

  const successful = results.filter(r => r.status === 'success')
  const failed = results.filter(r => r.status === 'failed')

  console.log(`✅ Successful: ${successful.length}`)
  console.log(`❌ Failed: ${failed.length}`)

  if (successful.length > 0) {
    console.log('\n✅ Completed:')
    successful.forEach(r => console.log(`   ${r.business} (${r.lead}) → ${r.outputFile}`))
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed:')
    failed.forEach(r => console.log(`   ${r.business} (${r.lead}): ${r.error}`))
  }

  // Save manifest
  const manifestPath = path.join(path.resolve(options.output), 'manifest.json')
  await fs.writeFile(manifestPath, JSON.stringify(results, null, 2))
  console.log(`\n📄 Manifest saved to ${manifestPath}`)
}

program.parse()

if (require.main === module) {
  main().catch(console.error)
}