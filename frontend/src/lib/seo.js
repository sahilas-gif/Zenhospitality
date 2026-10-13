import { useEffect } from 'react';

const SITE = 'Zen World Hospitality';

export function useSeo(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} | Hotels, Tours, Corporate Travel and Transport, Mumbai`;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://zenhospitality.in${window.location.pathname}`;
  }, [title, description]);
}
