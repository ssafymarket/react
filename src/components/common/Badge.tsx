interface BadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export const Badge = ({ count, max = 99, className = '' }: BadgeProps) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={`
        absolute -top-1 -right-1
        min-w-[20px] h-5 px-1.5
        flex items-center justify-center
        bg-danger text-white text-xs font-medium
        rounded-full
        ${className}
      `.trim()}
    >
      {displayCount}
    </span>
  );
};
