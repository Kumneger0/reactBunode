import React from 'react';

import './global.css';

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head>
				<title>React Bunode Documentaion</title>
			</head>
			<body className="mx-auto text-white bg-gray-800 font-mono m-0 p-0 overflow-x-hidden">
				<div className="max-w-7xl mx-auto">{children}</div>
			</body>
		</html>
	);
}

export default Layout;
