function VideoCard({ title, url }) {
  return (
    <div className="w-[320px] flex-shrink-0 bg-white rounded-2xl shadow-md overflow-hidden">
      <iframe
        className="w-full h-48"
        src={url}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="p-2 text-center font-medium">{title}</div>
    </div>
  );
}

export default VideoCard;
