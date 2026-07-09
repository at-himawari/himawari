import { NextResponse } from "next/server";
import { getPosts } from "../../../utils/getPosts";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts({ throwOnError: true });
  return NextResponse.json(posts);
}
