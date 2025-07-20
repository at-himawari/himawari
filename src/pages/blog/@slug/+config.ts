import type { Config } from 'vike/types';

export default {
    title: (pageContext) => pageContext?.data?.title, // pageContextから動的にtitleを設定
    description: (pageContext) => pageContext?.data?.description || "", // pageContextから動的にdescriptionを設定
} satisfies Config;
