import { NextRequest, NextResponse } from 'next/server'
import { generateResponse, ClientConfig } from '@/lib/chatbot'
import { createClient } from '@vercel/kv'

// In production, fetch from database/edge config
const clientConfigs: Record<string, ClientConfig> = {
  'demo': {
    id: 'demo',
    name: 'Glow Salon',
    businessType: 'salon',
    whatsappNumber: '+919876543210',
    systemPrompt: '',
    faqs: [
      {
        question: 'What are your timings?',
        answer: 'We\'re open 10 AM - 8 PM, Monday to Saturday. Closed Sundays.',
        keywords: ['timing', 'hours', 'open', 'close', 'time'],
      },
      {
        question: 'What services do you offer?',
        answer: 'Haircuts, coloring, styling, facials, manicure/pedicure, waxing, and bridal packages.',
        keywords: ['service', 'offer', 'menu', 'treatment', 'price'],
      },
      {
        question: 'Do I need an appointment?',
        answer: 'Walk-ins welcome but appointments recommended to avoid wait. Book via WhatsApp!',
        keywords: ['appointment', 'booking', 'walkin', 'walk-in', 'reserve'],
      },
      {
        question: 'What are your prices?',
        answer: 'Haircuts from ₹500, coloring from ₹2000, facials from ₹1500. Full menu on request.',
        keywords: ['price', 'cost', 'rate', 'charge', 'fee'],
      },
    ],
    bookingEnabled: true,
    calendarUrl: 'https://calendly.com/glow-salon',
    model: 'gpt-4o',
    temperature: 0.3,
    maxTokens: 500,
  },
}

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function GET(request: NextRequest) {
  // WhatsApp webhook verification
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // WhatsApp Business API webhook payload
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const messages = value?.messages
    const contacts = value?.contacts

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: 'ok' })
    }

    const message = messages[0]
    const contact = contacts?.[0]
    const phoneNumber = message.from
    const clientId = 'demo' // In production: map phone number to client

    const config = clientConfigs[clientId]
    if (!config) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Get conversation history from KV
    const historyKey = `conversation:${clientId}:${phoneNumber}`
    const history = (await kv.get(historyKey)) as Array<{role: string, content: string}> || []

    // Add incoming message to history
    const userMessage = message.text?.body || message.type
    history.push({ role: 'user', content: userMessage })

    // Keep last 20 messages
    const recentHistory = history.slice(-20)

    // Generate AI response
    const { textStream } = await generateResponse(
      recentHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      config
    )

    // Stream response and collect for storage
    let fullResponse = ''
    for await (const chunk of textStream) {
      fullResponse += chunk
    }

    // Save response to history
    history.push({ role: 'assistant', content: fullResponse })
    await kv.set(historyKey, history.slice(-20), { ex: 60 * 60 * 24 * 30 }) // 30 days

    // In production: Send response back via WhatsApp API
    // await sendWhatsAppMessage(phoneNumber, fullResponse, config.whatsappNumber)

    console.log(`[${clientId}] ${phoneNumber}: ${userMessage}`)
    console.log(`[${clientId}] Bot: ${fullResponse}`)

    return NextResponse.json({ status: 'ok', response: fullResponse })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}