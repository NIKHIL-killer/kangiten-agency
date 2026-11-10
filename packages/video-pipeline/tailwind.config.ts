import sharedConfig from '@kangiten/shared-config/tailwind.config'

export default {
  ...sharedConfig,
  content: [
    ...sharedConfig.content,
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}