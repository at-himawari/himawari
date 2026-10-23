import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCms } from "../utils/fetchCms";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("CMSの接続タイミング", () => {
  it("本番配信時はネットワークへ接続しない", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "phase-production-server");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchCms("https://cms.example/api/articles")).rejects.toThrow("only allowed");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ビルド時はCMSを取得してキャッシュする", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    const response = new Response('{"data":[]}');
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchCms("https://cms.example/api/articles")).toBe(response);
    expect(fetchMock).toHaveBeenCalledWith("https://cms.example/api/articles", { cache: "force-cache" });
  });

  it("開発時はCMSを取得できる", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PHASE", "phase-development-server");
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"data":[]}'));
    vi.stubGlobal("fetch", fetchMock);
    await fetchCms("https://cms.example/api/articles");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
