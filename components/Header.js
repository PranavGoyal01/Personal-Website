import DarkToggle from './DarkToggle'

export default function Header() {
	return (
		<header className='sticky top-0 z-30 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(6,6,9,0.7)] backdrop-blur-xl'>
			<div className='page-shell flex h-20 items-center justify-between gap-4'>
				<a href='#top' className='flex items-center gap-3 font-semibold tracking-tight text-white'>
					<span className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(225,29,48,0.18)] text-sm text-[#ffd7db] ring-1 ring-[rgba(225,29,48,0.36)]'>PG</span>
					<span className='hidden sm:block'>Pranav Goyal</span>
				</a>
				<div className='flex items-center gap-3'>
					<nav className='hidden items-center gap-6 text-sm text-[rgba(244,247,251,0.72)] md:flex'>
						<a href='#projects'>Projects</a>
						<a href='#now'>Now</a>
						<a href='#resume'>Resume</a>
						<a href='#contact'>Contact</a>
					</nav>
					<DarkToggle />
				</div>
			</div>
		</header>
	);
}
