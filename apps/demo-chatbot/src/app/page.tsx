import Link from 'next/link'
import { Bot, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@kangiten/ui/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@kangiten/ui/components/ui/card'

export default function DemoHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-brand-600" />
              <span className="font-display text-xl font-bold text-foreground">Kangiten</span>
            </div>
            <Link href="https://kangiten.com" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Back to Main Site
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Live Demo — Glow Salon</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Try Our <span className="text-brand-600">AI Assistant</span> Live
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Chat with the AI assistant we built for Glow Salon. Ask about services, timings, prices, or try booking an appointment!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/demo">
              <Button size="lg" className="gap-2 text-lg px-8 py-3">
                <Sparkles className="h-5 w-5" />
                Start Chatting
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
            {[
              { icon: CheckCircle, title: 'Real AI', desc: 'GPT-4o powered responses' },
              { icon: CheckCircle, title: 'WhatsApp Ready', desc: 'Same logic deploys to WhatsApp' },
              { icon: CheckCircle, title: 'Business Logic', desc: 'FAQ, booking, lead capture' },
            ].map((item) => (
              <Card key={item.title} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-3 mx-auto">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted/50 rounded-xl p-6 max-w-xl mx-auto text-left">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-600" />
              Try asking:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• "What are your timings?"</li>
              <li>• "What services do you offer?"</li>
              <li>• "I want to book a haircut for Friday 3pm"</li>
              <li>• "How much for a facial?"</li>
              <li>• "Can I speak to a human?"</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Built with <span className="text-brand-600">❤️</span> by Kangiten Agency
        </p>
      </footer>
    </div>
  )
}