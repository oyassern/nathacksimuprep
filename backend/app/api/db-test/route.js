import { NextResponse } from 'next/server'
import { getAdminClient } from '../../../lib/supabaseAdmin.js'

export const dynamic = 'force-dynamic'

function normalize(name) {
  const n = (name || '').trim()
  if (!/^[a-zA-Z0-9_]+$/.test(n)) return null
  return n.toLowerCase()
}

export async function GET(req) {
  const url = new URL(req.url)
  const tableParam = url.searchParams.get('table')
  const schemaParam = (url.searchParams.get('schema') || 'public').trim()
  const table = normalize(tableParam)
  if (!table) return NextResponse.json({ error: 'Invalid table' }, { status: 400 })

  try {
    const supabase = getAdminClient()
    const client = schemaParam && schemaParam !== 'public' ? supabase.schema(schemaParam) : supabase
    const { data, error } = await client.from(table).select('*').limit(10)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ rows: data ?? [] })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
