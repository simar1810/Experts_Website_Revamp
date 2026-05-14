"use client";

import { useCallback, useEffect, useState } from "react";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/partnerProductsApi";

/**
 * Partner product image: plain img so presigned S3 URLs are not proxied through
 * `/_next/image` (those requests often return 400 for long signed URLs). Falls back
 * to the placeholder if the URL fails to load.
 */
export default function ProductDetailImage({
  src,
  alt,
  className = "absolute inset-0 h-full w-full object-cover",
  loading = "eager",
  fetchPriority,
}) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  const onError = useCallback(() => {
    setCurrent((prev) =>
      prev === PRODUCT_PLACEHOLDER_IMAGE ? prev : PRODUCT_PLACEHOLDER_IMAGE,
    );
  }, []);

  return (
    <img
      src={current}
      alt={alt}
      onError={onError}
      className={className}
      loading={loading}
      decoding="async"
      {...(fetchPriority ? { fetchPriority } : {})}
    />
  );
}
