import { useEffect } from "react";

const SITE_NAME = "Master Key Consulting";
const DEFAULT_IMAGE = "/opengraph.jpg";

function setMeta(selector: string, attr: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (selector.startsWith('meta[property')) {
      el.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] ?? "");
    } else {
      el.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] ?? "");
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, content);
}

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export function useSEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const origin = window.location.origin;
    const pageUrl = window.location.href;
    const absImage = image.startsWith("http") ? image : `${origin}${image}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : "index, follow");

    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", absImage);
    setMeta('meta[property="og:url"]', "content", pageUrl);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);

    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", absImage);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    return () => {
      document.title = `${SITE_NAME} | Professional Geophysical & Engineering Services`;
    };
  }, [title, description, image, type, noindex]);
}
