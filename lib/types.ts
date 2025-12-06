export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  slugRaw?: string | null;
  slugFallback: string;
  summary?: string;
  publishedAt: string;
  tags: string[];
  readingTime?: string;
  coverUrl?: string;
}
