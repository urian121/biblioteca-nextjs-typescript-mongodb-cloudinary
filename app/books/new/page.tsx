import { createBook as createBookService } from "@/services/books";
import { listEditorials } from "@/services/editorials";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { Buffer } from "node:buffer";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import "server-only"; // Esto evita que el cliente acceda a la función createBook
import { ArrowLeft } from "lucide-react";

export const createBook = async (formData: FormData) => {
  "use server";
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const description = (formData.get("description") as string) || "";
  const genre = formData.get("genre") as string;
  const year = Number(formData.get("year") as string || 0);
  const editorialId = (formData.get("editorialId") as string) || "";
  let coverUrl: string | undefined;
  let coverPublicId: string | undefined;

  const coverFile = formData.get("cover") as File | null;
  if (coverFile && coverFile.size > 0) {
    const arrayBuffer = await coverFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await uploadBufferToCloudinary(buffer, "books");
    coverUrl = uploaded.url;
    coverPublicId = uploaded.public_id;
  }

  await createBookService({
    title,
    author,
    description: description.trim(),
    genre,
    year: year || undefined,
    coverUrl,
    coverPublicId,
    editorialId: editorialId || undefined,
  });
  revalidatePath("/");
  // Redirige con un flag para mostrar toast en cliente
  redirect("/?created=1");
};

export default async function NewPage() {
  const editorials = await listEditorials();
  return (
    <div>
      <div className="mb-2">
        <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 border rounded text-udemy-purple-purple hover:bg-slate-50 hover:cursor-pointer">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Volver
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-udemy-purple-purple">Nuevo libro</h1>
      <form action={createBook} className="space-y-2">
        <input name="title" placeholder="Título" required className="w-full border p-2 rounded" />
        <input name="author" placeholder="Autor" required className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Descripción" required className="w-full border p-2 rounded" rows={4} />
        <input name="genre" placeholder="Género" className="w-full border p-2 rounded" />
        <input name="year" type="number" placeholder="Año" className="w-32 border p-2 rounded" />
        <div className="space-y-1">
          <label htmlFor="editorialId" className="block text-sm text-slate-600">Editorial</label>
          <select id="editorialId" name="editorialId" required className="w-full border p-2 rounded bg-white" defaultValue="">
            <option value="" disabled>Selecciona una editorial</option>
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
          <button className="bg-udemy-purple-purple text-white px-4 py-2 rounded hover:cursor-pointer">Guardar</button>
          <Link href="/" className="px-4 py-2 border rounded text-udemy-purple-purple hover:bg-slate-50 hover:cursor-pointer">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
