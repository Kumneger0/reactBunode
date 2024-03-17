import React from 'react';

const LandingPage = async () => {
	return (
		<>
			<div className="py-6 flex flex-col justify-center overflow-y-hidden sm:py-12">
				<div className="relative py-3 sm:max-w-xl sm:mx-auto">
					<div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
					<div className="relative px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
						<h1 className="text-4xl font-bold text-center">ReactBunode</h1>
						<p className="text-center mt-4">A powerful SSG library for React, built with love.</p>
						<div className="flex justify-center mt-8">
							<a
								href="/docs#get-started"
								className="px-4 py-2 text-white font-semibold bg-blue-500 rounded-lg shadow-md hover:bg-blue-700"
							>
								Get Started
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LandingPage;
