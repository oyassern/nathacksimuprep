import { createClient } from '@supabase/supabase-js'

let cached

export function getAdminClient() {
  if (cached) return cached
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  cached = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  return cached
}

