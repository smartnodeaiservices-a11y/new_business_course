type VideoEmbedProps = {
  fileId: string;
  title?: string;
  className?: string;
};

export function VideoEmbed({ fileId, title = "Video", className = "" }: VideoEmbedProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <iframe
        src={`https://drive.google.com/file/d/${fileId}/preview`}
        title={title}
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        loading="lazy"
      />
    </div>
  );
}
