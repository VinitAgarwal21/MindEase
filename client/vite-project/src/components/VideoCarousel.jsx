import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VideoCarousel = ({ videos }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const videoCard = carouselRef.current.querySelector("div"); // first video card
      if (!videoCard) return;

      const cardWidth = videoCard.offsetWidth + 16; // video card width + gap (px-4 or space-x-4 = 16px)
      carouselRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth", // 👈 smooth one-card sliding
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg p-2 rounded-full z-10"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Video Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth snap-x snap-mandatory space-x-4 px-10"
      >
        {videos.map((video, idx) => (
          <div
            key={idx}
            className="min-w-[350px] snap-center bg-white rounded-2xl shadow-md p-4"
          >
            <iframe
              width="100%"
              height="200"
              src={video.url}
              title={video.title}
              className="rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg p-2 rounded-full z-10"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default VideoCarousel;
