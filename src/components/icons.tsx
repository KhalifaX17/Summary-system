type IconProps = { className?: string };

const base = "shrink-0";

export function IconHome({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="17" height="17">
      <path
        d="M3.3 9.3 10 3.5l6.7 5.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8.3V16a.8.8 0 0 0 .8.8h2.4v-4.3c0-.5.4-.9.9-.9h1.8c.5 0 .9.4.9.9v4.3h2.4a.8.8 0 0 0 .8-.8V8.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconGrid({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="17" height="17">
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconList({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="17" height="17">
      <circle cx="3.3" cy="5" r="1.1" fill="currentColor" />
      <circle cx="3.3" cy="10" r="1.1" fill="currentColor" />
      <circle cx="3.3" cy="15" r="1.1" fill="currentColor" />
      <path d="M7 5H17M7 10H17M7 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlus({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="17" height="17">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.8V13.2M6.8 10H13.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconDownload({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="17" height="17">
      <path d="M10 3v9.5M6.2 9.2 10 13l3.8-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 14.5v1.2c0 .9.7 1.6 1.6 1.6h9.8c.9 0 1.6-.7 1.6-1.6v-1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconClock({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="15" height="15">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4.2l2.8 1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBudget({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="15" height="15">
      <path
        d="M10 3.2c-3.87 0-6.8 3.02-6.8 6.8s2.93 6.8 6.8 6.8 6.8-3.02 6.8-6.8-2.93-6.8-6.8-6.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M10 6.3v7.4M8 12.5c0 .9.9 1.6 2 1.6s2-.6 2-1.5c0-2-4-1.5-4-3.4 0-.9.9-1.5 2-1.5s2 .5 2 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconSparkle({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="15" height="15">
      <path d="M10 3.5c.35 2.55 1.4 3.65 4 4-2.6.35-3.65 1.45-4 4-.35-2.55-1.4-3.65-4-4 2.6-.35 3.65-1.45 4-4Z" fill="currentColor" />
    </svg>
  );
}

export function IconFolder({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="18" height="18">
      <path
        d="M3 6.2c0-.94.76-1.7 1.7-1.7h3.15c.4 0 .78.17 1.06.46l1.02 1.08c.28.29.66.46 1.06.46H15.3c.94 0 1.7.76 1.7 1.7v6.08c0 .94-.76 1.7-1.7 1.7H4.7A1.7 1.7 0 0 1 3 14.28V6.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCoin({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="18" height="18">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.3v7.4M8.1 12.6c0 .95.85 1.7 1.9 1.7s1.9-.65 1.9-1.6c0-2.1-3.8-1.5-3.8-3.5 0-.95.85-1.6 1.9-1.6s1.85.5 1.9 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsers({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="18" height="18">
      <circle cx="7.3" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.8 16c.4-2.6 2.2-4.2 4.5-4.2s4.1 1.6 4.5 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14.1" cy="6.4" r="1.9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 11.3c1.9.2 3.3 1.6 3.7 3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconAlert({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`${base} ${className}`} width="15" height="15">
      <path
        d="M10 3.3 17.3 15.7a1 1 0 0 1-.86 1.5H3.56a1 1 0 0 1-.86-1.5L10 3.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 8.3v3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.1" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function IconFileExcel({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={`${base} ${className}`} width="30" height="30">
      <path
        d="M10 4h14l6 6v24a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M13.5 20.5 20 29M20 20.5l-6.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconFilePdf({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={`${base} ${className}`} width="30" height="30">
      <path
        d="M10 4h14l6 6v24a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M13 29v-8.5h2.6c1.5 0 2.6 1 2.6 2.5s-1.1 2.5-2.6 2.5H13M21 29v-8.5h2.3c2 0 3.4 1.8 3.4 4.25S25.6 29 23.6 29H21M13 24.7h2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconFileCsv({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={`${base} ${className}`} width="30" height="30">
      <path
        d="M10 4h14l6 6v24a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10.5 20.5h5M10.5 24.7h5M10.5 28.9h5M18.5 20.5h5M18.5 24.7h5M18.5 28.9h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconEmptyBox({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`${base} ${className}`} width="44" height="44">
      <path
        d="M10 22 32 12l22 10-22 10-22-10Z"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10 22v20l22 10 22-10V22" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 32v20" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}
