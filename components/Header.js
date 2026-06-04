export default function Header() {
  return (
    <header className="w-full border-b py-4 px-6 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">Pranav Goyal</div>
        <nav className="space-x-4 text-sm text-gray-700">
          <a href="#projects">Projects</a>
          <a href="#resume">Resume</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}
