import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { name, email, message } = req.body

  // save to Supabase (table: contact_messages)
  try{
    await supabase.from('contact_messages').insert([{ name, email, message }])
  }catch(e){
    console.error('supabase error', e)
  }

  // TODO: send email with Resend from server-side using RESEND_API_KEY

  return res.status(200).json({ ok: true })
}
