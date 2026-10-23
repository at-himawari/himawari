import { NextResponse } from "next/server";
import { getPosts } from "../../../utils/getPosts";

// 検索用の全文データもビルド成果物として配信する。
export const dynamic = "force-static";
export const revalidate = false;

/** ビルド時点の記事一覧を検索用JSONとして返す。 */
export async function GET() {
  const posts = await getPosts({ throwOnError: true });
  return NextResponse.json(posts);
}
