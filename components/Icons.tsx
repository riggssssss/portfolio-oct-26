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

export const Mail = (p: P) => (
  <Base {...p}>
    <rect x="3" y="4.75" width="14" height="10.5" rx="2" />
    <path d="M3.75 6.25 10 10.75l6.25-4.5" />
  </Base>
);

/** Marcas: glifo relleno de Simple Icons (viewBox 24), no trazo. */
function Brand({ size = 18, d }: { size?: number; d: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export const LinkedIn = ({ size }: { size?: number }) => (
  <Brand
    size={size}
    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
  />
);

export const GitHub = ({ size }: { size?: number }) => (
  <Brand
    size={size}
    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
  />
);
