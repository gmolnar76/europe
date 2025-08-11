import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { width?: number; height?: number };

export default function Logo({ width = 144, height = 36, ...rest }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 256 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="title desc"
      {...rest}
    >
      <title id="title">EUROPA.VOTE logo</title>
      <desc id="desc">Ring of stars and stylized E, blue-gold-teal palette.</desc>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0A2A6A" />
          <stop offset="1" stopColor="#2EC5B6" />
        </linearGradient>
      </defs>
      {/* Logomark */}
      <g transform="translate(24,32)">
        <circle r="16" fill="none" stroke="#0A2A6A" strokeWidth="2" />
        <g fill="#FFCC00">
          <circle cx="0" cy="-16" r="2" />
          <circle cx="11.3" cy="-11.3" r="2" />
          <circle cx="16" cy="0" r="2" />
          <circle cx="11.3" cy="11.3" r="2" />
          <circle cx="0" cy="16" r="2" />
          <circle cx="-11.3" cy="11.3" r="2" />
          <circle cx="-16" cy="0" r="2" />
          <circle cx="-11.3" cy="-11.3" r="2" />
        </g>
        <circle r="3" fill="url(#g1)" />
      </g>
      {/* Stylized E */}
      <g transform="translate(58,18)" fill="#0A2A6A">
        <rect x="0" y="0" width="22" height="4" rx="2" />
        <rect x="0" y="12" width="18" height="4" rx="2" />
        <rect x="0" y="24" width="22" height="4" rx="2" />
      </g>
      {/* Wordmark */}
      <g transform="translate(88,41)">
        <text
          fontFamily="Inter, Segoe UI, Roboto, Arial, sans-serif"
          fontSize="18"
          fontWeight={700}
          fill="#0A2A6A"
          letterSpacing="1.5"
        >
          EUROPA
        </text>
        <text
          x="94"
          fontFamily="Inter, Segoe UI, Roboto, Arial, sans-serif"
          fontSize="18"
          fontWeight={700}
          fill="#2EC5B6"
          letterSpacing="1.5"
        >
          .VOTE
        </text>
      </g>
    </svg>
  );
}
