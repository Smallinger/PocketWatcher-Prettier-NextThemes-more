"use client";

import pb from "@/lib/pocketbase";
import { useEffect, useState } from "react";

interface PageView {
	id: string;
	count: number;
	collectionId: string;
	collectionName: string;
}

export default function DemoCounter() {
	const [count, setCount] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let unsubscribe: () => void;
		let retryCount = 0;
		const maxRetries = 3;

		async function initializeCounter() {
			try {
				setLoading(true);
				setError(null);

				// Log the PocketBase URL being used
				console.log("Connecting to PocketBase at:", pb.baseUrl);

				// Try to get the first counter
				const record = await pb
					.collection("page_views")
					.getFirstListItem<PageView>("");

				console.log("Successfully fetched counter:", record);
				setCount(record.count);

				// Subscribe to realtime changes
				unsubscribe = await pb
					.collection("page_views")
					.subscribe<PageView>("*", (e) => {
						console.log("Received realtime update:", e);
						if (e.record) {
							setCount(e.record.count);
						}
					});
			} catch (err) {
				console.error("Error in initializeCounter:", err);

				if (err instanceof Error && err.message.includes("404")) {
					console.log("No counter found, attempting to create one...");
					// If no counter exists, create one
					try {
						const record = await pb.collection("page_views").create<PageView>({
							count: 1,
						});
						console.log("Successfully created counter:", record);
						setCount(record.count);
					} catch (_createErr) {
						console.error("Error creating counter:", _createErr);
						if (retryCount < maxRetries) {
							retryCount++;
							console.log(`Retrying... Attempt ${retryCount} of ${maxRetries}`);
							setTimeout(initializeCounter, 1000 * retryCount);
							return;
						}
						setError(
							`Failed to create counter. Please ensure the collection exists with proper permissions. Error: ${_createErr}`,
						);
					}
				} else {
					if (retryCount < maxRetries) {
						retryCount++;
						console.log(`Retrying... Attempt ${retryCount} of ${maxRetries}`);
						setTimeout(initializeCounter, 1000 * retryCount);
						return;
					}
					setError(
						`Failed to initialize counter. Please try again. Error: ${err}`,
					);
				}
			} finally {
				setLoading(false);
			}
		}

		initializeCounter();

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, []);

	async function incrementCount() {
		try {
			const record = await pb
				.collection("page_views")
				.getFirstListItem<PageView>("");
			await pb.collection("page_views").update<PageView>(record.id, {
				count: record.count + 1,
			});
		} catch (_err) {
			setError("Failed to increment count. Please try again. Error: " + _err);
		}
	}

	if (loading) {
		return (
			<div className="animate-pulse rounded-lg border p-4 shadow-sm">
				<div className="mb-4 h-6 w-1/3 rounded bg-gray-200"></div>
				<div className="mb-4 h-4 w-2/3 rounded bg-gray-200"></div>
				<div className="h-10 w-32 rounded bg-gray-200"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-red-300 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-lg">
				<div className="mb-4 flex items-center">
					<svg
						className="mr-3 h-8 w-8 text-red-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h2 className="text-2xl font-bold text-red-800">Connection Error</h2>
				</div>

				<div className="mb-6">
					<h3 className="mb-2 text-lg font-semibold text-red-700">
						What happened?
					</h3>
					<p className="mb-4 font-medium text-red-600">{error}</p>

					<h3 className="mb-2 text-lg font-semibold text-red-700">
						Possible solutions:
					</h3>
					<ul className="mb-4 list-inside list-disc space-y-2 text-red-600">
						<li>Check if PocketBase server is running</li>
						<li>Verify the database connection</li>
						<li>Ensure the page_views collection exists</li>
						<li>Check network connectivity</li>
					</ul>
				</div>

				<div className="flex gap-3">
					<button
						onClick={() => window.location.reload()}
						className="flex items-center rounded-lg bg-red-600 px-6 py-2 text-white shadow-md transition-colors duration-200 hover:bg-red-700"
					>
						<svg
							className="mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
						Retry Connection
					</button>

					<a
						href="http://localhost:8090/_/"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center rounded-lg bg-red-100 px-6 py-2 text-red-700 shadow-md transition-colors duration-200 hover:bg-red-200"
					>
						<svg
							className="mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
						Open Admin Panel
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg border p-4 shadow-sm">
			<h2 className="mb-4 text-xl font-bold">Page Views</h2>
			<p className="mb-4">This page has been viewed {count} times</p>
			<button
				onClick={incrementCount}
				className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
			>
				Increment Count
			</button>
		</div>
	);
}
