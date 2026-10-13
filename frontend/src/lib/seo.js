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
    const path = window.location.pathname;
    if (canonical) canonical.href = `https://zenhospitality.in${path}`;
    const setMeta = (selector, attr, name, content) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    if (description) {
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
    setMeta('meta[property="og:title"]', 'property', 'og:title', document.title);
    setMeta('meta[property="og:url"]', 'property', 'og:url', `https://zenhospitality.in${path}`);
  }, [title, description]);
}
