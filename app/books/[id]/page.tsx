import { connect } from "@/lib/mongoose";
import { getBookById, deleteBook as deleteBookService, getBookStats, incrementBookView } from "@/services/books";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import "server-only";
import { ArrowLeft, Pencil, Trash, Image as ImageIcon, Eye } from "lucide-react";
import LikeButton from "../../components/LikeButton";

// Server Action: elimina un libro por id y revalida la lista
export const deleteBook = async (formData: FormData) => {
  "use server";
  const id = String(formData.get("id"));
  await deleteBookService(id);
  revalidatePath("/");
  redirect("/");
};

// El like se maneja en cliente vía /api/books/[id]/like para evitar refrescar y no sumar vistas de nuevo.

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connect();
  const p = await params;
  const book = await getBookById(p.id);
  if (!book) return <div className="p-4">No encontrado</div>;
  await incrementBookView(book.id);
  const stats = await getBookStats(book.id);

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 border rounded text-udemy-purple-purple hover:bg-slate-50 hover:cursor-pointer">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Volver
        </Link>
        <div className="flex items-center gap-2">
          <LikeButton bookId={String(book.id)} initialLikes={stats.likes} />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-slate-200 text-slate-600 bg-white cursor-default"
            aria-label="Vistas"
            aria-disabled="true"
          >
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
            <span className="text-sm">{stats.views}</span>
          </button>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="h-40 w-40 rounded overflow-hidden bg-white shrink-0 flex items-center justify-center">
          {book.coverUrl ? (
            <Image src={book.coverUrl} alt={`Portada: ${book.title}`} width={160} height={160} className="h-full w-full object-contain" />
          ) : (
            <ImageIcon size={64} strokeWidth={2} className="text-slate-400" aria-hidden="true" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-slate-600">{book.author} • {book.year ?? "s/f"}</p>
          {book.editorialName && <p className="text-slate-700">Editorial: {book.editorialName}</p>}
          {book.genre && <p className="text-slate-700">Género: {book.genre}</p>}
          {book.description && (
            <div className="mt-2">
              <h2 className="font-semibold">Descripción</h2>
              <p className="text-slate-700 whitespace-pre-line">{book.description}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        <Link href={`/books/${book.id}/edit`} className="bg-udemy-purple-purple text-white px-4 py-2 rounded inline-flex items-center gap-2 hover:cursor-pointer">
          <Pencil size={16} strokeWidth={2} aria-hidden="true" />
          Editar
        </Link>
        <form action={deleteBook}>
          <input type="hidden" name="id" value={String(book.id)} />
          <button className="px-4 py-2 border rounded text-red-600 hover:bg-red-50 hover:cursor-pointer inline-flex items-center gap-2">
            <Trash size={16} strokeWidth={2} aria-hidden="true" />
            Eliminar
          </button>
        </form>
      </div>
    </div>
  );
}