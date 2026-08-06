type Props = {
  /**
   * Unique per rendered instance. The gradient lives in this SVG's own
   * <defs>, so two marks on the same page (the desktop rail and the mobile
   * bar are both in the DOM, just hidden at different breakpoints) would
   * otherwise ship duplicate element ids.
   */
  id: string;
  className?: string;
  /** Heavier strokes for small renders — hairlines that read as precise at 96px turn to grey mush at 24px. */
  strokeWidth?: number;
  /**
   * Optical sizing, not a style knob. "full" is the artwork as drawn. Below
   * roughly 48px the six-yard boxes and penalty arcs stop resolving and just
   * clog the penalty areas into a smudge, so "compact" drops them and keeps
   * the four shapes that still read: ring, seam, centre circle, penalty box.
   */
  detail?: "full" | "compact";
  /** The mark is decorative wherever a visible "PitchStudy" wordmark sits next to it; pass a label when it stands alone. */
  title?: string;
};

/**
 * The PitchStudy mark: a pitch seen from above, clipped into a circle and
 * split down the halfway line. Drawn rather than embedded so it stays sharp
 * at every size and carries its gradient in code.
 *
 * Everything inside the ring is clipped to it, which is what gives the
 * penalty areas their cut-off corners — the circle doubles as the goal line,
 * exactly as it does in the source artwork.
 */
export function PitchStudyMark({ id, className, strokeWidth = 2.2, detail = "full", title }: Props) {
  const gradientId = `${id}-gradient`;
  const clipId = `${id}-clip`;
  const full = detail === "full";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1435f2" />
          <stop offset="52%" stopColor="#1b74ff" />
          <stop offset="100%" stopColor="#35cdff" />
        </linearGradient>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="43" />
        </clipPath>
      </defs>

      <g
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        {/* The ring, broken at top and bottom so the halfway line reads as a
            seam splitting the whole mark in two rather than just another line
            laid over a closed circle. */}
        <path d="M48.8 6.02A44 44 0 0 0 48.8 93.98" />
        <path d="M51.2 6.02A44 44 0 0 1 51.2 93.98" />
        <path d="M50 6V94" />
        <circle cx="50" cy="50" r="13.2" />

        <g clipPath={`url(#${clipId})`}>
          {/* Left half */}
          <path d="M9.2 32.4H24.5V67.6H9.2Z" />
          {full && <path d="M9.2 41.9H16.2V58.1H9.2Z" />}
          {full && <path d="M24.5 41.75A9.7 9.7 0 0 1 24.5 58.25" />}

          {/* Right half */}
          <path d="M90.8 32.4H75.5V67.6H90.8Z" />
          {full && <path d="M90.8 41.9H83.8V58.1H90.8Z" />}
          {full && <path d="M75.5 41.75A9.7 9.7 0 0 0 75.5 58.25" />}
        </g>
      </g>

      {full && (
        <g fill={`url(#${gradientId})`}>
          <circle cx="19.4" cy="50" r="1.5" />
          <circle cx="80.6" cy="50" r="1.5" />
        </g>
      )}
    </svg>
  );
}
