"use client";

import { login, type ActionResult } from "@/app/actions";
import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

const initialState: ActionResult = {
	success: false,
	error: null,
};

export default function LoginForm() {
	const router = useRouter();
	const [state, formAction] = useActionState(
		async (_: ActionResult, formData: FormData) => {
			return await login(formData);
		},
		initialState,
	);

	// Redirect on success
	if (state?.success) {
		router.push("/dashboard");
		return null;
	}

	return (
		<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30">
			<h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
				Welcome Back
			</h1>

			<div className="mb-6 flex">
				<Link
					href="/login"
					className="flex-1 border-b-2 border-blue-600 py-2 text-center font-medium text-blue-600 dark:border-blue-500 dark:text-blue-400"
				>
					Sign In
				</Link>
				<Link
					href="/register"
					className="flex-1 py-2 text-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
				>
					Sign Up
				</Link>
			</div>

			<form action={formAction} className="space-y-6">
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
						Email
						<input
							name="email"
							type="email"
							required
							className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
							placeholder="you@example.com"
						/>
					</label>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
						Password
						<input
							name="password"
							type="password"
							required
							className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
							placeholder="••••••••"
						/>
					</label>
				</div>

				{state?.error && (
					<div
						aria-live="polite"
						role="status"
						className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400"
					>
						{state.error}
					</div>
				)}

				<button
					type="submit"
					className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"
				>
					Sign In
				</button>
			</form>
		</div>
	);
}
