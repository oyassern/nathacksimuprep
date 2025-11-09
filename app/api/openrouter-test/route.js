import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 })
  }

  const model = process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || 'z-ai/glm-4.5-air:free'

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
      'X-Title': process.env.OPENROUTER_APP_NAME || 'MCQ Generator',
    },
  })

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'Return strict JSON only.' },
        { role: 'user', content: 'Return exactly this JSON: {"ok":true}' },
      ],
      temperature: 0,
    })
    const content = completion.choices?.[0]?.message?.content || ''
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      parsed = null
    }
    return NextResponse.json({ model, content, parsed })
  } catch (e) {
    return NextResponse.json({ error: e.message, model }, { status: 500 })
  }
}

