export interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  publishedDate: string;
  views?: number;
  likes?: number;
  comments?: number;
  status: 'Published' | 'Draft';
}

export type SortField = 'views' | 'likes' | 'comments' | 'publishedDate';
export type SortOrder = 'asc' | 'desc';