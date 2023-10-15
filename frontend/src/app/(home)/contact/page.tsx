"use client";

import { useState } from "react";

export default function ContactForm() {
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: any) {
		event.preventDefault();
		setLoading(true);

		const data = {
			name: String(event.target.name.value),
			email: String(event.target.email.value),
			message: String(event.target.message.value),
		};

		const response = await fetch("/api/contact", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (response.ok) {
			console.log("Message sent successfully");
			setLoading(false);
			// reset the form
			event.target.name.value = "";
			event.target.email.value = "";
			event.target.message.value = "";
		}
		if (!response.ok) {
			console.log("Error sending message");
			setLoading(false);
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<div className="w-full flex flex-col my-4">
				<label className="font-bold text-gray-800" htmlFor="name">
					Name
				</label>
				<input
					type="text"
					minLength={3}
					maxLength={150}
					required
					className=" p-4 bg-gray-50 border border-gray-100 "
					autoComplete="off"
					id="name"
				/>
			</div>
			<div className="w-full flex flex-col my-4">
				<label className="font-bold text-gray-800" htmlFor="email">
					Email
				</label>
				<input
					type="email"
					minLength={5}
					maxLength={150}
					required
					className=" p-4 bg-gray-50 border border-gray-100 "
					autoComplete="off"
					id="email"
				/>
			</div>
			<div>
				<label className="font-bold text-gray-800" htmlFor="message">
					Message
				</label>
				<textarea
					rows={4}
					required
					minLength={10}
					maxLength={500}
					name="message"
					className="w-full p-4 bg-gray-50 border border-gray-100 "
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				className="px-4 py-2 w-40 bg-gray-700 disabled:bg-gray-400 disabled:text-gray-100 text-white font-medium mt-4">
				Send Message
			</button>
		</form>
	);
}