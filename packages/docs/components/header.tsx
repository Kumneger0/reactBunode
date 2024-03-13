import React from 'react';

function Header() {
	return (
		<header className="w-screen h-[80px] bg-gray-800 fixed z-50 top-0 ">
			<nav className="max-w-7xl h-full flex items-center justify-between w-full mx-auto py-4 ">
				<div className="font-bold px-4 py-2 text-3xl">
					<a href="/">ReactBunode</a>
				</div>
				<div>github icon</div>
			</nav>
		</header>
	);
}

export default Header;
