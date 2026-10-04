export function FolderGraphic({ emoji, size = 68 }) {
  return (
    <div
      className="folder-graphic-container"
      style={{ width: size, height: size * 0.8 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 76 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="folder-svg"
      >
        {/* Back flap with tab */}
        <path
          d="M4 11C4 7.68629 6.68629 5 10 5H25C27.2 5 29.3 6.1 30.5 8L32.5 11C33.7 12.9 35.8 14 38 14H66C69.3137 14 72 16.6863 72 20V49C72 52.3137 69.3137 55 66 55H10C6.68629 55 4 52.3137 4 49V11Z"
          fill="#334155"
        />
        {/* White paper insert */}
        <rect
          x="12"
          y="8"
          width="52"
          height="28"
          rx="3"
          fill="#ffffff"
          className="folder-svg-paper"
        />
        {/* Paper preview lines */}
        <line
          x1="18"
          y1="14"
          x2="38"
          y2="14"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="18"
          y1="18"
          x2="48"
          y2="18"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Front pocket with gradient */}
        <path
          d="M4 22C4 18.6863 6.68629 16 10 16H66C69.3137 16 72 18.6863 72 22V49C72 52.3137 69.3137 55 66 55H10C6.68629 55 4 52.3137 4 49V22Z"
          fill="url(#folderFrontGradient)"
        />
        {/* Soft top highlight on front pocket */}
        <path
          d="M10 16.5H66"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="folderFrontGradient"
            x1="38"
            y1="16"
            x2="38"
            y2="55"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4f5e74" />
            <stop offset="1" stopColor="#313d4f" />
          </linearGradient>
        </defs>
      </svg>

      {emoji ? (
        <span className="folder-graphic-badge">{emoji}</span>
      ) : null}
    </div>
  );
}
