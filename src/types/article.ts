export interface Article {
  id: number;
  title: string | null;
  image: string | null;
  description: string | null;
  owner: string | null;
  type: string | null;
  created_at?: string; // Optional if you have it in your db
}
