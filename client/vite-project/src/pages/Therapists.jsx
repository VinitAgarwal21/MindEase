import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "../config/env";

function Therapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/therapists`);
      if (!response.ok) throw new Error("Failed to fetch therapists");
      const data = await response.json();
      setTherapists(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load therapists");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-mindease-300 border-t-mindease-600"></div>
          <p className="text-mindease-600 mt-2">Loading therapists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl mb-6 font-bold gradient-title inline-block">Our Therapists</h1>

      {therapists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-mindease-600">No therapists available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {therapists.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={t.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
                alt={t.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{t.name}</h2>
                <p className="text-sm text-gray-600">
                  {t.specialization?.join(", ") || "General Therapy"}
                </p>
                {t.experience && (
                  <p className="text-sm mt-2 text-gray-700">
                    {t.experience} years experience
                  </p>
                )}
                {t.hourlyRate && (
                  <p className="text-sm text-mindease-600 mt-2">
                    ₹{t.hourlyRate} / session
                  </p>
                )}
                <Link
                  to={`/therapist/${t._id}`}
                  className="mt-4 inline-block bg-mindease-500 text-white px-4 py-2 rounded-lg hover:bg-mindease-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Therapists;
