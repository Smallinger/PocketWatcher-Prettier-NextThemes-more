import { NextRequest, NextResponse } from "next/server";
import pb from "@/lib/pocketbase";
import { ClientResponseError } from "pocketbase";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const comments = await pb.collection("comments").getList(1, 50, {
			filter: `post = "${params.id}"`,
			expand: "user,replies,replies.user",
			sort: "created",
		});

		return NextResponse.json(comments);
	} catch (error) {
		if (error instanceof ClientResponseError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		return NextResponse.json(
			{ error: "Failed to fetch comments" },
			{ status: 500 },
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const body = await request.json();
		const comment = await pb.collection("comments").create({
			...body,
			post: params.id,
		});

		return NextResponse.json(comment, { status: 201 });
	} catch (error) {
		if (error instanceof ClientResponseError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		return NextResponse.json(
			{ error: "Failed to create comment" },
			{ status: 500 },
		);
	}
}
