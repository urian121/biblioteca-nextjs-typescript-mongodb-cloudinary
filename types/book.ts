// Tipos compartidos para libros
export type SearchParams = { q?: string; created?: string };

export type BookFilter = {
  $or?: Array<
    | { title: { $regex: string; $options?: string } }
    | { author: { $regex: string; $options?: string } }
  >;
};

export type BookItem = {
  id: string;
  title: string;
  author: string;
  year?: number;
  genre?: string;
  description?: string;
  coverUrl?: string;
  editorialId?: string;
  editorialName?: string;
};

export type BookUpdate = {
  title?: string;
  author?: string;
  description?: string;
  genre?: string;
  year?: number;
  coverUrl?: string;
  coverPublicId?: string;
  editorialId?: string;
};