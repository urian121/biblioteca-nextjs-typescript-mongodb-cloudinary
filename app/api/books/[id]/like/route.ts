import { NextResponse } from "next/server";
import { incrementBookLike, getBookStats } from "@/services/books";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await incrementBookLike(id);
  const stats = await getBookStats(id);
  return NextResponse.json({ likes: stats.likes });
}