export default function ProjectCard({ project, highlighted }) {
  return (
    <article className={`p-6 rounded-lg shadow ${highlighted ? 'border-2 border-accent' : 'border'} bg-white dark:bg-gray-900`}> 
      <h3 className="text-xl font-bold">{project.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{project.blurb}</p>
      <div className="mt-4">
        <a className="text-accent hover:underline" href={project.repo} target="_blank" rel="noreferrer">View repository</a>
      </div>
    </article>
  )
}
