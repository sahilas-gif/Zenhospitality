import { useEffect, useState } from 'react';
import api from '../lib/api';

export function useHotels(params = {}) {
  const key = JSON.stringify(params);
  const [state, setState] = useState({ items: [], cities: [], loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get('/hotels', { params: JSON.parse(key) })
      .then(({ data }) => alive && setState({ items: data.items, cities: data.cities, loading: false, error: null }))
      .catch(() => alive && setState({ items: [], cities: [], loading: false, error: 'Hotels could not be loaded right now.' }));
    return () => {
      alive = false;
    };
  }, [key]);

  return state;
}

export function useHotel(slug) {
  const [state, setState] = useState({ hotel: null, loading: true, notFound: false, error: null });

  useEffect(() => {
    let alive = true;
    setState({ hotel: null, loading: true, notFound: false, error: null });
    api
      .get(`/hotels/${encodeURIComponent(slug)}`)
      .then(({ data }) => alive && setState({ hotel: data, loading: false, notFound: false, error: null }))
      .catch((err) =>
        alive &&
        setState({
          hotel: null,
          loading: false,
          notFound: err.response?.status === 404,
          error: err.response?.status === 404 ? null : 'This hotel could not be loaded right now.',
        }),
      );
    return () => {
      alive = false;
    };
  }, [slug]);

  return state;
}
