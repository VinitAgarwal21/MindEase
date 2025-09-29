export default function Card({ className = "", children }) {
  return <div className={`bg-white rounded-2xl border ${className}`}>{children}</div>;
}
