import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Share = (p: P) => (
  <Base {...p}>
    <path d="M10 12.5V3.75M6.75 6.75 10 3.5l3.25 3.25M5.75 10H5a1.25 1.25 0 0 0-1.25 1.25v3.5A1.25 1.25 0 0 0 5 16h10a1.25 1.25 0 0 0 1.25-1.25v-3.5A1.25 1.25 0 0 0 15 10h-.75" />
  </Base>
);

export const ArrowLeft = (p: P) => (
  <Base {...p}>
    <path d="M15.5 10h-11M8.75 5.75 4.5 10l4.25 4.25" />
  </Base>
);

export const ArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M4.5 10h11M11.25 5.75 15.5 10l-4.25 4.25" />
  </Base>
);

export const ArrowUpRight = (p: P) => (
  <Base {...p}>
    <path d="M6.5 13.5l7-7M7.5 6.5h6v6" />
  </Base>
);

export const Copy = (p: P) => (
  <Base {...p}>
    <rect x="7" y="7" width="9" height="9" rx="1.5" />
    <path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7" />
  </Base>
);

export const Check = (p: P) => (
  <Base {...p}>
    <path d="M4.75 10.5 8.25 14l7-8" />
  </Base>
);

export const ChevronLeft = (p: P) => (
  <Base {...p}>
    <path d="M12 5 7 10l5 5" />
  </Base>
);

export const ChevronRight = (p: P) => (
  <Base {...p}>
    <path d="m8 5 5 5-5 5" />
  </Base>
);

/** Flecha tipográfica: viewBox recortado al trazo, alto = x-height (1ex) vía .ex-arrow.
 *  Se lee como un glifo más del texto que la rodea. */
const EX = {
  "up-right": { vb: "5.75 5.75 8.5 8.5", d: "M6.5 13.5l7-7M7.5 6.5h6v6" },
  right: { vb: "3.75 5 12.5 10", d: "M4.5 10h11M11.25 5.75 15.5 10l-4.25 4.25" },
  left: { vb: "3.75 5 12.5 10", d: "M15.5 10h-11M8.75 5.75 4.5 10l4.25 4.25" },
} as const;

export function ExArrow({ dir = "up-right" }: { dir?: keyof typeof EX }) {
  const a = EX[dir];
  return (
    <svg className={`ex-arrow ex-${dir}`} viewBox={a.vb} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={a.d} />
    </svg>
  );
}
