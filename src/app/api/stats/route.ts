import { NextRequest, NextResponse } from "next/server";
import pb from "@/lib/pocketbase";
import { ClientResponseError } from "pocketbase";

type TimeRange = "24h" | "7d" | "30d";
type Metric = "posts" | "comments";

interface Stats {
	[key: string]: number;
}

interface RecordItem {
	expand?: {
		user?: {
			username?: string;
		};
	};
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const timeRange = (searchParams.get("timeRange") || "7d") as TimeRange;
	const metric = (searchParams.get("metric") || "posts") as Metric;
	const groupBy = searchParams.get("groupBy") || "user";

	try {
		let filter = "";
		const now = new Date();

		switch (timeRange) {
			case "24h":
				filter = `created >= "${new Date(
					now.getTime() - 24 * 60 * 60 * 1000,
				).toISOString()}"`;
				break;
			case "7d":
				filter = `created >= "${new Date(
					now.getTime() - 7 * 24 * 60 * 60 * 1000,
				).toISOString()}"`;
				break;
			case "30d":
				filter = `created >= "${new Date(
					now.getTime() - 30 * 24 * 60 * 60 * 1000,
				).toISOString()}"`;
				break;
			default:
				filter = "";
		}

		const collection = metric === "comments" ? "comments" : "posts";
		const records = await pb.collection(collection).getList(1, 1000, {
			filter,
			expand: groupBy,
		});

		const stats: Stats = records.items.reduce(
			(acc: Stats, item: RecordItem) => {
				const key =
					groupBy === "user"
						? item.expand?.user?.username || "anonymous"
						: (item as Record<string, string>)[groupBy];
				acc[key] = (acc[key] || 0) + 1;
				return acc;
			},
			{},
		);

		return NextResponse.json({
			timeRange,
			metric,
			groupBy,
			stats,
		});
	} catch (error) {
		if (error instanceof ClientResponseError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		return NextResponse.json(
			{ error: "Failed to generate stats" },
			{ status: 500 },
		);
	}
}
