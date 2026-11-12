import type { Metadata } from 'next';
import { UserLibraryPage } from '@/components/user-library';

export const metadata: Metadata = { title: 'Watchlist', description: 'Film dan series yang Anda simpan dan tonton kembali.' };
export default function WatchlistPage() { return <UserLibraryPage/>; }
