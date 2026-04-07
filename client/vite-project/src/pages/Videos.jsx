import videos from "../data/videos";
import VideoCarousel from "../components/VideoCarousel";

function Videos() {
  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Videos</h1>
      <h2 className="text-2xl sm:text-3xl font-bold">Meditation & Mindfulness</h2>
      <VideoCarousel title="Meditation & Mindfulness" videos={videos.meditation} />
      <h2 className="text-2xl sm:text-3xl font-bold">Yoga & Movement</h2>

      <VideoCarousel title="Yoga & Movement" videos={videos.yoga} />
      <h2 className="text-2xl sm:text-3xl font-bold">Mental Health Awareness</h2>
      <VideoCarousel title="Mental Health Awareness" videos={videos.mentalHealth} />
      <h2 className="text-2xl sm:text-3xl font-bold">Relaxing & Healing Music</h2>
      <VideoCarousel title="Relaxing & Healing Music" videos={videos.music} />
       <h2 className="text-2xl sm:text-3xl font-bold">Gurus & Spiritual Guidance</h2>
      <VideoCarousel title="Gurus & Spiritual Guidance" videos={videos.gurus} />
      <h2 className="text-2xl sm:text-3xl font-bold">Motivation & Positivity</h2>
      <VideoCarousel title="Motivation & Positivity" videos={videos.motivation} />
    </div>
  );
}

export default Videos;
