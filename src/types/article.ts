export interface Article {
  id: number;
  title: string | null;
  image: string | null;
  description: string | null;
  content: string | null;
  slug: string | null;
  owner: string | null;
  type: string | null;
  created_at?: string;
}
