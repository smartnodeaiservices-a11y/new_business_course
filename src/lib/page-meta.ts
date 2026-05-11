import { useEffect } from "react";

type Meta = {
  title?: string;
  description?: string;
};

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageMeta({ title, description }: Meta) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta("description", description);
  }, [title, description]);
}
