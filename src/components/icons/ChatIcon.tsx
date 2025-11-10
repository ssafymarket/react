interface ChatIconProps {
  className?: string;
  size?: number;
}

export const ChatIcon = ({ className = '', size = 24 }: ChatIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5286 20 9.1381 19.6869 7.89445 19.1282L3 20L4.88197 16.0368C3.70806 14.726 3 13.0404 3 11.2C3 6.78201 7.02944 3 12 3C16.9706 3 21 6.78201 21 11.2V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
