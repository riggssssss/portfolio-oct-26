import type { Media as MediaT, Tone } from "@/lib/posts";
import { AutoBgImg } from "./AutoBgImg";
import { StageMedia } from "./StageMedia";
import { ClipMedia } from "./ClipMedia";

const tones: Record<Tone, { bg: string; fg: string; fill: string; soft: string }> = {
  light: { bg: "#EEEEEB", fg: "#272724", fill: "#F9F9F7", soft: "#D2D2CC" },
  mid: { bg: "#E0E0DB", fg: "#272724", fill: "#F2F2EF", soft: "#BDBDB6" },
  dark: { bg: "#272724", fg: "#ECECEA", fill: "#32322E", soft: "#4A4A45" },
};

/** Imagen real si hay `src`; si no, un wireframe dibujado que marca el hueco. */
export function Media({ media, priority }: { media: MediaT; priority?: boolean }) {
  const cls = "media";
  if (media.stage) return <StageMedia stage={media.stage} alt={media.alt} />;
  if (media.video) return <ClipMedia clip={media.video} alt={media.alt} />;
  if (media.src) {
    return (
      <div className={cls} data-bg={media.bg}>
        <AutoBgImg src={media.src} alt={media.alt} priority={priority} />
      </div>
    );
  }
  const t = tones[media.tone];
  return (
    <div className={cls} data-bg={media.tone === "dark" ? "dark" : "light"} style={{ background: t.bg, color: t.fg }}>
      <svg viewBox="0 0 800 600" role="img" aria-label={media.alt}>
        {media.kind === "phone" && <Phone x={290} y={70} t={t} />}
        {media.kind === "flow" && (
          <>
            <Phone x={90} y={110} t={t} s={0.86} step={0} />
            <Phone x={305} y={110} t={t} s={0.86} step={1} />
            <Phone x={520} y={110} t={t} s={0.86} step={2} />
          </>
        )}
        {media.kind === "desktop" && <Desktop t={t} />}
        {media.kind === "components" && <Components t={t} />}
        {media.kind === "masonry" && <Masonry t={t} />}
        {media.kind === "editor" && <Editor t={t} />}
        {media.kind === "editor-done" && <Editor t={t} done />}
      </svg>
    </div>
  );
}

type T = (typeof tones)[Tone];

function Phone({ x, y, t, s = 1, step = 1 }: { x: number; y: number; t: T; s?: number; step?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="220" height="440" rx="30" fill={t.fill} stroke={t.fg} strokeWidth="2" />
      <rect x="85" y="14" width="50" height="8" rx="4" fill={t.soft} />
      <rect x="22" y="56" width={step === 0 ? 120 : 96} height="14" rx="3" fill={t.fg} />
      <rect x="22" y="80" width="150" height="8" rx="3" fill={t.soft} />
      {step === 0 && <circle cx="110" cy="210" r="56" fill="none" stroke={t.fg} strokeWidth="2" />}
      {step === 1 &&
        [0, 1, 2].map((i) => (
          <g key={i} transform={`translate(22 ${120 + i * 62})`}>
            <rect width="176" height="46" rx="10" fill="none" stroke={t.soft} strokeWidth="2" />
            <rect x="14" y="19" width={70 + i * 18} height="8" rx="3" fill={t.fg} opacity=".7" />
          </g>
        ))}
      {step === 2 &&
        [0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(22 ${118 + i * 46})`}>
            <circle cx="14" cy="14" r="14" fill={t.soft} />
            <rect x="38" y="6" width={90 - i * 8} height="7" rx="3" fill={t.fg} />
            <rect x="38" y="19" width="60" height="6" rx="3" fill={t.soft} />
          </g>
        ))}
      <rect x="22" y="378" width="176" height="40" rx="20" fill={t.fg} />
    </g>
  );
}

function Desktop({ t }: { t: T }) {
  return (
    <g transform="translate(80 90)">
      <rect width="640" height="420" rx="12" fill={t.fill} stroke={t.fg} strokeWidth="2" />
      <line x1="0" y1="36" x2="640" y2="36" stroke={t.soft} strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={20 + i * 16} cy="18" r="5" fill={t.soft} />
      ))}
      <line x1="150" y1="36" x2="150" y2="420" stroke={t.soft} strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="20" y={60 + i * 30} width={i === 1 ? 100 : 80} height="9" rx="3" fill={i === 1 ? t.fg : t.soft} />
      ))}
      <rect x="174" y="58" width="190" height="14" rx="3" fill={t.fg} />
      <rect x="174" y="92" width="270" height="176" rx="8" fill="none" stroke={t.soft} strokeWidth="2" />
      <path d="M190 240 L230 220 L262 228 L300 186 L338 196 L374 150 L424 168" fill="none" stroke={t.fg} strokeWidth="2.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(460 ${92 + i * 36})`}>
          <rect width="156" height="28" rx="6" fill="none" stroke={t.soft} strokeWidth="2" />
          <circle cx="14" cy="14" r="4" fill={i === 0 ? t.fg : t.soft} />
          <rect x="26" y="10" width={80 - i * 6} height="8" rx="3" fill={t.fg} opacity=".7" />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(174 ${290 + i * 38})`}>
          <rect width="270" height="28" rx="6" fill={t.soft} opacity=".45" />
          <rect x="12" y="10" width="110" height="8" rx="3" fill={t.fg} opacity=".7" />
        </g>
      ))}
    </g>
  );
}

function Components({ t }: { t: T }) {
  return (
    <g>
      <rect x="110" y="120" width="170" height="48" rx="24" fill={t.fg} />
      <rect x="300" y="120" width="170" height="48" rx="24" fill="none" stroke={t.fg} strokeWidth="2" />
      <rect x="490" y="120" width="48" height="48" rx="24" fill="none" stroke={t.fg} strokeWidth="2" />
      <rect x="110" y="200" width="360" height="52" rx="10" fill={t.fill} stroke={t.soft} strokeWidth="2" />
      <rect x="130" y="221" width="120" height="10" rx="3" fill={t.soft} />
      <g transform="translate(500 206)">
        <rect width="80" height="40" rx="20" fill={t.fg} />
        <circle cx="60" cy="20" r="14" fill={t.bg} />
      </g>
      <g transform="translate(600 206)">
        <rect width="80" height="40" rx="20" fill="none" stroke={t.soft} strokeWidth="2" />
        <circle cx="20" cy="20" r="14" fill={t.soft} />
      </g>
      {["Active", "Pending", "Archived"].map((_, i) => (
        <rect key={i} x={110 + i * 120} y="290" width="104" height="32" rx="16" fill="none" stroke={t.fg} strokeWidth="2" opacity={1 - i * 0.25} />
      ))}
      <rect x="110" y="356" width="280" height="140" rx="12" fill={t.fill} stroke={t.soft} strokeWidth="2" />
      <rect x="130" y="380" width="140" height="12" rx="3" fill={t.fg} />
      <rect x="130" y="404" width="220" height="8" rx="3" fill={t.soft} />
      <rect x="130" y="420" width="190" height="8" rx="3" fill={t.soft} />
      <rect x="130" y="452" width="90" height="28" rx="14" fill={t.fg} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={420 + (i % 3) * 90} y={356 + Math.floor(i / 3) * 76} width="72" height="60" rx="8" fill={i === 0 ? t.fg : i === 4 ? t.soft : t.fill} stroke={t.soft} strokeWidth="2" />
      ))}
    </g>
  );
}

const CHROMA = "#00B140";

function Masonry({ t }: { t: T }) {
  const cols = [
    [150, 210, 120],
    [220, 130, 170],
    [120, 190, 200],
    [180, 160, 140],
  ];
  return (
    <g>
      <rect x="250" y="40" width="300" height="34" rx="17" fill={t.fill} stroke={t.soft} strokeWidth="2" />
      <circle cx="272" cy="57" r="6" fill="none" stroke={t.fg} strokeWidth="2" />
      {cols.map((col, c) => {
        let y = 100;
        return col.map((h, r) => {
          const x = 90 + c * 160;
          const el = (
            <g key={`${c}-${r}`}>
              <rect x={x} y={y} width="140" height={h} rx="12" fill={(c + r) % 3 === 0 ? t.soft : t.fill} />
              {(c + r) % 2 === 0 && (
                <rect x={x + 45} y={y + h / 2 - 32} width="50" height="64" rx="8" fill="none" stroke={t.fg} strokeWidth="2" />
              )}
              {(c + r) % 2 === 0 && <rect x={x + 49} y={y + h / 2 - 26} width="42" height="44" rx="3" fill={CHROMA} />}
            </g>
          );
          y += h + 16;
          return el;
        });
      })}
    </g>
  );
}

function Editor({ t, done }: { t: T; done?: boolean }) {
  return (
    <g transform="translate(70 70)">
      <rect width="660" height="460" rx="14" fill={t.fill} stroke={t.soft} strokeWidth="2" />
      <rect x="20" y="20" width="440" height="420" rx="10" fill={t.bg} />
      <g transform="translate(150 60)">
        <rect width="180" height="340" rx="28" fill={t.fg} />
        <rect x="10" y="12" width="160" height="316" rx="20" fill={done ? t.fill : CHROMA} />
        {done && (
          <>
            <rect x="26" y="44" width="90" height="12" rx="3" fill={t.fg} />
            <rect x="26" y="66" width="128" height="8" rx="3" fill={t.soft} />
            <rect x="26" y="100" width="128" height="120" rx="10" fill={t.soft} />
            <rect x="26" y="280" width="128" height="32" rx="16" fill={t.fg} />
          </>
        )}
        <path d="M10 12 L170 12 L170 120 Q90 60 10 160 Z" fill="#fff" opacity=".12" />
      </g>
      <rect x="484" y="28" width="120" height="10" rx="3" fill={t.fg} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(484 ${70 + i * 56})`}>
          <rect width="90" height="8" rx="3" fill={t.soft} />
          <rect y="22" width="152" height="4" rx="2" fill={t.soft} />
          <circle cx={40 + i * 28} cy="24" r="8" fill={t.fg} />
        </g>
      ))}
      <rect x="484" y="392" width="152" height="40" rx="20" fill={done ? t.fg : t.soft} />
    </g>
  );
}
