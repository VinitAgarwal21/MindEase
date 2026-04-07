export default function Card({ className = "", children }) {
  return <div className={`surface-card rounded-2xl ${className}`}>{children}</div>;
}
