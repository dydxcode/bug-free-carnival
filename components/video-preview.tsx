import type { VideoEmbed } from '@/lib/data';

export function VideoPreview({ video }: { video: VideoEmbed }) {
  const safeDomains = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com', 'player.vimeo.com'];
  const url = new URL(video.embedUrl);
  const allowed = safeDomains.includes(url.hostname);

  if (!allowed) {
    return <div className="card-surface p-4 text-muted">Preview embed is unavailable due to provider restrictions.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-panel">
      <div className="aspect-video w-full">
        <iframe
          src={video.embedUrl}
          title={video.provider}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
