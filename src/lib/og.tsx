import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { FormationPlayer } from "@/lib/formations";

/** Facebook, X, LinkedIn and iMessage all crop toward 1.91:1. 1200x630 is that ratio at the resolution every scraper accepts. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#eef4fa";
const MUTED = "#7f9db4";
const GROUND = "#0f1f2e";
const GROUND_DEEP = "#0a1622";
const CHALK_FAINT = "rgba(127, 157, 180, 0.32)";

/**
 * The mark, inlined as a data URI.
 *
 * Satori (which renders these cards) does not resolve network URLs or app
 * routes, so /icon.svg is unreachable from here. Reading the same file off
 * disk keeps one source of truth: edit the mark, and these cards follow.
 */
let markDataUri: string | undefined;
function getMark(): string {
  if (!markDataUri) {
    const svg = readFileSync(join(process.cwd(), "src/app/icon.svg"), "utf-8");
    markDataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
  return markDataUri;
}

/**
 * A pitch drawn from absolutely positioned divs rather than SVG. Satori's SVG
 * support is partial and silently drops what it cannot handle; div borders
 * and border-radius are the subset it renders reliably every time.
 *
 * Rendered portrait, matching the app's own pitch. Formation coordinates use
 * y=0 at the opponent's goal, which is also top here, so y maps straight to
 * `top` with no flip.
 */
function Pitch({ players, zones }: { players?: FormationPlayer[]; zones?: PitchZone[] }) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: 340,
        height: 470,
        borderRadius: 10,
        border: `3px solid ${CHALK_FAINT}`,
        background: "rgba(34, 56, 74, 0.35)",
      }}
    >
      {/* halfway line */}
      <div style={{ position: "absolute", top: 233, left: 0, width: 334, height: 3, background: CHALK_FAINT }} />
      {/* centre circle */}
      <div
        style={{
          position: "absolute",
          top: 174,
          left: 107,
          width: 120,
          height: 120,
          borderRadius: 60,
          border: `3px solid ${CHALK_FAINT}`,
        }}
      />
      {/* penalty areas, top and bottom */}
      <div
        style={{
          position: "absolute",
          top: -3,
          left: 74,
          width: 186,
          height: 78,
          border: `3px solid ${CHALK_FAINT}`,
          borderTopWidth: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -3,
          left: 74,
          width: 186,
          height: 78,
          border: `3px solid ${CHALK_FAINT}`,
          borderBottomWidth: 0,
        }}
      />

      {/* Before the players in document order, so a card carrying both draws the zone fill underneath the dots rather than washing them out. */}
      {zones?.map((zone, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: (zone.x / 100) * 334,
            top: (zone.y / 100) * 464,
            width: (zone.width / 100) * 334,
            height: (zone.height / 100) * 464,
            borderRadius: 6,
            background: "rgba(103, 232, 249, 0.22)",
            border: "2px solid #67e8f9",
          }}
        />
      ))}

      {players?.map((player) => (
        <div
          key={player.id}
          style={{
            display: "flex",
            position: "absolute",
            left: (player.x / 100) * 334 - 17,
            top: (player.y / 100) * 464 - 17,
            width: 34,
            height: 34,
            borderRadius: 17,
            background: "#67e8f9",
            color: GROUND,
            // Steps down for three-letter codes (CDM, CAM, LWB): at a single
            // size, either the long codes overflow the dot or the short ones
            // look undersized.
            fontSize: player.code.length > 2 ? 11 : 14,
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {player.code}
        </div>
      ))}
    </div>
  );
}

/** Structurally identical to positions.ts's Zone, redeclared so this module doesn't couple the card to the position content model. */
export type PitchZone = { x: number; y: number; width: number; height: number };

export type OgCardInput = {
  /** Small mono label above the title: the section this page belongs to. */
  eyebrow: string;
  title: string;
  subtitle?: string;
  players?: FormationPlayer[];
  zones?: PitchZone[];
};

/**
 * One card layout for every route, so a shared link is recognisably PitchStudy
 * whichever page it points at. The pitch only renders when the route actually
 * has something to draw; text-only pages get the full width for their title
 * instead of an empty pitch.
 */
/**
 * Position summaries and manager taglines are written for a page, not a card,
 * and the longest run to four lines and crowd the footer. Cuts on a word
 * boundary so the card never shows half a word.
 */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.]$/, "")}…`;
}

export function OgCard({ eyebrow, title, subtitle, players, zones }: OgCardInput) {
  const hasPitch = Boolean(players?.length || zones?.length);
  // Long lesson titles need to step down or they wrap past the card. Measured
  // against the longest title in the curriculum ("Throw-in, corner, or goal
  // kick?" and the Set Pieces module's longer entries).
  const titleSize = title.length > 46 ? 62 : title.length > 30 ? 76 : 92;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: `linear-gradient(160deg, ${GROUND} 0%, ${GROUND_DEEP} 100%)`,
        padding: 64,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: hasPitch ? 660 : 1072,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori renders <img>; next/image does not exist in this runtime */}
          <img src={getMark()} width={54} height={54} alt="" />
          <div
            style={{
              marginLeft: 16,
              fontSize: 26,
              letterSpacing: 6,
              color: INK,
              fontWeight: 700,
            }}
          >
            PITCHSTUDY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 5, color: "#67e8f9", marginBottom: 20 }}>
            {eyebrow.toUpperCase()}
          </div>
          <div style={{ fontSize: titleSize, fontWeight: 800, color: INK, lineHeight: 1.05 }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: 28, color: MUTED, marginTop: 24, lineHeight: 1.35 }}>
              {clamp(subtitle, hasPitch ? 108 : 190)}
            </div>
          )}
        </div>

        <div style={{ display: "flex", fontSize: 22, color: MUTED, letterSpacing: 2 }}>www.pitchstudy.com</div>
      </div>

      {hasPitch && <Pitch players={players} zones={zones} />}
    </div>
  );
}
