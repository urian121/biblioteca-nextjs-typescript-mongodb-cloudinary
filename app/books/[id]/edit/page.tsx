import { connect } from "@/lib/mongoose";
import { getBookById, updateBook as updateBookService } from "@/services/books";
import { listEditorials } from "@/services/editorials";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import "server-only";
import Link from "next/link";
import type { BookUpdate } from "@/types/book";
import { ArrowLeft, Save } from "lucide-react";

// Server Action: actualiza campos del libro y revalida la lista
export const updateBook = async (formData: FormData) => {
  "use server";
  await connect();
  const id = String(formData.get("id"));
  const data: BookUpdate = {
    title: (formData.get("title") as string) || undefined,
    author: (formData.get("author") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    genre: (formData.get("genre") as string) || undefined,
    year: formData.get("year") ? Number(formData.get("year") as string) : undefined,
    editorialId: (formData.get("editorialId") as string) || undefined,
  };

  const coverFile = formData.get("cover") as File | null;
  if (coverFile && coverFile.size > 0) {
    const arrayBuffer = await coverFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await uploadBufferToCloudinary(buffer, "books");
    data.coverUrl = uploaded.url;
    data.coverPublicId = uploaded.public_id;
  }
  await updateBookService(id, data);
  revalidatePath("/");
  redirect("/");
};

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  await connect();
  const p = await params;
  const book = await getBookById(p.id);
  if (!book) return <div>No encontrado</div>;
  const b = book;
  const editorials = await listEditorials();

  return (
    <>
      <div className="mb-2">
        <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 border rounded text-udemy-purple-purple hover:bg-slate-50 hover:cursor-pointer">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Volver
        </Link>
      </div>
      <form action={updateBook} className="space-y-2">
        <input type="hidden" name="id" value={String(b.id)} />
        <input name="title" defaultValue={b.title} className="w-full border p-2 rounded" />
        <input name="author" defaultValue={b.author} className="w-full border p-2 rounded" />
        <textarea name="description" defaultValue={b.description || ""} required className="w-full border p-2 rounded" rows={4} />
        <input name="genre" defaultValue={b.genre} className="w-full border p-2 rounded" />
        <input name="year" defaultValue={b.year} type="number" className="w-32 border p-2 rounded" />
        <div className="space-y-1">
          <label htmlFor="editorialId" className="block text-sm text-slate-600">Editorial</label>
          <select id="editorialId" name="editorialId" className="w-full border p-2 rounded bg-white" defaultValue={b.editorialId ?? ""}>
            <option value="">Sin editorial</option>
            {editorials.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="cover" className="block text-sm text-slate-600">Portada (imagen)</label>
          <input id="cover" name="cover" type="file" accept="image/*" className="w-full border p-2 rounded" />
        </div>
        <div className="flex gap-2">
          <button className="bg-udemy-purple-purple text-white px-4 py-2 rounded inline-flex items-center gap-2 hover:cursor-pointer">
            <Save size={16} strokeWidth={2} aria-hidden="true" />
            Guardar
          </button>
        </div>
      </form>
    </>
  );
}
