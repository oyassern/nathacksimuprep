import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { getAdminClient } from '../../../lib/supabaseAdmin.js'

export async function GET() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ questions: data || [] })
}
