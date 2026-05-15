import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { videoSrc } from "@/lib/curriculum";

type VideoEmbedProps = {
  /** Google Drive file ID, full Drive/YouTube/Vimeo URL, or any iframe URL. */
  fileId?: string;
  video?: string;
  /** Direct local/remote video file URL (mp4/webm). Takes precedence over
   *  fileId/video when set — gives us a real <video> element so autoplay,
   *  poster, and "controls off" actually work. */
  src?: string;
  /** Optional poster image shown until first frame paints. */
  poster?: string;
  title?: string;
  className?: string;
  /** VSL mode: autoplays muted on mount, strips controls/UI. Mimics
   *  atomicfunnels.com hero VSL. */
  vsl?: boolean;
};

function withVslParams(src: string): string {
  // YouTube — supports controls=0, autoplay, mute, modestbranding.
  if (src.includes("youtube.com/embed")) {
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3`;
  }
  // Vimeo — supports autoplay, muted, controls=0.
  if (src.includes("player.vimeo.com/video")) {
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}autoplay=1&muted=1&controls=0&playsinline=1`;
  }
  // Google Drive preview ignores most params and always shows its own toolbar.
  // Best-effort: leave as-is; consumer should host VSLs on YouTube/Vimeo.
  return src;
}

function LocalVideo({
  src,
  poster,
  vsl,
  title,
  className,
}: {
  src: string;
  poster?: string;
  vsl: boolean;
  title: string;
  className: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Start muted in VSL mode (browser autoplay policy) — surface a tap-to-
  // unmute and fullscreen control overlay since we hide the native bar.
  const [muted, setMuted] = useState(vsl);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // iOS Safari occasionally drops the autoplay attribute when navigating
  // between routes — force-play once on mount to be safe. The play() promise
  // can reject if the tab isn't visible; swallow that.
  useEffect(() => {
    if (!vsl || !videoRef.current) return;
    const v = videoRef.current;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [vsl]);

  // Track fullscreen changes (incl. user pressing Esc).
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleMuted = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    // If user wants sound, also nudge play() in case the autoplay-muted
    // browser policy paused the audible track.
    if (!v.muted) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`group relative w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        title={title}
        autoPlay={vsl}
        muted={vsl}
        loop={vsl}
        playsInline
        preload={vsl ? "auto" : "metadata"}
        controls={!vsl}
        controlsList={vsl ? "nodownload noplaybackrate" : undefined}
        disablePictureInPicture={vsl}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {vsl && (
        <>
          {/* Bottom gradient so the icons stay legible over any frame. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-linear-to-t from-black/55 to-transparent"
          />

          {/* Custom controls — only mute + fullscreen, no scrubber. */}
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="h-10 w-10 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-sm text-white flex items-center justify-center transition-colors ring-1 ring-white/15"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="h-10 w-10 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-sm text-white flex items-center justify-center transition-colors ring-1 ring-white/15"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>

          {/* First-paint "Tap for sound" pill — fades away once the user
              has interacted (muted state changes from initial true). */}
          {muted && (
            <button
              type="button"
              onClick={toggleMuted}
              aria-label="Tap for sound"
              className="absolute left-3 bottom-3 inline-flex items-center gap-2 px-3.5 h-10 rounded-full bg-white/95 hover:bg-white text-navy text-[12.5px] font-semibold shadow-md transition-all"
            >
              <VolumeX size={15} />
              Tap for sound
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function VideoEmbed({
  fileId,
  video,
  src,
  poster,
  title = "Video",
  className = "",
  vsl = false,
}: VideoEmbedProps) {
  // Prefer a direct file URL when provided — gives us a true <video> element.
  if (src) {
    return <LocalVideo src={src} poster={poster} vsl={vsl} title={title} className={className} />;
  }

  const baseSrc = videoSrc(video ?? fileId ?? "");
  const iframeSrc = vsl && baseSrc ? withVslParams(baseSrc) : baseSrc;

  if (!iframeSrc) {
    return null;
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <iframe
        src={iframeSrc}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        loading={vsl ? "eager" : "lazy"}
      />
      {vsl && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-12 pointer-events-none bg-linear-to-t from-black/40 to-transparent"
        />
      )}
    </div>
  );
}
