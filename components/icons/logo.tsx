import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4h16v16H4z" fill="currentColor" opacity="0.1"/>
      <path d="M9.5 16V8h2.5a2.5 2.5 0 0 1 0 5h-2.5" />
      <path d="M16 16v-3a2 2 0 0 0-2-2h-1.5" />
    </svg>
  );
}
