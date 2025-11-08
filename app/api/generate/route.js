import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { getAdminClient } from '../../../lib/supabaseAdmin.js'
import OpenAI from 'openai'

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

export async function POST(req) {
  const { topic, count } = await req.json()
  if (!topic) return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  const n = Math.min(Math.max(Number(count) || 1, 1), 5)

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  let json
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You return strict JSON only.' },
        { role: 'user', content: buildPrompt(topic, n) },
      ],
      temperature: 0.7,
    })
    const content = completion.choices?.[0]?.message?.content || ''
    json = JSON.parse(content)
  } catch (e) {
    return NextResponse.json({ error: 'OpenAI error: ' + e.message }, { status: 500 })
  }

  const items = Array.isArray(json?.questions) ? json.questions : []
  if (items.length === 0) {
    return NextResponse.json({ error: 'No questions returned' }, { status: 500 })
  }

  // Validate and map to DB rows
  const rows = items.map((q) => ({
    topic,
    question_text: q?.question_text || '',
    option_a: q?.options?.a || '',
    option_b: q?.options?.b || '',
    option_c: q?.options?.c || '',
    option_d: q?.options?.d || '',
    correct_option: q?.correct_option || 'a',
  }))

  const supabase = getAdminClient()
  const { data, error } = await supabase.from('questions').insert(rows).select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inserted: data })
}
