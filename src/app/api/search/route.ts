import { NextRequest, NextResponse } from "next/server";
import pb from "@/lib/pocketbase";
import { ClientResponseError } from "pocketbase";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("q") || "";
	const filters = searchParams.get("filters")?.split(",") || [];

	try {
		const filterConditions: string[] = [];
		if (query) {
			filterConditions.push(`title ~ "${query}" || content ~ "${query}"`);
		}

		filters.forEach((filter: string) => {
			const [key, value] = filter.split(":");
			if (key && value) {
				filterConditions.push(`${key} = "${value}"`);
			}
		});

		const results = await pb.collection("posts").getList(1, 20, {
			filter: filterConditions.join(" && "),
			expand: "user",
			sort: "-created",
		});

		return NextResponse.json(results);
	} catch (error) {
		if (error instanceof ClientResponseError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		return NextResponse.json(
			{ error: "Failed to perform search" },
			{ status: 500 },
		);
	}
}
