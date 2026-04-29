'use client';

import { useEffect } from 'react';

export default function BrandDynamicHead({ brandInfo }) {
  useEffect(() => {
    if (!brandInfo) return;

    const targetTitle = brandInfo.seo?.title || brandInfo.name || "Zee Fit";
    document.title = targetTitle;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.textContent !== targetTitle) {
          document.title = targetTitle;
        }
      });
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, { subtree: true, characterData: true, childList: true });
    }

    const faviconUrl = brandInfo.branding?.favicon;
    if (faviconUrl) {
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach(icon => icon.remove());

      const newIcon = document.createElement('link');
      newIcon.rel = 'icon';
      newIcon.href = faviconUrl;
      document.head.appendChild(newIcon);
    }

    return () => observer.disconnect();
  }, [brandInfo]);

  return null;
}