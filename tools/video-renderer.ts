#!/usr/bin/env tsx
/**
 * Video Renderer Tool
 * Renders marketing videos using Remotion
 *
 * Usage: npx tsx tools/video-renderer.ts --composition kangiten-demo --output demo.mp4
 */

import { Command } from 'commander'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { bundle } from '@remotion/bundler'
import * as fs from 'fs/promises'
import * as path from 'path'

const program = new Command()

program
  .name('video-renderer')
  .description('Render marketing videos with Remotion')
  .version('1.0.0')
  .requiredOption('-c, --composition <id>', 'Composition ID (kangiten-demo|kangiten-short)')
  .option('-o, --output <file>', 'Output file path')
  .option('--fps <number>', 'Frames per second', '30')
  .option('--crf <number>', 'Quality (lower = better)', '23')
  .option('--concurrency <number>', 'Parallel threads', '4')

const COMPOSITIONS = {
  'kangiten-demo': {
    entry: '@kangiten/video-pipeline/src/compositions/DemoVideo',
    defaultOutput: 'kangiten-demo.mp4',
  },
  'kangiten-short': {
    entry: '@kangiten/video-pipeline/src/compositions/DemoVideo',
    defaultOutput: 'kangiten-short.mp4',
  },
}

program.parse()

const options = program.opts()

async function main() {
  const compositionId = options.composition
  const compositionConfig = COMPOSITIONS[compositionId as keyof typeof COMPOSITIONS]

  if (!compositionConfig) {
    console.error(`❌ Unknown composition: ${compositionId}`)
    console.error(`Available: ${Object.keys(COMPOSITIONS).join(', ')}`)
    process.exit(1)
  }

  const outputFile = path.resolve(options.output || compositionConfig.defaultOutput)

  console.log('\n🎬 Kangiten Video Renderer')
  console.log('='.repeat(40))
  console.log(`Composition: ${compositionId}`)
  console.log(`Output: ${outputFile}`)
  console.log(`FPS: ${options.fps}`)
  console.log(`Quality (CRF): ${options.crf}`)
  console.log(`Concurrency: ${options.concurrency}`)
  console.log('='.repeat(40) + '\n')

  try {
    console.log('📦 Bundling...')
    const bundleLocation = await bundle({
      entryPoint: path.resolve(__dirname, '../packages/video-pipeline/src/compositions/DemoVideo.tsx'),
      webpackOverride: (config) => config,
    })

    console.log('🎯 Selecting composition...')
    const composition = await selectComposition({
      bundleLocation,
      id: compositionId,
      inputProps: {},
    })

    console.log(`📐 Composition: ${composition.width}x${composition.height} @ ${composition.fps}fps`)
    console.log(`⏱️  Duration: ${composition.durationInFrames / composition.fps}s (${composition.durationInFrames} frames)`)

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
        const eta = ((Date.now() - startTime) / progress - (Date.now() - startTime)) / 1000
        process.stdout.write(`\r   Frame ${frame}/${totalFrames} (${percent}%) - ETA: ${eta.toFixed(0)}s`)
      },
    })

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n\n✅ Render complete in ${duration}s`)
    console.log(`📁 Output: ${outputFile}`)

    // Verify file
    const stats = await fs.stat(outputFile)
    console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`)

  } catch (error) {
    console.error('\n❌ Render failed:', error)
    process.exit(1)
  }
}

main()