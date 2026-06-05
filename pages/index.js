import Head from 'next/head'
import Header from '../components/Header'
import ProjectCard from '../components/ProjectCard'
import Hero from '../components/Hero'

const projects = [
{
title: 'AI-Cars-in-Real-Cities',
repo: 'https://github.com/PranavGoyal01/AI-Cars-in-Real-Cities',
blurb: 'Created a simulation where AI cars navigate real cities using OpenStreetMap data and Dijkstra pathing.'
}
]

const focusAreas = ['SWE', 'Quant Analyst', 'AI/ML', 'Program Mgmt']
const skills = ['Python', 'Java', 'JavaScript', 'SQL', 'AWS', 'Vercel', 'Supabase', 'GitHub Actions']

export default function Home() {
return (
<>
<Head>
<title>Pranav Goyal - Portfolio</title>
<meta name='description' content='Portfolio and job application site for Pranav Goyal, Stevens CS student.' />
</Head>
<Header />
<div className='page-shell'>
<Hero
title='AI-driven simulations, quantitative systems, and secure engineering'
subtitle='I build full-stack systems and research-grade simulations that combine quantitative finance, ML, and security.'
cta={{ label: 'View Projects', href: '#projects' }}
/>

<section className='section grid gap-4 md:grid-cols-2'>
<div className='panel reveal'>
<div className='eyebrow'>About</div>
<p className='mt-3 text-base leading-8 text-[rgba(244,247,251,0.8)]'>
I'm an ambitious Stevens student blending quantitative finance, software engineering, and leadership with a strong bias toward building, analyzing, and getting things done.
</p>
</div>
<div className='panel reveal' style={{ animationDelay: '90ms' }}>
<div className='eyebrow'>Focus areas</div>
<div className='mt-4 flex flex-wrap gap-2'>
{focusAreas.map((item) => (
<span key={item} className='chip'>{item}</span>
))}
</div>
</div>
</section>

<section id='projects' className='section section-grid'>
<div className='span-7 reveal'>
<ProjectCard project={projects[0]} highlighted />
</div>
<div className='span-5 reveal' style={{ animationDelay: '100ms' }}>
<div className='panel h-full'>
<div className='eyebrow'>Projects</div>
<h2 className='mt-3 text-3xl'>Built to show depth, not just breadth.</h2>
<p className='mt-4 text-sm leading-7 text-[rgba(244,247,251,0.74)]'>
The current priority is the hero project, with the remaining work organized into a monthly refresh workflow so the site stays current without friction.
</p>
<div className='mt-5 grid gap-3'>
{skills.map((skill) => (
<div key={skill} className='tile px-4 py-3 text-sm text-[rgba(244,247,251,0.82)]'>{skill}</div>
))}
</div>
</div>
</div>
</section>

<section id='now' className='section section-grid'>
<div className='span-6 reveal'>
<div className='panel h-full'>
<div className='eyebrow'>Now</div>
<h2 className='mt-3 text-3xl'>Current focus</h2>
<div className='timeline mt-4'>
<div className='timeline-item'><span className='timeline-dot' /><div><strong>Portfolio polish</strong><p className='muted text-sm mt-1'>Finishing the visual system and preparing a clean launch by the deadline.</p></div></div>
<div className='timeline-item'><span className='timeline-dot' /><div><strong>Dashboard design</strong><p className='muted text-sm mt-1'>Planning a lightweight Supabase-backed editor for monthly updates.</p></div></div>
</div>
</div>
</div>
<div id='resume' className='span-6 reveal' style={{ animationDelay: '100ms' }}>
<div className='panel h-full'>
<div className='eyebrow'>Resume</div>
<h2 className='mt-3 text-3xl'>Download and review</h2>
<p className='mt-4 text-sm leading-7 text-[rgba(244,247,251,0.74)]'>
The uploaded resume is ready to link once deployed. This section will support a direct download and a future interactive version.
</p>
<div className='mt-5 flex flex-wrap gap-3'>
<a className='btn-primary' href='/resume.pdf'>Download resume</a>
<a className='btn-secondary' href='#contact'>Contact me</a>
</div>
</div>
</div>
</section>

<section id='contact' className='section footer-band reveal'>
<div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
<div>
<div className='eyebrow'>Contact</div>
<p className='mt-2 text-sm text-[rgba(244,247,251,0.8)]'>
pranavgoyal0711@gmail.com |{' '}
<a className='underline decoration-[rgba(225,29,48,0.6)] underline-offset-4' href='https://linkedin.com/in/pranav-goyal-cs'>
LinkedIn
</a>
</p>
</div>
<div className='flex gap-3'>
<a className='btn-ghost' href='https://linkedin.com/in/pranav-goyal-cs'>LinkedIn</a>
<a className='btn-primary' href='mailto:pranavgoyal0711@gmail.com'>Email me</a>
</div>
</div>
</section>
</div>
</>
)
}
