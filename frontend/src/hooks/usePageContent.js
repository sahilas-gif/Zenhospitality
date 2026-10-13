import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function usePageContent(slug) {
  const [content, setContent] = useState({});

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/pages/${slug}`)
      .then((res) => {
        if (!cancelled && res.data?.content) setContent(res.data.content);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return content;
}
