import { connect } from "@/lib/mongoose";
import { deleteCloudinaryByPublicId } from "@/lib/cloudinary";
import { BookModel } from "@/models/Book";
import { BookViewModel } from "@/models/BookView";
import { BookLikeModel } from "@/models/BookLike";
import type { BookFilter, BookItem, BookUpdate } from "@/types/book";

// Tipo mínimo del documento lean que usamos para mapear a BookItem (evita any)
type LeanBookDoc = {
  _id: unknown;
  title: string;
  author: string;
  year?: unknown;
  genre?: string;
  description?: string;
  coverUrl?: string;
  editorial?: { _id?: unknown; name?: string } | null;
};

// Convierte un documento lean de Mongo en un BookItem tipado
function toBookItem(d: LeanBookDoc): BookItem {
  return {
    id: String(d._id),
    title: d.title,
    author: d.author,
    year: typeof d.year === "number" ? d.year : undefined,
    genre: d.genre,
    description: d.description,
    coverUrl: d.coverUrl,
    editorialId: d.editorial?._id ? String(d.editorial._id) : undefined,
    editorialName: d.editorial?.name ?? undefined,
  };
}

// Lista libros con filtro de búsqueda (título/autor)
export async function listBooks(filter: BookFilter): Promise<BookItem[]> {
  await connect();
  const docs = (await BookModel.find(filter).sort({ title: 1 }).populate("editorial", "name").lean()) as LeanBookDoc[];
  return docs.map(toBookItem);
}

// Obtiene un libro por id
export async function getBookById(id: string): Promise<BookItem | null> {
  await connect();
  const doc = (await BookModel.findById(id).populate("editorial", "name").lean()) as LeanBookDoc | null;
  return doc ? toBookItem(doc) : null;
}

// Crea un libro con validación básica
export async function createBook(data: {
  title: string;
  author: string;
  description: string;
  genre?: string;
  year?: number;
  coverUrl?: string;
  coverPublicId?: string;
  editorialId?: string;
}): Promise<BookItem> {
  await connect();
  const book = await BookModel.create({
    title: data.title.trim(),
    author: data.author.trim(),
    description: data.description.trim(),
    genre: data.genre?.trim(),
    year: data.year,
    coverUrl: data.coverUrl,
    coverPublicId: data.coverPublicId,
    editorial: data.editorialId,
  });
  return toBookItem(book as unknown as LeanBookDoc);
}

// Actualiza un libro por id (solo campos permitidos)
export async function updateBook(id: string, data: BookUpdate): Promise<BookItem | null> {
  await connect();
  const { editorialId, ...fields } = data;
  const book = (await BookModel.findByIdAndUpdate(
    id,
    { ...fields, ...(editorialId ? { editorial: editorialId } : {}) },
    { new: true }
  ).populate("editorial", "name").lean()) as LeanBookDoc | null;
  return book ? toBookItem(book) : null;
}

// Elimina un libro por id
export async function deleteBook(id: string): Promise<void> {
  await connect();
  // Recupera primero el documento para obtener el public_id de la portada
  const doc = await BookModel.findById(id).lean();
  await BookModel.findByIdAndDelete(id);
  // Limpieza relacionada
  await Promise.all([
    BookViewModel.deleteOne({ book: id }),
    BookLikeModel.deleteOne({ book: id }),
  ]);
  // Elimina imagen en Cloudinary si existe
  if (doc?.coverPublicId) {
    try {
      await deleteCloudinaryByPublicId(String(doc.coverPublicId));
    } catch (err) {
      console.error("Error eliminando imagen en Cloudinary:", err);
    }
  }
}

// Estadísticas: vistas y likes
export async function incrementBookView(bookId: string): Promise<number> {
  await connect();
  const res = await BookViewModel.findOneAndUpdate(
    { book: bookId },
    { $inc: { views: 1 }, $set: { updatedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
  return res?.views ?? 0;
}

export async function incrementBookLike(bookId: string): Promise<number> {
  await connect();
  const res = await BookLikeModel.findOneAndUpdate(
    { book: bookId },
    { $inc: { likes: 1 }, $set: { updatedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
  return res?.likes ?? 0;
}

export async function getBookStats(bookId: string): Promise<{ views: number; likes: number }> {
  await connect();
  const [v, l] = await Promise.all([
    BookViewModel.findOne({ book: bookId }).lean(),
    BookLikeModel.findOne({ book: bookId }).lean(),
  ]);
  return { views: v?.views ?? 0, likes: l?.likes ?? 0 };
}