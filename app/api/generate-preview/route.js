import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

function buildPrompt(topic, count) {
  return `Generate ${count} multiple-choice questions about "${topic}" for beginners.
Return JSON ONLY with this exact shape:
{
  "questions": [
    {
      "question_text": "...",
      "options": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "correct_option": "a"
    }
  ]
}
Rules: Keep questions short. Exactly 4 options. correct_option must be one of a,b,c,d. No extra commentary.`
}

function parseJsonContent(content) {
  try {
    return JSON.parse(content)
  } catch {}
  const stripped = content
    ?.trim()
    ?.replace(/^```(?:json)?\s*/i, '')
    ?.replace(/\s*```\s*$/i, '')
  try {
    return JSON.parse(stripped)
  } catch {
    return null
  }
}

export async function GET(req) {
  const url = new URL(req.url)
  const topic = (url.searchParams.get('topic') || 'Basic JavaScript').slice(0, 200)
  const nRaw = Number(url.searchParams.get('count') || '1')
  const count = Math.min(Math.max(nRaw || 1, 1), 5)

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 })

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
        { role: 'system', content: 'You return strict JSON only.' },
        { role: 'user', content: buildPrompt(topic, count) },
      ],
      temperature: 0.7,
    })
    const content = completion.choices?.[0]?.message?.content || ''
    const json = parseJsonContent(content)
    const items = Array.isArray(json?.questions) ? json.questions : []
    const rows = items.map((q) => ({
      topic,
      question_text: q?.question_text || '',
      option_a: q?.options?.a || '',
      option_b: q?.options?.b || '',
      option_c: q?.options?.c || '',
      option_d: q?.options?.d || '',
      correct_option: q?.correct_option || 'a',
    }))

    return NextResponse.json({
      input: { topic, count, model },
      raw: content,
      json,
      rows,
    })
  } catch (e) {
    return NextResponse.json({ error: e.message, topic, count, model }, { status: 500 })
  }
}

