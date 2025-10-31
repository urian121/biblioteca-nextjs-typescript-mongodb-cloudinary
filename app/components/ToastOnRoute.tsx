"use client";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { showToast } from "nextjs-toast-notify";

// Observa parámetros de la URL y muestra toasts en cliente sin convertir la Page en cliente
export default function ToastOnRoute(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const created = searchParams.get("created");
    if (created === "1") {
      // Evita dobles ejecuciones en modo Strict (desarrollo) usando una marca en sessionStorage
      const guardKey = `__toast__${pathname}__created`;
      if (typeof window !== "undefined" && sessionStorage.getItem(guardKey)) return;
      if (typeof window !== "undefined") sessionStorage.setItem(guardKey, "1");
      // Éxito al crear libro
      showToast.success("¡La operación se realizó con éxito!", {
        duration: 10000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: "",
        sound: true,
      });
      // Limpia el parámetro para no repetir el toast en navegaciones
      const params = new URLSearchParams(searchParams.toString());
      params.delete("created");
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
      // Permite futuros toasts (otra creación) eliminado la marca poco después
      setTimeout(() => {
        if (typeof window !== "undefined") sessionStorage.removeItem(guardKey);
      }, 1500);
    }
  }, [pathname, searchParams, router]);

  return null;
}