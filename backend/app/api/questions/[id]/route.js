import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { getAdminClient } from '../../../../lib/supabaseAdmin.js'

export async function GET(_req, { params }) {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ question: data })
}

export async function PUT(req, { params }) {
  const body = await req.json()
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('questions')
    .update({
      topic: body.topic,
      question_text: body.question_text,
      option_a: body.option_a,
      option_b: body.option_b,
      option_c: body.option_c,
      option_d: body.option_d,
      correct_option: body.correct_option,
    })
    .eq('id', params.id)
    .select()
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ question: data })
}

export async function DELETE(_req, { params }) {
  const supabase = getAdminClient()
  const { error } = await supabase.from('questions').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
