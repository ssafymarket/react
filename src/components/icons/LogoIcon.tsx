interface LogoIconProps {
  className?: string;
  size?: number;
}

export const LogoIcon = ({ className = '', size = 32 }: LogoIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 4L20 12L28 16L20 20L16 28L12 20L4 16L12 12L16 4Z"
        fill="#034EA2"
        stroke="#034EA2"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="4" fill="white" />
    </svg>
  );
};
