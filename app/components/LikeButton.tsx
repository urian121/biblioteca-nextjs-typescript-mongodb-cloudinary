"use client";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";

type Props = { bookId: string; initialLikes: number };

export default function LikeButton({ bookId, initialLikes }: Props) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/books/${bookId}/like`, { method: "POST" });
        if (!res.ok) throw new Error("Error al registrar like");
        const data = (await res.json()) as { likes: number };
        setLikes(data.likes);
      } catch {
        // fallback optimista ante error
        setLikes((v) => v + 1);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition active:scale-95 disabled:opacity-60"
      aria-label="Me gusta"
    >
      <Heart size={16} strokeWidth={2} aria-hidden="true" />
      <span className="text-sm" aria-live="polite">{likes}</span>
    </button>
  );
}