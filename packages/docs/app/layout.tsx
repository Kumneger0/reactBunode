import React from 'react';

import './global.css';
import Header from '@comp/header';

const style: React.CSSProperties = {
	fontFamily: '"Open Sans", sans-serif',
	fontOpticalSizing: 'auto',
	fontWeight: 400,
	fontStyle: 'normal'
};

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html style={style}>
			<head>
				<title>React Bunode Documentaion</title>

				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link
					href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="mx-auto text-white bg-gray-800 font-mono m-0 p-0 overflow-x-hidden">
				<Header />
				<div className="max-w-7xl mx-auto mt-28">{children}</div>
			</body>
		</html>
	);
}

export default Layout;
