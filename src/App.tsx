import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { useRevealFallback } from "./lib/reveal";

export default function App() {
  // IntersectionObserver fallback for .reveal when the browser has no scroll-driven animations.
  useRevealFallback();
  const { pathname, hash } = useLocation();
  return (
    <>
      <Outlet />
      {!(pathname === "/" && hash) && <ScrollRestoration />}
    </>
  );
}
