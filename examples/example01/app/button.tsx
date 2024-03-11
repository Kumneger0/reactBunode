function Button(
	props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
		children: React.ReactNode;
	}
) {
	return <button {...props}>{props.children}</button>;
}

export default Button;
