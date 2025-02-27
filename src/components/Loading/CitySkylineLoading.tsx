import React from "react";

const CitySkylineLoading = ({ animated = false }) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      className="w-56 h-32"
    >
      <defs>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4B5563", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#1F2937", stopOpacity: 1 }}
          />
        </linearGradient>
        {animated && (
          <style>
            {`
              @keyframes growUp {
                from { transform: scaleY(0); }
                to { transform: scaleY(1); }
              }
              .building {
                transform-origin: bottom;
                animation: growUp 2s ease-out forwards;
              }
              .building-1 { animation-delay: 0s; }
              .building-2 { animation-delay: 0.2s; }
              .building-3 { animation-delay: 0.4s; }
              .building-4 { animation-delay: 0.6s; }
              .building-5 { animation-delay: 0.8s; }
              .building-6 { animation-delay: 1s; }
              .building-7 { animation-delay: 1.2s; }
            `}
          </style>
        )}
      </defs>
      <g fill="url(#buildingGradient)">
        <g className={animated ? "building building-1" : ""}>
          <rect x="10" y="80" width="40" height="120" rx="2" />
          <rect x="20" y="60" width="20" height="30" />
        </g>
        <g className={animated ? "building building-2" : ""}>
          <rect x="60" y="100" width="50" height="100" rx="2" />
          <rect x="75" y="70" width="20" height="40" />
        </g>
        <g className={animated ? "building building-3" : ""}>
          <rect x="120" y="40" width="60" height="160" rx="2" />
          <rect x="140" y="20" width="20" height="30" />
        </g>
        <g className={animated ? "building building-4" : ""}>
          <rect x="190" y="90" width="45" height="110" rx="2" />
        </g>
        <g className={animated ? "building building-5" : ""}>
          <rect x="245" y="20" width="70" height="180" rx="2" />
          <rect x="265" y="0" width="30" height="30" />
        </g>
        <g className={animated ? "building building-6" : ""}>
          <rect x="325" y="70" width="40" height="130" rx="2" />
        </g>
        <g className={animated ? "building building-7" : ""}>
          <rect x="375" y="110" width="35" height="90" rx="2" />
        </g>
      </g>
      <g fill="#A5F3FC" opacity="0.3">
        <g className={animated ? "building building-1" : ""}>
          <rect x="20" y="90" width="20" height="5" rx="1" />
          <rect x="20" y="105" width="20" height="5" rx="1" />
          <rect x="20" y="120" width="20" height="5" rx="1" />
        </g>
        <g className={animated ? "building building-2" : ""}>
          <rect x="75" y="110" width="20" height="5" rx="1" />
          <rect x="75" y="125" width="20" height="5" rx="1" />
        </g>
        <g className={animated ? "building building-3" : ""}>
          <rect x="140" y="50" width="20" height="5" rx="1" />
          <rect x="140" y="65" width="20" height="5" rx="1" />
          <rect x="140" y="80" width="20" height="5" rx="1" />
        </g>
        <g className={animated ? "building building-5" : ""}>
          <rect x="265" y="40" width="30" height="5" rx="1" />
          <rect x="265" y="55" width="30" height="5" rx="1" />
          <rect x="265" y="70" width="30" height="5" rx="1" />
        </g>
      </g>
    </svg>
  </>
);

export default CitySkylineLoading;
