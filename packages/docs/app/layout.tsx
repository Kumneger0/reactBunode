import React from 'react';

import './global.css';
import Header from '@comp/header';

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head>
				<title>React Bunode Documentaion</title>
			</head>
			<body className="mx-auto text-slate-200 bg-gray-900 font-mono m-0 p-0 overflow-x-hidden">
				<Header />
				<div className="max-w-7xl mx-auto mt-28">{children}</div>
			</body>
		</html>
	);
}

export default Layout;
