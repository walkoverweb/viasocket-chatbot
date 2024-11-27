import React from "react";

function OpenSidebarIcon({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "#ffffff"}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-panel-right-close"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M15 3v18" />
      <path d="m8 9 3 3-3 3" />
    </svg>
  );
}

export default OpenSidebarIcon;