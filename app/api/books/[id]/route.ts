import { NextResponse, NextRequest } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/services/books";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const book = await getBookById(p.id);
  return NextResponse.json(book);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const body = await req.json();
  const book = await updateBook(p.id, body);
  return NextResponse.json(book);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  await deleteBook(p.id);
  return NextResponse.json({ ok: true });
}
