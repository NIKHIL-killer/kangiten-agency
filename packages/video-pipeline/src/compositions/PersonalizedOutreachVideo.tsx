import { Composition, interpolate, useCurrentFrame, useVideoConfig, Spring, spring } from 'remotion'
import { absoluteFill, sequence } from 'remotion'
import { Bot, Sparkles, CheckCircle, TrendingUp, MessageSquare, Calendar, Users, Shield, Zap, Target, Video, Mail, Phone, MapPin, Star } from 'lucide-react'
import { cn } from '@kangiten/ui/lib/utils'
import React from 'react'

// Tailwind setup for Remotion
import '@remotion/tailwind'

const DURATION_IN_FRAMES = 450 // 15 seconds at 30fps
const FPS = 30
const WIDTH = 1080
const HEIGHT = 1920 // Vertical for Reels/Shorts/TikTok

// ===========================================
// PROPS INTERFACE
// ===========================================

interface PersonalizedVideoProps {
  leadName: string
  businessName: string
  category: string
  location: string
  painPoint: string
  caseStudyName: string
  caseStudyResult: string
  demoUrl: string
  calendlyUrl: string
}

// ===========================================
// ANIMATION HELPERS
// ===========================================

function useSpringFrame(startFrame: number, endFrame: number) {
  const frame = useCurrentFrame()
  const progress = Math.max(0, Math.min(1, (frame - startFrame) / (endFrame - startFrame)))
  return progress
}

function useOscillate(amplitude: number = 10, frequency: number = 0.5) {
  const frame = useCurrentFrame()
  return Math.sin(frame * frequency * 0.1) * amplitude
}

// ===========================================
// SCENES
// ===========================================

// Scene 1: Hook (0-3s) - Personalized greeting
function HookScene({ leadName, businessName }: PersonalizedVideoProps) {
  const progress = useSpringFrame(0, 90)
  const y = interpolate(progress, [0, 0.3, 1], [100, 0, 0])
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-gradient-to-br from-slate-900 via-slate-800 to-green-900/30')}
      style={{ opacity }}
    >
      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 animate-pulse">
        <Bot className="w-14 h-14 text-white" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4 px-8 leading-tight" style={{ transform: `translateY(${y}px)` }}>
        Hey <span className="text-green-400">{leadName}</span>! 👋
      </h1>

      <p className="text-xl text-green-200 text-center max-w-lg px-8 mb-8" style={{ transform: `translateY(${y}px)` }}>
        Quick video for <span className="font-bold text-white">{businessName}</span>
      </p>

      <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20" style={{ transform: `translateY(${y}px)` }}>
        <MapPin className="w-6 h-6 text-green-400" />
        <span className="text-white font-medium">Customized for {businessName} in {location}</span>
      </div>
    </div>
  )
}

// Scene 2: Problem (3-5s) - Their specific pain point
function ProblemScene({ painPoint, category }: PersonalizedVideoProps) {
  const progress = useSpringFrame(90, 150)
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const categoryIcons = {
    salon: Sparkles,
    clinic: Shield,
    gym: TrendingUp,
    'real-estate': Target,
    restaurant: MessageSquare,
    'auto-repair': Zap,
  }
  const Icon = categoryIcons[category as keyof typeof categoryIcons] || Bot

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-slate-900')}
      style={{ opacity }}
    >
      <div className="w-20 h-20 rounded-xl bg-red-500/20 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-red-400" />
      </div>

      <h2 className="text-3xl font-bold text-white text-center mb-6 px-8">
        The Problem You\'re Facing
      </h2>

      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-lg mx-8 text-center">
        <p className="text-white text-lg leading-relaxed">
          "{painPoint}"
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 px-8">
        {[
          'Missed messages = lost revenue',
          'Manual work = burnout',
          'Slow replies = unhappy customers',
        ].map((text, i) => (
          <div key={i} className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-200 text-sm">
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}

// Scene 3: Solution (5-9s) - How Kangiten helps
function SolutionScene({ category }: PersonalizedVideoProps) {
  const progress = useSpringFrame(150, 270)
  const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  const features = [
    { icon: Bot, title: 'AI Answers FAQs', desc: 'Timings, services, prices instantly', color: 'text-blue-400' },
    { icon: Calendar, title: 'Auto Booking', desc: 'Customers book in WhatsApp', color: 'text-green-400' },
    { icon: Users, title: 'Lead Capture', desc: 'Qualified leads to your team', color: 'text-purple-400' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data, your control', color: 'text-orange-400' },
  ]

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-gradient-to-b from-slate-900 to-green-900/20')}
      style={{ opacity }}
    >
      <h2 className="text-3xl font-bold text-white text-center mb-4">
        Meet Your <span className="text-green-400">AI Assistant</span>
      </h2>
      <p className="text-green-200 text-center mb-8 px-8">
        Deployed on YOUR WhatsApp number in 30 minutes
      </p>

      <div className="space-y-4 w-full max-w-2xl px-8">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="flex gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-all"
            style={{
              animationDelay: `${i * 200}ms`,
              opacity: progress > 0.15 + i * 0.15 ? 1 : 0,
              transform: `translateX(${progress > 0.15 + i * 0.15 ? 0 : 50}px)`,
            }}
          >
            <div className={`w-14 h-14 rounded-xl bg-${feature.color.replace('text-', '').replace('400', '500')}/20 flex items-center justify-center flex-shrink-0`}>
              <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-green-200">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Scene 4: Social Proof (9-12s) - Relevant case study
function CaseStudyScene({ caseStudyName, caseStudyResult, category }: PersonalizedVideoProps) {
  const progress = useSpringFrame(270, 360)
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1])

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-slate-900')}
      style={{ opacity }}
    >
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Real Results for <span className="text-green-400">{category}s</span>
      </h2>
      <p className="text-green-200 text-center mb-8">See what happened with {caseStudyName}</p>

      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl p-8 max-w-xl mx-8 text-center">
        <div className="text-5xl font-bold text-green-400 mb-2">{caseStudyResult}</div>
        <div className="text-green-200 mb-4">Result for {caseStudyName}</div>
        <p className="text-green-300 italic text-lg">"ROI in week 1. Never looking back."</p>
      </div>

      <div className="mt-8 flex gap-8">
        {[
          { value: '90%', label: 'Faster replies' },
          { value: '3x', label: 'More leads' },
          { value: '24/7', label: 'Availability' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-green-400">{stat.value}</div>
            <div className="text-green-200 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Scene 5: CTA (12-15s) - Personalized demo link
function CTAScene({ businessName, demoUrl, calendlyUrl }: PersonalizedVideoProps) {
  const progress = useSpringFrame(360, 450)
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1])
  const scale = interpolate(progress, [0, 0.3], [0.9, 1])

  // Extract short URL for display
  const shortDemoUrl = demoUrl.replace('https://', '').replace('http://', '')

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-gradient-to-br from-green-600 to-emerald-700')}
      style={{ opacity, transform: `scale(${scale})` }}
    >
      <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
        <Sparkles className="w-12 h-12 text-white" />
      </div>

      <h1 className="text-4xl font-bold text-white text-center mb-3 px-6">
        Your Demo is Ready!
      </h1>

      <p className="text-xl text-green-100 text-center max-w-lg mb-6 px-6">
        Try it live: <span className="font-bold underline">{shortDemoUrl}</span>
      </p>

      <div className="flex flex-col items-center gap-4 w-full max-w-xs px-6">
        <a
          href={demoUrl}
          className="w-full h-14 bg-white text-green-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-50 transition-colors"
          target="_blank"
          rel="noopener"
        >
          <Bot className="w-6 h-6" />
          Try Live Demo
        </a>

        <a
          href={calendlyUrl}
          className="w-full h-14 bg-green-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-400 transition-colors border-2 border-white/30"
          target="_blank"
          rel="noopener"
        >
          <Calendar className="w-6 h-6" />
          Book 15-min Call
        </a>
      </div>

      <div className="mt-8 flex items-center gap-4 text-green-100">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          <span>hello@kangiten.com</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          <span>+91 98765 43210</span>
        </div>
      </div>

      <p className="mt-6 text-green-200 text-sm">
        First month free • 30-min setup • Cancel anytime
      </p>
    </div>
  )
}

// ===========================================
// MAIN COMPOSITION
// ===========================================

export const PersonalizedOutreachVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="personalized-outreach"
        component={PersonalizedOutreachVideoContent}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          leadName: 'Priya',
          businessName: 'Glow Salon',
          category: 'salon',
          location: 'Mumbai',
          painPoint: 'Misses evening WhatsApp messages from clients wanting to book appointments',
          caseStudyName: 'Glow Salon',
          caseStudyResult: '15 appointments/week automated',
          demoUrl: 'https://demo.kangiten.com/glow-salon',
          calendlyUrl: 'https://calendly.com/kangiten/15min',
        }}
      />
    </>
  )
}

function PersonalizedOutreachVideoContent(props: PersonalizedVideoProps) {
  return (
    <div className={cn(absoluteFill, 'bg-slate-950')}>
      <HookScene {...props} />
      <ProblemScene {...props} />
      <SolutionScene {...props} />
      <CaseStudyScene {...props} />
      <CTAScene {...props} />
    </div>
  )
}

// ===========================================
// HORIZONTAL VERSION (for email embed)
// ===========================================

export const PersonalizedOutreachHorizontal: React.FC = () => {
  return (
    <Composition
      id="personalized-outreach-horizontal"
      component={PersonalizedOutreachHorizontalContent}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        leadName: 'Priya',
        businessName: 'Glow Salon',
        category: 'salon',
        location: 'Mumbai',
        painPoint: 'Misses evening WhatsApp messages from clients wanting to book appointments',
        caseStudyName: 'Glow Salon',
        caseStudyResult: '15 appointments/week automated',
        demoUrl: 'https://demo.kangiten.com/glow-salon',
        calendlyUrl: 'https://calendly.com/kangiten/15min',
      }}
    />
  )
}

function PersonalizedOutreachHorizontalContent(props: PersonalizedVideoProps) {
  // Reuse same scenes but horizontal layout
  return (
    <div className={cn(absoluteFill, 'bg-slate-950', 'flex flex-col')}>
      {/* Horizontal versions would go here - condensed */}
      <HookScene {...props} />
      <ProblemScene {...props} />
      <SolutionScene {...props} />
      <CaseStudyScene {...props} />
      <CTAScene {...props} />
    </div>
  )
}