export const UnitedStates = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 15 10"
    >
      {/* Base white flag */}
      <rect width="15" height="10" fill="#ffffff" />

      {/* 13 alternating stripes (7 red, 6 white) */}
      <rect y="0" width="15" height="0.77" fill="#B22234" />
      <rect y="1.54" width="15" height="0.77" fill="#B22234" />
      <rect y="3.08" width="15" height="0.77" fill="#B22234" />
      <rect y="4.62" width="15" height="0.77" fill="#B22234" />
      <rect y="6.16" width="15" height="0.77" fill="#B22234" />
      <rect y="7.7" width="15" height="0.77" fill="#B22234" />
      <rect y="9.23" width="15" height="0.77" fill="#B22234" />

      {/* Blue canton */}
      <rect width="6" height="5.39" fill="#3C3B6E" />

      {/* Stars - simplified for small size */}
      <g fill="#ffffff">
        <circle cx="1" cy="0.9" r="0.25" />
        <circle cx="2" cy="0.9" r="0.25" />
        <circle cx="3" cy="0.9" r="0.25" />
        <circle cx="4" cy="0.9" r="0.25" />
        <circle cx="5" cy="0.9" r="0.25" />

        <circle cx="1.5" cy="1.8" r="0.25" />
        <circle cx="2.5" cy="1.8" r="0.25" />
        <circle cx="3.5" cy="1.8" r="0.25" />
        <circle cx="4.5" cy="1.8" r="0.25" />

        <circle cx="1" cy="2.7" r="0.25" />
        <circle cx="2" cy="2.7" r="0.25" />
        <circle cx="3" cy="2.7" r="0.25" />
        <circle cx="4" cy="2.7" r="0.25" />
        <circle cx="5" cy="2.7" r="0.25" />

        <circle cx="1.5" cy="3.6" r="0.25" />
        <circle cx="2.5" cy="3.6" r="0.25" />
        <circle cx="3.5" cy="3.6" r="0.25" />
        <circle cx="4.5" cy="3.6" r="0.25" />

        <circle cx="1" cy="4.5" r="0.25" />
        <circle cx="2" cy="4.5" r="0.25" />
        <circle cx="3" cy="4.5" r="0.25" />
        <circle cx="4" cy="4.5" r="0.25" />
        <circle cx="5" cy="4.5" r="0.25" />
      </g>
    </svg>
  );
};
