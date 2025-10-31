import { NextResponse } from "next/server";
import { listEditorials } from "@/services/editorials";

export async function GET() {
  const items = await listEditorials();
  return NextResponse.json(items);
}