export type Post = {
    slug: string;
    content?: string;
    title: string;
    date: string;
    categories?: string[];
    tags?: string[];
    coverImage?: string;
  }