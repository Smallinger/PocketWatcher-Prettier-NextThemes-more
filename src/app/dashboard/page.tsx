import { cookies } from "next/headers";
import { logout } from "../actions";

export default async function Page() {
	const cookieStore = await cookies();
	const cookie = cookieStore.get("pb_auth");

	if (!cookie) throw new Error("Not logged in");

	const { model } = JSON.parse(cookie.value);

	return (
		<main className="min-h-screen bg-background p-8 dark:bg-gray-950">
			<div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-foreground dark:text-white">
						Dashboard
					</h1>
					<form action={logout}>
						<button
							type="submit"
							className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
						>
							Logout
						</button>
					</form>
				</div>

				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-foreground dark:text-white">
						User Information
					</h2>
					<pre className="overflow-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-700 dark:text-gray-200">
						{JSON.stringify(model, null, 2)}
					</pre>
				</div>
			</div>
		</main>
	);
}
