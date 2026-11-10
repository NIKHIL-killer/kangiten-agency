import { Config } from '@remotion/cli/config'
import { bundle } from '@remotion/bundler'
import { renderMedia } from '@remotion/renderer'

Config.setChromiumOpenGlRenderer('swiftshader')

export const remotionConfig = {
  webpackOverride: (config: any) => {
    return config
  },
}