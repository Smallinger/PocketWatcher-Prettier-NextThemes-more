"use client";

import { signup, type ActionResult } from "../actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { useEffect } from "react";
import { ModeToggle } from "@/components/ModeToggle";

const initialState: ActionResult = {
	success: false,
	error: null,
};

export default function RegisterPage() {
	const router = useRouter();
	const [state, formAction] = useActionState(
		async (_: ActionResult, formData: FormData) => {
			return await signup(formData);
		},
		initialState,
	);

	useEffect(() => {
		if (state?.success) {
			router.push("/dashboard");
		}
	}, [state?.success, router]);

	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-950/50 dark:to-gray-900/50">
			<div className="absolute right-4 top-4">
				<ModeToggle />
			</div>
			<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30">
				<h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
					Create Account
				</h1>

				<div className="mb-6 flex">
					<Link
						href="/login"
						className="flex-1 py-2 text-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					>
						Sign In
					</Link>
					<Link
						href="/register"
						className="flex-1 border-b-2 border-blue-600 py-2 text-center font-medium text-blue-600 dark:border-blue-500 dark:text-blue-400"
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
								minLength={8}
								className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
								placeholder="••••••••"
							/>
						</label>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							Must be at least 8 characters
						</p>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Confirm Password
							<input
								name="passwordConfirm"
								type="password"
								required
								minLength={8}
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
						Create Account
					</button>
				</form>
			</div>
		</main>
	);
}
