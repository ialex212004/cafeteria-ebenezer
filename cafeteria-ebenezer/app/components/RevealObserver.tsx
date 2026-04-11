'use client';

import { useReveal } from '@/hooks/useReveal';

export default function RevealObserver() {
  useReveal(0.1);
  return null;
}
