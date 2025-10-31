import Link from "next/link";
import Image from "next/image";
import type { SearchParams, BookFilter, BookItem } from "@/types/book";
import { listBooks } from "@/services/books";
import { Plus, Eye, Pencil, Image as ImageIcon } from "lucide-react";
import PendingLink from "./components/PendingLink";
import ToastOnRoute from "./components/ToastOnRoute";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = sp?.q ?? "";

  const filter: BookFilter = {};
  if (q) filter.$or = [{ title: { $regex: q, $options: "i" } }, { author: { $regex: q, $options: "i" } }];

  // Uso del servicio para listar con filtro (evita duplicación y mapea tipos)
  const books: BookItem[] = await listBooks(filter);

  return (
    <>
      <ToastOnRoute />
      <div className="flex justify-end items-center mb-4">
        <PendingLink href="/books/new" className="bg-udemy-yellow-yellow px-4 py-2 rounded inline-flex items-center gap-2 hover:cursor-pointer" overlayMessage="Cargando formulario…">
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Nuevo libro
        </PendingLink>
      </div>

      <ul className="space-y-2">
        {books.map((b) => (
          <li key={b.id} className="p-4 border border-slate-200 rounded flex justify-between items-center transition-shadow hover:shadow-md hover:border-slate-300 hover:bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded overflow-hidden bg-slate-100 shrink-0">
                {b.coverUrl ? (
                  <Image src={b.coverUrl} alt={`Portada: ${b.title}`} className="h-full w-full object-contain" width={80} height={80} />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-slate-400">
                    <ImageIcon size={80} strokeWidth={2} aria-hidden="true" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold">{b.title}</div>
                <div className="text-sm text-slate-600">{b.author} • {b.year}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/books/${b.id}`}
                className="text-sm px-3 py-1 border rounded inline-flex items-center gap-1 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--color-udemy-purple-purple) hover:cursor-pointer"
              >
                <Eye size={14} strokeWidth={2} aria-hidden="true" />
                Ver
              </Link>
              <Link
                href={`/books/${b.id}/edit`}
                className="text-sm px-3 py-1 rounded bg-udemy-purple-purple text-white inline-flex items-center gap-1 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-(--color-udemy-purple-purple) hover:cursor-pointer"
              >
                <Pencil size={14} strokeWidth={2} aria-hidden="true" />
                Editar
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
