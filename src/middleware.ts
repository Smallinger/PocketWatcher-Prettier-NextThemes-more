import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "pocketbase";
import PocketBase from "pocketbase";

export async function middleware(request: NextRequest) {
	// Protected routes
	const protectedPaths = ["/dashboard"];
	const isProtectedPath = protectedPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path),
	);

	// Auth routes (login/register)
	const authPaths = ["/", "/register"];
	const isAuthPath = authPaths.some(
		(path) => request.nextUrl.pathname === path,
	);

	const authCookie = request.cookies.get("pb_auth");

	let isAuthenticated = false;
	let response = NextResponse.next();

	if (authCookie?.value) {
		try {
			const { token, model } = JSON.parse(authCookie.value);

			// Check if the token is expired
			if (!isTokenExpired(token)) {
				// Token is valid, now check if the user still exists
				const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
				pb.authStore.save(token, model);

				try {
					// Try to retrieve the user
					await pb.collection("users").getOne(model.id);
					isAuthenticated = true;
				} catch (error) {
					console.error(error);
					// User no longer exists or other error
					isAuthenticated = false;
					// Delete cookie
					response = NextResponse.next();
					response.cookies.delete("pb_auth");
				}
			} else {
				// Token is expired, delete cookie
				response = NextResponse.next();
				response.cookies.delete("pb_auth");
			}
		} catch (error) {
			// Error parsing the cookie or other errors
			console.error(error);
			response = NextResponse.next();
			response.cookies.delete("pb_auth");
		}
	}

	// Redirect authenticated users away from auth pages
	if (isAuthPath && isAuthenticated) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// Redirect unauthenticated users to login
	if (isProtectedPath && !isAuthenticated) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return response;
}
