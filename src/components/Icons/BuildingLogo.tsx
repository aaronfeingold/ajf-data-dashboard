const BuildingLogo = ({ className = "", size = 24 }) => {
  return (
    <div style={{ width: size, height: size }} className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
        <style>{`
            @keyframes buildUp {
            0% {
                transform: scaleY(0);
                transform-origin: bottom;
            }
            100% {
                transform: scaleY(1);
                transform-origin: bottom;
            }
            }
            .building {
            animation: buildUp 1.5s ease-out;
            }
            .window {
            animation: buildUp 1.5s ease-out;
            animation-delay: 0.5s;
            opacity: 0;
            animation-fill-mode: forwards;
            }
            .door {
            animation: buildUp 1.5s ease-out;
            animation-delay: 1s;
            opacity: 0;
            animation-fill-mode: forwards;
            }
        `}</style>

        <path
          className="building"
          d="M20 110 L20 30 L80 30 L80 110 Z"
          fill="#4A5568"
          stroke="#2D3748"
          strokeWidth="2"
        />

        <g className="window">
          <rect x="30" y="40" width="10" height="10" fill="#A0AEC0" />
          <rect x="60" y="40" width="10" height="10" fill="#A0AEC0" />

          <rect x="30" y="60" width="10" height="10" fill="#A0AEC0" />
          <rect x="60" y="60" width="10" height="10" fill="#A0AEC0" />

          <rect x="30" y="80" width="10" height="10" fill="#A0AEC0" />
          <rect x="60" y="80" width="10" height="10" fill="#A0AEC0" />
        </g>

        <path
          className="door"
          d="M45 110 L45 90 L55 90 L55 110 Z"
          fill="#A0AEC0"
        />

        <path
          className="building"
          d="M30 30 L50 10 L70 30 Z"
          fill="#4A5568"
          stroke="#2D3748"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default BuildingLogo;
