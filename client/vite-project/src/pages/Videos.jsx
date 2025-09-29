import videos from "../data/videos";
import VideoCarousel from "../components/VideoCarousel";

function Videos() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-10">Videos</h1>
<h1 className="text-4xl font-bold mb-10">Meditation & Mindfulness</h1>
      <VideoCarousel title="Meditation & Mindfulness" videos={videos.meditation} />
      <h1 className="text-4xl font-bold mb-10">Yoga & Movement</h1>

      <VideoCarousel title="Yoga & Movement" videos={videos.yoga} />
      <h1 className="text-4xl font-bold mb-10">Mental Health Awareness</h1>
      <VideoCarousel title="Mental Health Awareness" videos={videos.mentalHealth} />
      <h1 className="text-4xl font-bold mb-10">Relaxing & Healing Music</h1>
      <VideoCarousel title="Relaxing & Healing Music" videos={videos.music} />
       <h1 className="text-4xl font-bold mb-10">Gurus & Spiritual Guidance</h1>
      <VideoCarousel title="Gurus & Spiritual Guidance" videos={videos.gurus} />
      <h1 className="text-4xl font-bold mb-10">Motivation & Positivity</h1>
      <VideoCarousel title="Motivation & Positivity" videos={videos.motivation} />
    </div>
  );
}

export default Videos;
