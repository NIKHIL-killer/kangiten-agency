import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bot,
  MessageSquare,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Clock
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: '24/7 Customer Support',
    description: 'Never miss a message. Your AI assistant handles inquiries, FAQs, and support requests around the clock.',
  },
  {
    icon: Calendar,
    title: 'Automated Booking',
    description: 'Let customers book appointments directly in WhatsApp. Syncs with Google Calendar, Calendly, or your CRM.',
  },
  {
    icon: TrendingUp,
    title: 'Lead Capture & Qualification',
    description: 'Turn conversations into qualified leads. AI asks the right questions and routes hot leads to your team instantly.',
  },
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Live on your WhatsApp Business number in 30 minutes. No coding required — we handle everything.',
  },
  {
    icon: Shield,
    title: 'Data Privacy & Security',
    description: 'End-to-end encryption, GDPR compliant, and your data never trains our models. You own everything.',
  },
  {
    icon: Users,
    title: 'Team Handoff',
    description: 'Seamless human takeover when needed. Your team gets context-rich summaries before they reply.',
  },
]

const stats = [
  { value: '90%', label: 'Faster response time' },
  { value: '3x', label: 'More qualified leads' },
  { value: '24/7', label: 'Availability' },
  { value: '50%', label: 'Less manual work' },
]

const testimonials = [
  {
    quote: "Our salon went from missing 40% of WhatsApp messages to booking 15 appointments/week automatically. ROI in week 1.",
    author: 'Priya Sharma',
    role: 'Owner, Glow Salon',
    avatar: 'PS',
  },
  {
    quote: "The chatbot handles 80% of patient queries — appointment booking, prescription refills, FAQs. My staff focuses on care, not phones.",
    author: 'Dr. Rajesh Kumar',
    role: 'Founder, City Clinic',
    avatar: 'RK',
  },
  {
    quote: "Lead response time dropped from 4 hours to 30 seconds. We closed 3 deals in the first month that would've gone cold.",
    author: 'Amit Patel',
    role: 'Director, Patel Realty',
    avatar: 'AP',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-brand-600" />
              <span className="font-display text-xl font-bold text-foreground">Kangiten</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Results</Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/demo" className="hidden sm:block text-sm font-medium text-foreground hover:underline">Try Demo</Link>
              <Link href="#contact">
                <Button className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-8 animate-in">
              <Zap className="h-4 w-4" />
              <span>First month free • No credit card • Cancel anytime</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 animate-in" style={{ animationDelay: '100ms' }}>
              AI WhatsApp Chatbots{' '}
              <span className="text-brand-600">That Actually Work</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in" style={{ animationDelay: '200ms' }}>
              We build custom AI assistants that book appointments, answer FAQs, and capture leads 24/7 on WhatsApp — so you never miss a customer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in" style={{ animationDelay: '300ms' }}>
              <Link href="#contact">
                <Button size="lg" className="gap-2 text-lg px-8 py-3">
                  Start Free Month <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-3">
                  <Bot className="h-5 w-5" /> Try Live Demo
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-600" />
                <span>Deployed in 30 mins</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-600" />
                <span>Your WhatsApp number</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-600" />
                <span>Full analytics dashboard</span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-in" style={{ animationDelay: `${500 + i * 100}ms` }}>
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything You Need to Automate WhatsApp</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Powerful features built for local businesses that rely on WhatsApp.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={feature.title} className="border-border/50 hover:border-brand-500/50 transition-colors animate-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Live in 3 Simple Steps</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">No technical knowledge required. We handle the setup.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Discovery Call', desc: '15-min call to understand your business, FAQs, booking flow, and goals.' },
              { step: '02', title: 'We Build & Deploy', desc: 'Custom bot trained on your content. Deployed on your WhatsApp Business number.' },
              { step: '03', title: 'You Get Results', desc: 'Dashboard access, weekly reports, and ongoing optimization included.' },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center animate-in" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="text-4xl font-bold text-brand-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Real Results from Local Businesses</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">See what happens when you stop missing messages.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={testimonial.author} className="border-border/50 animate-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">First month free. No setup fees. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '₹15,000',
                period: '/month',
                description: 'Perfect for solo professionals',
                features: ['Up to 1,000 messages/mo', 'FAQ automation', 'Basic analytics', 'Email support', '1 WhatsApp number'],
                cta: 'Start Free Month',
                popular: false,
              },
              {
                name: 'Growth',
                price: '₹35,000',
                period: '/month',
                description: 'For growing local businesses',
                features: ['Up to 10,000 messages/mo', 'Booking & calendar sync', 'Lead qualification', 'Priority support', 'CRM integration', '2 WhatsApp numbers'],
                cta: 'Start Free Month',
                popular: true,
              },
              {
                name: 'Scale',
                price: '₹75,000',
                period: '/month',
                description: 'Multi-location & agencies',
                features: ['Unlimited messages', 'Multi-location support', 'Custom integrations', 'Dedicated success manager', 'White-label dashboard', '5+ WhatsApp numbers', 'API access'],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan, i) => (
              <Card key={plan.name} className={`relative border-border/50 ${plan.popular ? 'border-brand-500 shadow-lg shadow-brand-500/10' : ''} animate-in`} style={{ animationDelay: `${i * 100}ms` }}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-brand-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="#contact">
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Stop Missing Customers?</h2>
          <p className="text-lg text-brand-200 mb-8">Join 50+ local businesses automating WhatsApp with Kangiten. First month free — no risk.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#contact">
              <Button size="lg" className="gap-2 text-lg px-8 py-3 bg-white text-brand-900 hover:bg-brand-100">
                Start Free Month <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-3 border-white text-white hover:bg-white/10">
                <Bot className="h-5 w-5" /> Try Live Demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-400">No credit card required • 30-minute setup • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-8 w-8 text-brand-600" />
                <span className="font-display text-xl font-bold text-foreground">Kangiten</span>
              </div>
              <p className="text-muted-foreground text-sm">AI WhatsApp chatbots for local businesses. Built in India, for the world.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2024 Kangiten Agency. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="https://twitter.com/kangiten" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener">Twitter</a>
              <a href="https://linkedin.com/company/kangiten" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener">LinkedIn</a>
              <a href="https://github.com/kangiten" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}