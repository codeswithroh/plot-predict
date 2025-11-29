import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Provide a safe stub when env vars are not present, to remove runtime dependency
function createSupabaseStub() {
  const stubResponse = Promise.resolve({ data: [], error: null, count: 0 });
  const headCountResponse = (count: number = 0) => Promise.resolve({ data: null, error: null, count });
  const chain = {
    select: (_: any, opts?: { count?: 'exact'; head?: boolean }) => ({
      eq: (_c: string, _v: any) => (opts?.head ? headCountResponse(0) : stubResponse),
    }),
    insert: (_: any) => stubResponse,
    update: (_: any) => ({ eq: (_c: string, _v: any) => stubResponse }),
    delete: () => ({ eq: (_c: string, _v: any) => stubResponse }),
  } as any;
  return {
    from: (_table: string) => chain,
  } as any;
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createSupabaseStub()

// Database types
export interface BetActivity {
  id: string
  market_id: string
  user_address: string
  option: number
  amount: string
  shares: string
  tx_hash: string
  created_at: string
  market_title?: string
  option_a?: string
  option_b?: string
}

export interface Comment {
  id: string
  market_id: string
  user_address: string
  content: string
  created_at: string
  updated_at: string
}