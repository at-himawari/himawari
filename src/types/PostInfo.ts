export type PostInfo = {
  title: string;
  categories?: string[] | undefined;
  tags?: string[] | undefined;
  slug: string;
  date: string;
  coverImage?: string | undefined;
}