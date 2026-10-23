/** CMSへの接続を開発時とビルド時に限定する。 */
export async function fetchCms(url: string): Promise<Response> {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    throw new Error("CMS access is only allowed during the production build.");
  }

  return fetch(url, { cache: "force-cache" });
}
