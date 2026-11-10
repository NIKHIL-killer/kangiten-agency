import { NextRequest, NextResponse } from 'next/server'
import { generateResponse, clientConfigs } from '@/lib/chatbot'
import { createClient } from '@vercel/kv'

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId = 'demo-session' } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const config = clientConfigs['demo']
    if (!config) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Get conversation history
    const historyKey = `demo:conversation:${sessionId}`
    const history = (await kv.get(historyKey)) as Array<{role: string, content: string}> || []

    // Add user message
    history.push({ role: 'user', content: message })

    // Generate response
    const { textStream } = await generateResponse(
      history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      config
    )

    let fullResponse = ''
    for await (const chunk of textStream) {
      fullResponse += chunk
    }

    // Save to history
    history.push({ role: 'assistant', content: fullResponse })
    await kv.set(historyKey, history.slice(-20), { ex: 60 * 60 * 24 * 7 }) // 7 days

    return NextResponse.json({ response: fullResponse })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}