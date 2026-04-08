import { useState } from "react";
import { BookOpen, Newspaper, ChevronDown } from "lucide-react";
import videos from "../data/videos";
import articles, { articleCategories } from "../data/articles";
import VideoCarousel from "../components/VideoCarousel";
import ArticleCard from "../components/ArticleCard";

function Videos() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllArticles, setShowAllArticles] = useState(false);

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const displayedArticles = showAllArticles ? filteredArticles : filteredArticles.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-10 max-w-7xl mx-auto">

      {/* ─── Page Header ─── */}
      <div className="text-center space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-title inline-block">Explore</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
          Curated articles, guided videos, and healing music — everything you need for your mental wellness journey.
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           ARTICLES SECTION
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <div className="h-9 w-9 rounded-full bg-mindease-100 flex items-center justify-center">
            <Newspaper className="w-4.5 h-4.5 text-mindease-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mental Health Articles</h2>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {articleCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setShowAllArticles(false);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedCategory === cat
                  ? "bg-mindease-500 text-white border-mindease-500 shadow-sm"
                  : "bg-white border-mindease-200 text-mindease-700 hover:bg-mindease-50 hover:border-mindease-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedArticles.map((article, idx) => (
            <ArticleCard key={idx} article={article} />
          ))}
        </div>

        {/* Show more / less */}
        {filteredArticles.length > 6 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllArticles(!showAllArticles)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-mindease-200 text-sm font-medium text-mindease-700 hover:bg-mindease-50 transition"
            >
              {showAllArticles ? "Show Less" : `Show All ${filteredArticles.length} Articles`}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllArticles ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           VIDEOS SECTION (unchanged)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-accent-100 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-accent-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Videos & Guided Content</h2>
        </div>

        <div className="space-y-8">
          <h3 className="text-lg sm:text-xl font-bold text-mindease-800">Meditation & Mindfulness</h3>
          <VideoCarousel title="Meditation & Mindfulness" videos={videos.meditation} />

          <h3 className="text-lg sm:text-xl font-bold text-mindease-800">Yoga & Movement</h3>
          <VideoCarousel title="Yoga & Movement" videos={videos.yoga} />

          <h3 className="text-lg sm:text-xl font-bold text-mindease-800">Mental Health Awareness</h3>
          <VideoCarousel title="Mental Health Awareness" videos={videos.mentalHealth} />

          <h3 className="text-lg sm:text-xl font-bold text-mindease-800">Relaxing & Healing Music</h3>
          <VideoCarousel title="Relaxing & Healing Music" videos={videos.music} />

          <h3 className="text-lg sm:text-xl font-bold text-mindease-800">Gurus & Spiritual Guidance</h3>
          <VideoCarousel title="Gurus & Spiritual Guidance" videos={videos.gurus} />

          <h3 className="text-lg sm:text-xl font-bold text-mindease-800">Motivation & Positivity</h3>
          <VideoCarousel title="Motivation & Positivity" videos={videos.motivation} />
        </div>
      </section>
    </div>
  );
}

export default Videos;
