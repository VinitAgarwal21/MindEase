export default function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`focus-outline inline-flex items-center justify-center rounded-md text-sm font-semibold tracking-wide transition-all duration-200 ease-out disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
