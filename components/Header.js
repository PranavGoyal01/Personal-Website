export default function Header() {
	return (
		<header className="w-full py-4 px-6 bg-transparent backdrop-blur-sm">
			<div className='max-w-4xl mx-auto flex items-center justify-between'>
				<div className='text-xl font-semibold'>Pranav Goyal</div>
				<div className="flex items-center gap-4">
				  <nav className="space-x-4 text-sm muted hidden sm:inline">
					<a href='#projects'>Projects</a>
					<a href='#resume'>Resume</a>
					<a href='#contact'>Contact</a>
				</nav>
				  <DarkToggle />
				</div>
			</div>
		</header>
	);
}
