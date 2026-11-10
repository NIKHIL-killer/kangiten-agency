import { Composition, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { absoluteFill, sequence } from 'remotion'
import { Bot, Sparkles, CheckCircle, TrendingUp, MessageSquare, Calendar, Users, Shield, Zap } from 'lucide-react'
import { cn } from '@kangiten/ui/lib/utils'
import React from 'react'

// Tailwind setup for Remotion
import '@remotion/tailwind'

const DURATION_IN_FRAMES = 300 // 10 seconds at 30fps
const FPS = 30
const WIDTH = 1920
const HEIGHT = 1080

// Scene 1: Hook (0-3s)
function HookScene() {
  const frame = useCurrentFrame()
  const progress = frame / 90 // 3 seconds

  const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = interpolate(progress, [0, 0.3], [0.8, 1])
  const y = interpolate(progress, [0, 0.3], [50, 0])

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill)}
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
      }}
    >
      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-8 animate-pulse">
        <Bot className="w-16 h-16 text-white" />
      </div>
      <h1 className="text-6xl font-bold text-white text-center mb-6 px-8 leading-tight">
        Stop Missing{' '}
        <span className="text-green-400">WhatsApp Customers</span>
      </h1>
      <p className="text-2xl text-green-200 text-center max-w-3xl px-8">
        AI chatbot that books appointments, answers FAQs & captures leads 24/7
      </p>
    </div>
  )
}

// Scene 2: Problem (3-5s)
function ProblemScene() {
  const frame = useCurrentFrame()
  const progress = (frame - 90) / 60 // 2 seconds

  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const problems = [
    { icon: MessageSquare, text: 'Missed messages after hours' },
    { icon: Calendar, text: 'Manual appointment booking' },
    { icon: Users, text: 'Leads slipping through cracks' },
    { icon: Zap, text: 'Slow response times' },
  ]

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-slate-900')}
      style={{ opacity }}
    >
      <h2 className="text-4xl font-bold text-white text-center mb-12">Sound familiar?</h2>
      <div className="grid grid-cols-2 gap-8 max-w-4xl px-8">
        {problems.map((problem, i) => (
          <div
            key={problem.text}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-slate-800 border border-slate-700"
            style={{
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center">
              <problem.icon className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-xl text-white text-center">{problem.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Scene 3: Solution (5-8s)
function SolutionScene() {
  const frame = useCurrentFrame()
  const progress = (frame - 150) / 90 // 3 seconds

  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const features = [
    { icon: Bot, title: 'AI Answers FAQs', desc: 'Timings, services, prices instantly' },
    { icon: Calendar, title: 'Auto Booking', desc: 'Customers book in WhatsApp' },
    { icon: Users, title: 'Lead Capture', desc: 'Qualified leads to your team' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data, your control' },
  ]

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-gradient-to-b from-slate-900 to-green-900/20')}
      style={{ opacity }}
    >
      <h2 className="text-4xl font-bold text-white text-center mb-12">
        Meet Your <span className="text-green-400">AI Assistant</span>
      </h2>
      <div className="grid grid-cols-2 gap-6 max-w-5xl px-8">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="flex gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-colors"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-green-200">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Scene 4: Social Proof (8-10s)
function ProofScene() {
  const frame = useCurrentFrame()
  const progress = (frame - 240) / 60 // 2 seconds

  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1])

  const stats = [
    { value: '90%', label: 'Faster Response' },
    { value: '3x', label: 'More Leads' },
    { value: '24/7', label: 'Availability' },
    { value: '50%', label: 'Less Manual Work' },
  ]

  const testimonials = [
    { quote: '"Booked 15 appointments/week automatically. ROI in week 1."', author: 'Priya Sharma, Glow Salon' },
    { quote: '"Handles 80% of patient queries. Staff focuses on care."', author: 'Dr. Rajesh, City Clinic' },
    { quote: '"Response time 4hrs → 30sec. Closed 3 deals in month 1."', author: 'Amit Patel, Patel Realty' },
  ]

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-slate-900')}
      style={{ opacity }}
    >
      <h2 className="text-4xl font-bold text-white text-center mb-8">Real Results</h2>

      <div className="flex gap-12 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-5xl font-bold text-green-400">{stat.value}</div>
            <div className="text-green-200">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-5xl px-8">
        {testimonials.map((testimonial, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-green-100 text-lg mb-4 italic">"{testimonial.quote}"</p>
            <p className="text-green-300 text-sm font-medium">{testimonial.author}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Scene 5: CTA (10-12s)
function CTAScene() {
  const frame = useCurrentFrame()
  const progress = (frame - 300) / 60 // 2 seconds (extend duration)

  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1])
  const scale = interpolate(progress, [0, 0.3], [0.9, 1])

  return (
    <div
      className={cn('flex flex-col items-center justify-center', absoluteFill, 'bg-gradient-to-br from-green-600 to-emerald-700')}
      style={{ opacity, transform: `scale(${scale})` }}
    >
      <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center mb-8 backdrop-blur-sm">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-5xl font-bold text-white text-center mb-6 px-8">
        Start Your <span className="text-yellow-300">Free Month</span> Today
      </h1>
      <p className="text-2xl text-green-100 text-center max-w-2xl mb-12 px-8">
        Deployed in 30 mins • Your WhatsApp number • Cancel anytime
      </p>
      <div className="flex flex-col items-center gap-6">
        <a
          href="https://calendly.com/kangiten/15min"
          className="w-80 h-16 bg-white text-green-600 rounded-xl font-bold text-xl flex items-center justify-center gap-4 hover:bg-green-50 transition-colors"
          target="_blank"
          rel="noopener"
        >
          <Calendar className="w-6 h-6" />
          Book Free Demo
        </a>
        <p className="text-green-100">or visit <span className="font-bold underline">kangiten.com</span></p>
      </div>
    </div>
  )
}

// Main composition
export const DemoVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="kangiten-demo"
        component={DemoVideoContent}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{}}
      />
    </>
  )
}

function DemoVideoContent() {
  return (
    <div className={absoluteFill} style={{ backgroundColor: '#0f172a' }}>
      <HookScene />
      <ProblemScene />
      <SolutionScene />
      <ProofScene />
      <CTAScene />
    </div>
  )
}

// Short version for social media (15s vertical)
export const ShortVideo: React.FC = () => {
  return (
    <Composition
      id="kangiten-short"
      component={ShortVideoContent}
      durationInFrames={450} // 15 seconds
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  )
}

function ShortVideoContent() {
  const frame = useCurrentFrame()

  // Rapid cuts for social media
  const scene = Math.floor(frame / 90) // 3 seconds per scene

  return (
    <div className={cn(absoluteFill, 'bg-slate-900', 'flex flex-col items-center justify-center px-8')}>
      {scene === 0 && (
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 rounded-2xl bg-green-500 flex items-center justify-center mx-auto mb-6">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Stop Missing WhatsApp Customers</h1>
          <p className="text-xl text-green-200">AI books appointments & answers FAQs 24/7</p>
        </div>
      )}
      {scene === 1 && (
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-8">Glow Salon Results</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-green-500/20">
              <div className="text-4xl font-bold text-green-400">15</div>
              <div className="text-green-200">Appts/week auto</div>
            </div>
            <div className="p-6 rounded-xl bg-green-500/20">
              <div className="text-4xl font-bold text-green-400">40%</div>
              <div className="text-green-200">Fewer missed msgs</div>
            </div>
          </div>
          <p className="text-green-200 text-lg">"ROI in week 1" — Priya, Owner</p>
        </div>
      )}
      {scene === 2 && (
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-8">Your Business Next?</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-white text-lg">FAQ automation</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-white text-lg">Auto booking</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-white text-lg">Lead capture</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-white text-lg">Full dashboard</span>
            </div>
          </div>
          <a href="https://calendly.com/kangiten/15min" className="inline-block w-64 h-14 bg-white text-green-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3" target="_blank" rel="noopener">
            <Calendar className="w-5 h-5" />
            Free Demo
          </a>
        </div>
      )}
      {scene >= 3 && (
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">First Month Free</h1>
          <p className="text-xl text-green-200 mb-8">30-min setup • Your number • Cancel anytime</p>
          <p className="text-green-200 text-2xl font-bold">kangiten.com</p>
        </div>
      )}
    </div>
  )
}