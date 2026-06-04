import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

	const { name, email, message } = req.body || {}
	if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })

	// Save message to Supabase
	try {
		const { error } = await supabase.from('contact_messages').insert([{ name, email, message }])
		if (error) console.error('Supabase insert error', error)
	} catch (err) {
		console.error('Supabase error', err)
	}

	// Send notification email via Resend (if configured)
	try {
		const resendApiKey = process.env.RESEND_API_KEY
		const from = process.env.RESEND_FROM_EMAIL
		const to = process.env.RESEND_TO_EMAIL || 'pranavgoyal0711@gmail.com'

		if (!resendApiKey || !from) {
			console.warn('Resend not configured; skipping email send')
			return res.status(200).json({ ok: true, notice: 'saved; email not sent (Resend not configured)' })
		}

		const payload = {
			from,
			to: [to],
			subject: `Website contact from ${name}`,
			html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message)}</p>`
		}

		const r = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${resendApiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})

		if (!r.ok) {
			const text = await r.text()
			console.error('Resend send failed', r.status, text)
			return res.status(500).json({ error: 'Failed to send email' })
		}
	} catch (err) {
		console.error('Resend error', err)
		return res.status(500).json({ error: 'Failed to send email' })
	}

	return res.status(200).json({ ok: true })
}

function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}
