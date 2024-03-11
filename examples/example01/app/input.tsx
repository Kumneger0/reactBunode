'use client';
// import { useState, useEffect, use } from "react";

function Input() {
	function formAction(formData: FormData) {
		console.log(formData);
	}
	return (
		<div>
			<form onSubmit={(e) => e.preventDefault()}>
				<input type="text" name="name" />
				<input type="submit" />
			</form>
		</div>
	);
}

export default Input;
