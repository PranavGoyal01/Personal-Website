export default function Hero({ title, subtitle, cta }) {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-inner">
        <div className="reveal stagger">
          <div>
            <h1 className="text-5xl md:text-6xl leading-tight font-extrabold">{title}</h1>
            <p className="mt-4 text-lg muted max-w-2xl">{subtitle}</p>
          </div>
          <div className="mt-8">
            {cta && (
              <a className="inline-block px-6 py-3 rounded-md bg-accent text-white font-medium shadow hover:opacity-95" href={cta.href}>
                {cta.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
