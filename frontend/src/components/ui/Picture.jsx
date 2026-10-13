// Serves AVIF when a sibling .avif exists for a local .webp, otherwise the URL as-is.
export default function Picture({ src, alt = '', className = '', imgClassName = '', sizes, priority = false, ...rest }) {
  const local = typeof src === 'string' && src.startsWith('/images/') && src.endsWith('.webp');
  const img = (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={imgClassName}
      {...rest}
    />
  );
  if (!local) return <span className={className}>{img}</span>;
  return (
    <picture className={className}>
      <source srcSet={src.replace(/\.webp$/, '.avif')} type="image/avif" />
      <source srcSet={src} type="image/webp" />
      {img}
    </picture>
  );
}
