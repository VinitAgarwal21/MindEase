import { useParams, Link } from "react-router-dom";
import therapists from "../data/therapists";

const TherapistDetail = () => {
  const { id } = useParams();
  const therapist = therapists.find((t) => t.id === Number(id));

  if (!therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Therapist not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        {/* Back Button */}
        <Link
          to="/therapist"
          className="inline-block mb-6 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Therapists
        </Link>

        {/* Therapist Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          <img
            src={therapist.image}
            alt={therapist.name}
            className="w-40 h-40 rounded-2xl object-cover shadow-md"
          />
          <div className="flex flex-col justify-center space-y-1 text-center md:text-left">
            <h1 className="text-3xl font-semibold text-gray-800">{therapist.name}</h1>
            <p className="text-indigo-600 text-lg font-medium">
              {therapist.specialization}
            </p>
            <p className="text-gray-600">Experience: {therapist.experience}</p>
            <p className="text-gray-600">
              Session Duration: {therapist.sessionTime}
            </p>
            <p className="text-gray-700 text-lg font-semibold mt-1">
              ₹{therapist.price}
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">About</h2>
          <p className="text-gray-700 leading-relaxed">{therapist.description}</p>
        </div>

        {/* Booking Form */}
        <div className="bg-gray-100 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Book an Appointment
          </h2>
          <form className="space-y-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-base font-medium text-gray-700">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-base font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="date" className="text-base font-medium text-gray-700">
                Preferred Date
              </label>
              <input
                id="date"
                type="date"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="time" className="text-base font-medium text-gray-700">
                Select Time
              </label>
              <select
                id="time"
                className="outline-none py-2.5 px-3 rounded border border-gray-400 focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="">Select time slot</option>
                <option value="10am">10:00 AM</option>
                <option value="12pm">12:00 PM</option>
                <option value="3pm">3:00 PM</option>
                <option value="5pm">5:00 PM</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-700">
                Session Fee: ₹{therapist.price}
              </p>
              <button
                type="submit"
                className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm mt-6">
          <p>
            You’ll receive a confirmation email with your session details after booking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TherapistDetail;
