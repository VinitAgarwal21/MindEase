import { Link } from "react-router-dom";
import therapists from "../data/therapists";

function Therapists() {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-mindease-600">Our Therapists</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {therapists.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition"
          >
            <img
              src={t.image}
              alt={t.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{t.name}</h2>
              <p className="text-sm text-gray-600">{t.specialization}</p>
              <p className="text-sm mt-2 text-gray-700">
                {t.experience} experience
              </p>
              <p className="text-sm text-mindease-600 mt-2">
                ₹{t.price} / session ({t.sessionTime})
              </p>
              <Link
                to={`/therapist/${t.id}`}
                className="mt-4 inline-block bg-mindease-500 text-white px-4 py-2 rounded-lg hover:bg-mindease-600 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Therapists;
