import { NextResponse } from "next/server";
import type { BookFilter } from "@/types/book";
import { listBooks, createBook } from "@/services/books";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const filter: BookFilter = {};

  if (q) filter.$or = [
    { title: { $regex: q, $options: "i" } },
    { author: { $regex: q, $options: "i" } }
  ];

  const books = await listBooks(filter);
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.title || !body?.author || !body?.description) {
    return NextResponse.json({ error: "title, author y description son requeridos" }, { status: 400 });
  }
  const created = await createBook({
    title: String(body.title),
    author: String(body.author),
    description: String(body.description),
    genre: body.genre ? String(body.genre) : undefined,
    year: body.year ? Number(body.year) : undefined,
    coverUrl: body.coverUrl ? String(body.coverUrl) : undefined,
    coverPublicId: body.coverPublicId ? String(body.coverPublicId) : undefined,
  });
  return NextResponse.json(created, { status: 201 });
}
