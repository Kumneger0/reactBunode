import React from 'react';

function Layout({ children }) {
	return (
		<html>
			<head>
				<title>this is simple ssg application</title>
			</head>
			<body className="mx-auto text-white bg-gray-900 m-0 p-0 h-screen overflow-x-hidden">
				<div>{children}</div>
			</body>
		</html>
	);
}

export default Layout;
