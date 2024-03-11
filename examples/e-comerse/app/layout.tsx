import React from 'react';

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head>
				<title>demo e-commerse application</title>
			</head>
			<body className="mx-auto text-white bg-gray-900 m-0 p-0 h-screen overflow-x-hidden">
				<div className="max-w-6xl mx-auto">{children}</div>
			</body>
		</html>
	);
}

export default Layout;
