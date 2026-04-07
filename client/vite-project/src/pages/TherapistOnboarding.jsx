import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, CalendarCheck, FileText, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { resizeImageToDataUrl } from "../utils/imageUpload.js";
import { API_BASE_URL } from "../config/env";

const SPECIALTIES = [
  "Anxiety",
  "Depression",
  "Stress Management",
  "Relationships",
  "Trauma",
  "Adolescents",
];

export default function TherapistOnboarding() {
  const navigate = useNavigate();
  const { user, getAuthToken } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    headline: "",
    yearsExperience: "",
    licenseId: "",
    hourlyRate: "",
    specialties: [],
    bio: "",
    profilePicture: "",
  });

  const displayName = useMemo(() => user?.name || "Therapist", [user]);

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/therapists/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile && (data.profile.bio || data.profile.headline)) {
          // Profile already completed, redirect to appointments
          toast.info("Profile already completed. Redirecting...");
          navigate("/therapist/appointments");
          return;
        }

        if (data.profile) {
          setForm({
            headline: data.profile.headline || "",
            yearsExperience: data.profile.experience || "",
            licenseId: data.profile.qualifications || "",
            hourlyRate: data.profile.hourlyRate || "",
            specialties: data.profile.specialization || [],
            bio: data.profile.bio || "",
            profilePicture: data.profile.profilePicture || "",
          });
        }
      }
    } catch (error) {
      console.error("Check profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-mindease-300 border-t-mindease-600"></div>
          <p className="text-mindease-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

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

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    try {
      const profilePicture = await resizeImageToDataUrl(file);
      setForm((prev) => ({ ...prev, profilePicture }));
      toast.success("Profile photo added.");
    } catch (error) {
      toast.error(error.message || "Failed to process image.");
    } finally {
      e.target.value = "";
    }
  };

  const removeProfilePhoto = () => {
    setForm((prev) => ({ ...prev, profilePicture: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.headline || !form.bio) {
      toast.error("Add a headline and bio to continue.");
      return;
    }
    setSaving(true);
    
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/therapists/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: form.bio,
          specialization: form.specialties,
          experience: form.yearsExperience ? parseInt(form.yearsExperience) : 0,
          qualifications: form.licenseId,
          hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : 0,
          headline: form.headline,
          profilePicture: form.profilePicture,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save profile");
      }

      toast.success("Therapist profile saved successfully!");
      navigate("/therapist/appointments");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto px-1 sm:px-0">
      <header className="bg-white border rounded-2xl shadow-sm p-5 sm:p-8 flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 text-sm text-mindease-600 font-medium">
          <Sparkles className="h-4 w-4" />
          New therapist setup
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-mindease-600">Welcome, {displayName}</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-mindease-900">Let us personalize your practice</h1>
            <p className="text-mindease-600 mt-2">
              Share a few details so clients can discover you with the right expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm text-mindease-700 w-full sm:w-auto">
            <div className="bg-mindease-50 border rounded-xl px-4 py-3">
              <p className="text-2xl font-semibold text-mindease-900">5 min</p>
              <p>to complete</p>
            </div>
            <div className="bg-mindease-50 border rounded-xl px-4 py-3">
              <p className="text-2xl font-semibold text-mindease-900">Secure</p>
              <p>data handling</p>
            </div>
            <div className="bg-mindease-50 border rounded-xl px-4 py-3">
              <p className="text-2xl font-semibold text-mindease-900">Live</p>
              <p>once verified</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2 space-y-6">
          <form className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-mindease-800">Profile photo</label>
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                <img
                  src={form.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt="Therapist preview"
                  className="h-24 w-24 rounded-2xl object-cover border border-mindease-200 shadow-sm"
                />
                <div className="space-y-2">
                  <label className="inline-flex cursor-pointer items-center rounded-lg bg-mindease-600 px-4 py-2 text-white hover:bg-mindease-700 transition">
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={handleProfilePhotoChange}
                    />
                  </label>
                  {form.profilePicture && (
                    <button
                      type="button"
                      onClick={removeProfilePhoto}
                      className="block text-sm text-red-600 hover:text-red-700"
                    >
                      Remove photo
                    </button>
                  )}
                  <p className="text-xs text-mindease-600">Add a clear headshot so clients can recognize you before booking.</p>
                </div>
              </div>
            </div>

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
                <label className="block text-sm font-medium text-mindease-800">Session fee (INR)</label>
                <input
                  id="hourlyRate"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mindease-400 focus:outline-none"
                  placeholder="e.g., 1000"
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

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 border rounded-lg text-mindease-700 hover:bg-mindease-50"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-mindease-600 text-white rounded-lg hover:bg-mindease-700 flex items-center gap-2"
              >
                {saving && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                Save and continue
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-3 text-mindease-800 font-semibold">
              <ShieldCheck className="h-5 w-5" />
              Verification steps
            </div>
            <ul className="space-y-3 text-sm text-mindease-700">
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Upload your license ID for review.</li>
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Add specialties and experience to improve matching.</li>
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Complete your bio to publish your profile.</li>
            </ul>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-3 text-mindease-800 font-semibold">
              <CalendarCheck className="h-5 w-5" />
              Next actions
            </div>
            <ul className="space-y-3 text-sm text-mindease-700">
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Enable availability to accept sessions.</li>
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Set your preferred session formats.</li>
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Connect your calendar to avoid conflicts.</li>
            </ul>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-3 text-mindease-800 font-semibold">
              <FileText className="h-5 w-5" />
              Tips for a strong profile
            </div>
            <ul className="space-y-3 text-sm text-mindease-700">
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Keep your headline focused on outcomes.</li>
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Mention certifications and languages.</li>
              <li className="flex gap-2"><span className="text-mindease-500">•</span> Add a welcoming, concise bio.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
