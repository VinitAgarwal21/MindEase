import { ExternalLink } from "lucide-react";

const SOURCE_COLORS = {
  WHO: "bg-blue-50 text-blue-700 border-blue-200",
  NIMH: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NHS: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Mind UK": "bg-purple-50 text-purple-700 border-purple-200",
  CDC: "bg-orange-50 text-orange-700 border-orange-200",
  "University of Rochester": "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export default function ArticleCard({ article }) {
  const colorClass = SOURCE_COLORS[article.source] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group surface-card rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Top row — emoji + source */}
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${colorClass}`}>
          {article.source}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-800 leading-snug group-hover:text-mindease-600 transition-colors line-clamp-2">
        {article.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-grow">
        {article.description}
      </p>

      {/* Footer — category + icon */}
      <div className="flex items-center justify-between pt-2 border-t border-mindease-100 mt-auto">
        <span className="text-[11px] text-mindease-600 font-medium">
          {article.category}
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-mindease-500 transition-colors" />
      </div>
    </a>
  );
}
