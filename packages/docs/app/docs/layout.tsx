import React from 'react';

// export const rootLayoutNoWrap = true;

function DocsLayout({ children }: { children: React.ReactNode }) {
	return <main>{children}</main>;
}

export default DocsLayout;
