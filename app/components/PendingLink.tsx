"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  overlayMessage?: string;
};

export default function PendingLink({ href, children, className = "", overlayMessage = "Cargando…" }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    router.prefetch?.(href);
  }, [href, router]);

  const onClick = () => {
    setPending(true);
    router.push(href);
  };

  return (
    <>
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
      {pending && <LoadingOverlay message={overlayMessage} allowInteraction={false} />}
    </>
  );
}