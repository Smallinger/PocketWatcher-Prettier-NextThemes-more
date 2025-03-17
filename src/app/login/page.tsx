import LoginForm from "@/components/auth/LoginForm";
import { ModeToggle } from "@/components/ModeToggle";

export default function LoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-950/50 dark:to-gray-900/50">
			<div className="absolute right-4 top-4">
				<ModeToggle />
			</div>
			<LoginForm />
		</main>
	);
}
