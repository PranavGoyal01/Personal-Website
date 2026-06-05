export default function Hero({ title, subtitle, cta }) {
  return (
    <section id='top' className='hero'>
      <div className='hero-bg' aria-hidden='true' />
      <div className='hero-inner'>
        <div className='hero-copy reveal'>
          <div className='hero-kicker'>Stevens CS · Quant Finance · Cybersecurity</div>
          <h1 className='hero-title'>{title}</h1>
          <p className='hero-lead'>{subtitle}</p>
          <div className='hero-actions'>
            {cta && (
              <a className='btn-primary' href={cta.href}>
                {cta.label}
              </a>
            )}
            <a className='btn-secondary' href='#resume'>Resume</a>
            <a className='btn-ghost' href='#contact'>Contact</a>
          </div>
          <div className='hero-stats'>
            <div className='stat'><strong>3.7/4.0</strong><span>GPA in CS</span></div>
            <div className='stat'><strong>2028</strong><span>Expected graduation</span></div>
            <div className='stat'><strong>6</strong><span>Featured projects</span></div>
          </div>
        </div>

        <div className='hero-side reveal' style={{ animationDelay: '120ms' }}>
          <div className='panel-strong'>
            <div className='eyebrow'>Current focus</div>
            <p className='mt-3 text-lg font-semibold leading-relaxed'>Building systems that sit between markets, machines, and secure software.</p>
          </div>
          <div className='mini-grid'>
            <div className='tile p-4'>
              <div className='eyebrow mb-2'>Now</div>
              <p className='text-sm muted leading-relaxed'>Refining the portfolio, then updating projects monthly through a lightweight dashboard.</p>
            </div>
            <div className='tile p-4'>
              <div className='eyebrow mb-2'>Stack</div>
              <p className='text-sm muted leading-relaxed'>Next.js, Tailwind, Supabase, Resend, Vercel.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
