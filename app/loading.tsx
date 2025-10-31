import LoadingOverlay from "./components/LoadingOverlay";

export default function Loading() {
  return <LoadingOverlay message="Cargando…" allowInteraction={false} />;
}