'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useReveal(threshold = 0.1) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset all .reveal elements on the new page so they animate in fresh.
    // Elements that were already visible on the previous page are now gone from
    // the DOM, so we only see the new page's elements here.
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.remove('visible');
    });

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname, threshold]);
}
