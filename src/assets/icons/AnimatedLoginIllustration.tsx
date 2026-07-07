export default function AnimatedLoginIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <style>
        {`
          .aei-ring   { transform-origin: 200px 200px; animation: aei-spin 24s linear infinite; }
          .aei-pulse  { transform-origin: 200px 200px; animation: aei-pulse 2.5s ease-in-out infinite; }
          .aei-node-a { transform-origin: 200px 74px;  animation: aei-float 3s ease-in-out infinite; }
          .aei-node-b { transform-origin: 96px 292px;  animation: aei-float 3s ease-in-out infinite 0.4s; }
          .aei-node-c { transform-origin: 304px 292px; animation: aei-float 3s ease-in-out infinite 0.8s; }
          .aei-dot    { animation: aei-blink 2s ease-in-out infinite; }
          .aei-bar-3  { transform-origin: 316px 304px; animation: aei-grow 2.4s ease-in-out infinite; }

          @keyframes aei-spin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes aei-pulse {
            0%, 100% { transform: scale(1);    opacity: 0.10; }
            50%      { transform: scale(1.08); opacity: 0.18; }
          }
          @keyframes aei-float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-6px); }
          }
          @keyframes aei-blink {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.35; }
          }
          @keyframes aei-grow {
            0%, 100% { transform: scaleY(1); }
            50%      { transform: scaleY(1.25); }
          }

          @media (prefers-reduced-motion: reduce) {
            .aei-ring, .aei-pulse, .aei-node-a, .aei-node-b, .aei-node-c, .aei-dot, .aei-bar-3 {
              animation: none !important;
            }
          }
        `}
      </style>

      {/* Slow dashed orbit — AWS-orange, restrained per doc's "accent, never dominates" rule */}
      <circle
        className="aei-ring"
        cx="200"
        cy="200"
        r="172"
        stroke="#FF9900"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeDasharray="5 11"
        fill="none"
      />

      {/* Soft pulse behind the crate — orange, not the old green/amber palette */}
      <circle className="aei-pulse" cx="200" cy="200" r="58" fill="#FF9900" />

      {/* Dashed connector spokes, matching the ring's dash rhythm */}
      <line
        x1="200"
        y1="200"
        x2="200"
        y2="74"
        stroke="#FF9900"
        strokeOpacity="0.28"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <line
        x1="200"
        y1="200"
        x2="96"
        y2="292"
        stroke="#FF9900"
        strokeOpacity="0.28"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <line
        x1="200"
        y1="200"
        x2="304"
        y2="292"
        stroke="#FF9900"
        strokeOpacity="0.28"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />

      {/* ── Isometric inventory crate — the sole signature element ── */}
      <g>
        <polygon points="200,142 248,167 200,192 152,167" fill="#FFFFFF" />
        <polygon points="152,167 200,192 200,242 152,217" fill="#FF9900" />
        <polygon points="200,192 248,167 248,217 200,242" fill="#EC7211" />
        {/* packing-tape seam */}
        <line
          x1="152"
          y1="192"
          x2="248"
          y2="192"
          stroke="#16191F"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        <line
          x1="200"
          y1="192"
          x2="200"
          y2="242"
          stroke="#16191F"
          strokeOpacity="0.12"
          strokeWidth="1.5"
        />
        {/* live status indicator, top-right of crate */}
        <circle className="aei-dot" cx="240" cy="156" r="5" fill="#1D8348" />
        <circle
          cx="240"
          cy="156"
          r="5"
          fill="none"
          stroke="#232F3E"
          strokeWidth="1.5"
        />
      </g>

      {/* SKU label beneath the crate, monospace per doc's identifier convention */}
      <text
        x="200"
        y="266"
        textAnchor="middle"
        fill="#FFFFFF"
        fillOpacity="0.55"
        fontSize="11"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.5"
      >
        SKU-10231 · IN STOCK
      </text>

      {/* ── Node A — Sales ── */}
      <g className="aei-node-a">
        <circle
          cx="200"
          cy="74"
          r="21"
          fill="#2A3648"
          stroke="#FF9900"
          strokeOpacity="0.45"
        />
        <path
          d="M190 69 h4 l3 12 h11 l3.5 -9 h-15"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="196" cy="85" r="1.7" fill="#FFFFFF" />
        <circle cx="206" cy="85" r="1.7" fill="#FFFFFF" />
      </g>

      {/* ── Node B — Customers ── */}
      <g className="aei-node-b">
        <circle
          cx="96"
          cy="292"
          r="21"
          fill="#2A3648"
          stroke="#FF9900"
          strokeOpacity="0.45"
        />
        <circle cx="96" cy="285" r="4.8" fill="#FFFFFF" />
        <path
          d="M85 300 a11 8.5 0 0 1 22 0"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>

      {/* ── Node C — Stock trend ── */}
      <g className="aei-node-c">
        <circle
          cx="304"
          cy="292"
          r="21"
          fill="#2A3648"
          stroke="#FF9900"
          strokeOpacity="0.45"
        />
        <rect x="294" y="295" width="4" height="8" fill="#FFFFFF" />
        <rect x="301" y="289" width="4" height="14" fill="#FFFFFF" />
        <rect
          className="aei-bar-3"
          x="308"
          y="284"
          width="4"
          height="19"
          fill="#1D8348"
        />
      </g>
    </svg>
  );
}
