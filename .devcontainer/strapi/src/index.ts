const PUBLIC_FIND_ACTIONS = [
  "api::article.article.find",
  "api::article.article.findOne",
  "api::news-item.news-item.find",
  "api::news-item.news-item.findOne",
  "api::video-item.video-item.find",
  "api::video-item.video-item.findOne",
  "api::fixed-page.fixed-page.find",
  "api::fixed-page.fixed-page.findOne",
];

async function enablePublicReadPermissions(strapi) {
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  if (!publicRole) {
    strapi.log.warn("Public role was not found; public read permissions were not seeded.");
    return;
  }

  await Promise.all(
    PUBLIC_FIND_ACTIONS.map(async (action) => {
      const existingPermission = await strapi
        .query("plugin::users-permissions.permission")
        .findOne({
          where: {
            action,
            role: publicRole.id,
          },
        });

      if (existingPermission) {
        if (!existingPermission.enabled) {
          await strapi.query("plugin::users-permissions.permission").update({
            where: { id: existingPermission.id },
            data: { enabled: true },
          });
        }
        return;
      }

      await strapi.query("plugin::users-permissions.permission").create({
        data: {
          action,
          role: publicRole.id,
          enabled: true,
        },
      });
    }),
  );
}

async function seedCollection(strapi, uid, entries) {
  const count = await strapi.db.query(uid).count();

  if (count > 0) {
    return;
  }

  await Promise.all(
    entries.map((entry) =>
      strapi.entityService.create(uid, {
        data: {
          ...entry,
          publishedAt: new Date(),
        },
      }),
    ),
  );
}

async function seedContent(strapi) {
  await seedCollection(strapi, "api::article.article", [
    {
      title: "AWS 入門講座 7",
      slug: "aws-nyuumon-kouza-7",
      date: "2026-06-01",
      content:
        "# AWS 入門講座 7\n\nDev Container から Strapi の記事詳細表示を検証するためのサンプル記事です。\n\n- App Router の動的ルート\n- Strapi API の slug 解決\n- Markdown 表示",
      coverImage: "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/himawari.png",
      categories: ["Cloud"],
      tags: ["AWS", "Strapi", "Next.js"],
    },
    {
      title: "Next.js と Strapi のローカル検証",
      slug: "nextjs-strapi-local-dev",
      date: "2026-06-02",
      content:
        "# Next.js と Strapi のローカル検証\n\n`NEXT_PUBLIC_STRAPI_URL=http://strapi:1337` でコンテナ間通信を確認するための記事です。",
      coverImage: "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg",
      categories: ["Development"],
      tags: ["Dev Container", "Docker"],
    },
  ]);

  await seedCollection(strapi, "api::news-item.news-item", [
    {
      title: "Dev Container 用 Strapi を追加しました",
      date: "2026-06-27",
      content: "ローカル検証用の Strapi API から配信されるニュースです。",
      link: "/blog/aws-nyuumon-kouza-7",
    },
  ]);

  await seedCollection(strapi, "api::video-item.video-item", [
    {
      title: "Himawari Project サンプル動画",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/himawari.png",
      description: "動画ページの Strapi 接続確認用データです。",
      date: "2026-06-27",
    },
  ]);

  await seedCollection(strapi, "api::fixed-page.fixed-page", [
    {
      slug: "project",
      content: "# Project\n\nDev Container 用 Strapi から配信されるプロジェクトページです。",
    },
    {
      slug: "commercial",
      content: "# Commercial\n\nDev Container 用 Strapi から配信される制作実績ページです。",
    },
    {
      slug: "software",
      content: "# Software\n\nDev Container 用 Strapi から配信されるソフトウェアページです。",
    },
    {
      slug: "license",
      content: "# License\n\nDev Container 用 Strapi から配信されるライセンスページです。",
    },
    {
      slug: "privacy",
      content: "# Privacy\n\nDev Container 用 Strapi から配信されるプライバシーポリシーです。",
    },
  ]);
}

export default {
  async bootstrap({ strapi }) {
    await enablePublicReadPermissions(strapi);
    await seedContent(strapi);
  },
};
