export default function ProjectCard({ project, highlighted }) {
	return (
		<article className={`card ${highlighted ? 'card-accent' : ''}`}>
			<div className='relative z-10'>
				<div className='flex items-start justify-between gap-4'>
					<div>
						<div className='eyebrow'>Featured work</div>
						<h3 className='mt-2 text-2xl font-semibold text-white'>{project.title}</h3>
					</div>
					<span className='chip'>Case study</span>
				</div>
				<p className='mt-4 max-w-2xl text-sm leading-7 text-[rgba(244,247,251,0.74)]'>{project.blurb}</p>
				<div className='mt-5 flex items-center justify-between gap-3'>
					<div className='flex flex-wrap gap-2'>
						<span className='chip'>Problem</span>
						<span className='chip'>Approach</span>
						<span className='chip'>Tech</span>
					</div>
					<a className='btn-ghost' href={project.repo} target='_blank' rel='noreferrer'>
						View repository
					</a>
				</div>
			</div>
		</article>
	)
}
