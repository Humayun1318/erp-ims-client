export default function AnimatedRegisterIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <style>
        {`
          .ari-ring    { transform-origin: 200px 200px; animation: ari-spin 26s linear infinite reverse; }
          .ari-pulse   { transform-origin: 200px 200px; animation: ari-pulse 2.2s ease-in-out infinite; }
          .ari-node    { transform-origin: 200px 96px;  animation: ari-float 3s ease-in-out infinite; }
          .ari-dot     { animation: ari-blink 1.6s ease-in-out infinite; }
          .ari-bar-1   { transform-origin: 148px 320px; animation: ari-grow 2.4s ease-in-out infinite; }
          .ari-bar-2   { transform-origin: 172px 320px; animation: ari-grow 2.4s ease-in-out infinite 0.3s; }
          .ari-bar-3   { transform-origin: 196px 320px; animation: ari-grow 2.4s ease-in-out infinite 0.6s; }
          .ari-bar-4   { transform-origin: 220px 320px; animation: ari-grow 2.4s ease-in-out infinite 0.9s; }
          .ari-dash    { animation: ari-flow 1.4s linear infinite; }

          @keyframes ari-spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes ari-pulse  {
            0%, 100% { transform: scale(1);    opacity: 0.10; }
            50%      { transform: scale(1.1);  opacity: 0.2;  }
          }
          @keyframes ari-float  {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-6px); }
          }
          @keyframes ari-blink  {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.3; }
          }
          @keyframes ari-grow   {
            0%, 100% { transform: scaleY(1); }
            50%      { transform: scaleY(1.3); }
          }
          @keyframes ari-flow   {
            to { stroke-dashoffset: -20; }
          }

          @media (prefers-reduced-motion: reduce) {
            .ari-ring, .ari-pulse, .ari-node, .ari-dot,
            .ari-bar-1, .ari-bar-2, .ari-bar-3, .ari-bar-4, .ari-dash {
              animation: none !important;
            }
          }
        `}
      </style>

      {/* Dashed orbit, spinning opposite to Login's — same family, distinct direction */}
      <circle
        className="ari-ring"
        cx="200"
        cy="200"
        r="172"
        stroke="#3498DB"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeDasharray="5 11"
        fill="none"
      />

      {/* Soft pulse behind the provisioning badge — blue, not orange, per AWS's own status semantics */}
      <circle className="ari-pulse" cx="200" cy="200" r="56" fill="#3498DB" />

      {/* Animated connector — "provisioning in progress" flow from new-user node down to the badge */}
      <line
        className="ari-dash"
        x1="200" y1="200" x2="200" y2="96"
        stroke="#3498DB"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />

      {/* ── Center: account-provisioning badge ── */}
      <g>
        <circle cx="200" cy="200" r="38" fill="#2A3648" stroke="#3498DB" strokeOpacity="0.5" strokeWidth="1.5" />
        <path
          d="M200 186 v28 M186 200 h28"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle className="ari-dot" cx="228" cy="176" r="5" fill="#3498DB" />
      </g>

      <text
        x="200"
        y="252"
        textAnchor="middle"
        fill="#FFFFFF"
        fillOpacity="0.55"
        fontSize="11"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.5"
      >
        ACCOUNT · PROVISIONING
      </text>

      {/* ── New-user node, top ── */}
      <g className="ari-node">
        <circle cx="200" cy="96" r="21" fill="#2A3648" stroke="#3498DB" strokeOpacity="0.45" />
        <circle cx="200" cy="90" r="4.8" fill="#FFFFFF" />
        <path
          d="M189 105 a11 8.5 0 0 1 22 0"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* small "+" — a new user being added to the system */}
        <path
          d="M212 84 v8 M208 88 h8"
          stroke="#1D8348"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>

      {/* ── Stock/growth bars, bottom — same visual family as Login's trend node, scaled up ── */}
      <g>
        <rect className="ari-bar-1" x="144" y="308" width="8" height="12" rx="1" fill="#FFFFFF" fillOpacity="0.7" />
        <rect className="ari-bar-2" x="168" y="300" width="8" height="20" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
        <rect className="ari-bar-3" x="192" y="290" width="8" height="30" rx="1" fill="#3498DB" />
        <rect className="ari-bar-4" x="216" y="280" width="8" height="40" rx="1" fill="#1D8348" />
      </g>
    </svg>
  );
}
