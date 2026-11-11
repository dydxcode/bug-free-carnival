import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFoundPage() {
  notFound();
  return null;
}
