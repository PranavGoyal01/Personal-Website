import Head from 'next/head'
import Header from '../components/Header'
import ProjectCard from '../components/ProjectCard'

const projects = [
  {
    title: 'AI-Cars-in-Real-Cities',
    repo: 'https://github.com/PranavGoyal01/AI-Cars-in-Real-Cities',
    blurb:
      'Simulation where AI cars navigate real cities using OpenStreetMap data and Dijkstra pathing.'
  }
]

export default function Home() {
  return (
    <>
      <Head>
        <title>Pranav Goyal — Portfolio</title>
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-12">
          <h1 className="text-4xl font-bold">Pranav Goyal</h1>
          <p className="mt-3 text-lg text-gray-600">I'm an ambitious Stevens student blending quantitative finance, software engineering, and leadership with a strong bias toward building, analyzing, and getting things done.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Project</h2>
          <ProjectCard project={projects[0]} highlighted />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Other Projects</h2>
          <div className="grid gap-4">
            {/* Placeholder for additional project cards */}
          </div>
        </section>
      </main>
    </>
  )
}
