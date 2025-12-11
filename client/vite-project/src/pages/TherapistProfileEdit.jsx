import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const SPECIALTIES = [
  "Anxiety",
  "Depression",
  "Stress Management",
  "Relationships",
  "Trauma",
  "Adolescents",
];

export default function TherapistProfileEdit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    headline: "",
    yearsExperience: "",
    licenseId: "",
    hourlyRate: "",
    specialties: [],
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/therapists/my-profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setForm({
            headline: data.profile.headline || "",
            yearsExperience: data.profile.experience || "",
            licenseId: data.profile.qualifications || "",
            hourlyRate: data.profile.hourlyRate || "",
            specialties: data.profile.specialization || [],
            bio: data.profile.bio || "",
          });
        }
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (item) => {
    setForm((prev) => {
      const exists = prev.specialties.includes(item);
      return {
        ...prev,
        specialties: exists
          ? prev.specialties.filter((sp) => sp !== item)
          : [...prev.specialties, item],
      };
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("http://localhost:5000/api/therapists/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bio: form.bio,
          specialization: form.specialties,
          experience: form.yearsExperience ? parseInt(form.yearsExperience) : 0,
          qualifications: form.licenseId,
          hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : 0,
          headline: form.headline,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      navigate("/therapist/appointments");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-mindease-300 border-t-mindease-600"></div>
          <p className="text-mindease-600 mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/therapist/appointments")}
            className="p-2 hover:bg-mindease-50 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-mindease-600" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-mindease-900">Edit Your Profile</h1>
            <p className="text-mindease-600 mt-1">Update your professional information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-mindease-800">Profile headline</label>
            <input
              id="headline"
              value={form.headline}
              onChange={handleChange}
              placeholder="e.g., Compassionate therapist specializing in anxiety and relationships"
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mindease-400 focus:outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mindease-800">Years of experience</label>
              <input
                id="yearsExperience"
                value={form.yearsExperience}
                onChange={handleChange}
                type="number"
                min="0"
                className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mindease-400 focus:outline-none"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mindease-800">Hourly rate (USD)</label>
              <input
                id="hourlyRate"
                value={form.hourlyRate}
                onChange={handleChange}
                type="number"
                min="0"
                className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mindease-400 focus:outline-none"
                placeholder="e.g., 80"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mindease-800">License / registration ID</label>
            <input
              id="licenseId"
              value={form.licenseId}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mindease-400 focus:outline-none"
              placeholder="Enter your license number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mindease-800">Specialties</label>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {SPECIALTIES.map((item) => {
                const active = form.specialties.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleSpecialty(item)}
                    className={`border rounded-lg px-3 py-2 text-left transition ${
                      active ? "bg-mindease-100 border-mindease-400 text-mindease-900" : "bg-white text-mindease-700"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mindease-800">About you</label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={handleChange}
              rows={5}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mindease-400 focus:outline-none"
              placeholder="Share your therapeutic approach, languages, and what clients can expect."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/therapist/appointments")}
              className="px-4 py-2 border rounded-lg text-mindease-700 hover:bg-mindease-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-mindease-600 text-white rounded-lg hover:bg-mindease-700 flex items-center gap-2"
            >
              {saving ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
