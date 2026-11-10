'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Check, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@kangiten/ui/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@kangiten/ui/components/ui/card'
import { cn } from '@kangiten/ui/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm the AI assistant for Glow Salon. How can I help you today? You can ask about our services, timings, or book an appointment! ✨",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again in a moment.',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickReplies = [
    'What are your timings?',
    'What services do you offer?',
    'Book an appointment',
    'What are your prices?',
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto bg-background">
      {/* Header */}
      <Card className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Glow Salon Assistant</h3>
              <p className="text-xs text-muted-foreground">AI-powered • Responds in seconds</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onWheel={e => {
          if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight) {
            e.currentTarget.scrollTop = e.currentTarget.scrollHeight
          }
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-2 animate-in',
              message.role === 'user' ? 'flex-row-reverse' : ''
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                message.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-brand-100 text-brand-600'
              )}
            >
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[75%] rounded-2xl px-4 py-2',
                message.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-sm'
                  : 'bg-muted rounded-tl-sm'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={cn('text-xs mt-1', message.role === 'user' ? 'text-brand-100' : 'text-muted-foreground')}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 animate-in">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-brand-600" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-brand-600 animate-spin" />
              <span className="text-sm text-muted-foreground">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 justify-center">
          {quickReplies.map((reply) => (
            <Button
              key={reply}
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(reply)
                handleSend(new Event('submit') as React.FormEvent)
              }}
              className="h-8 px-3 text-xs"
            >
              {reply}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-border bg-background/95 backdrop-blur-sm sticky bottom-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about services, book appointment, or just say hi..."
            className="flex-1 px-4 py-2 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            disabled={isLoading}
            autoFocus
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-brand-600 hover:bg-brand-700"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Demo mode • Powered by Kangiten Agency
        </p>
      </form>
    </div>
  )
}