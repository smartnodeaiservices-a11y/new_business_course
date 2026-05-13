import { videoSrc } from "@/lib/curriculum";

type VideoEmbedProps = {
  /** Google Drive file ID, full Drive/YouTube/Vimeo URL, or any iframe URL. */
  fileId?: string;
  video?: string;
  title?: string;
  className?: string;
};

export function VideoEmbed({ fileId, video, title = "Video", className = "" }: VideoEmbedProps) {
  const src = videoSrc(video ?? fileId ?? "");

  if (!src) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-border bg-navy text-white/70 flex items-center justify-center text-[13px] px-6 text-center ${className}`}
        style={{ aspectRatio: "16 / 9" }}
      >
        Video coming soon — assets are uploaded annually.
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <iframe
        src={src}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        loading="lazy"
      />
    </div>
  );
}
