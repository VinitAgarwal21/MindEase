import React, { useEffect, useState, lazy, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { Loader2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../config/env";

const ReactQuill = lazy(() => import("react-quill-new"));

const journalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  mood: z.string().min(1, "Please select a mood"),
  content: z.string().min(10, "Write at least 10 characters"),
  collection: z.string().optional(),
});

const MOODS = [
  { id: "happy", label: "😊 Happy" },
  { id: "sad", label: "😔 Sad" },
  { id: "angry", label: "😡 Angry" },
  { id: "calm", label: "😌 Calm" },
];

const JournalWrite = () => {
  const [loading, setLoading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const navigate = useNavigate();
  const { getAuthToken } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      mood: "",
      content: "",
      collection: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/api/journals/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to publish");
      toast.success("Journal published successfully!");
      reset();
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  const handleSaveDraft = async (data) => {
    if (!isDirty) return toast.error("No changes to save!");
    setIsDraftSaving(true);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/api/journals/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save draft");
      toast.success("Draft saved!");
    } catch (err) {
      toast.error(err.message || "Failed to save draft!");
    } finally {
      setIsDraftSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white-50 to-mindease-50 flex justify-center py-12 px-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-5 sm:p-8 md:p-10 w-full max-w-3xl border border-mindease-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-10 text-center">
          What’s on your mind today?
        </h1>

        {loading && <BarLoader color="#6366F1" width="100%" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              {...register("title")}
              placeholder="Give your journal a title..."
              className={`w-full border rounded-xl p-3.5 mt-1 bg-gray-50 focus:ring-2 focus:ring-mindease-400 focus:bg-white transition-all ${
                errors.title ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              How are you feeling?
            </label>
            <Controller
              control={control}
              name="mood"
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full border rounded-xl p-3.5 mt-1 bg-gray-50 focus:ring-2 focus:ring-mindease-400 focus:bg-white transition-all ${
                    errors.mood ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a mood...</option>
                  {MOODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.mood && (
              <p className="text-red-500 text-sm mt-1">{errors.mood.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Write your thoughts
            </label>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <Suspense fallback={<div>Loading editor...</div>}>
                  <div className="mt-2 border border-gray-300 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-mindease-400 transition-all">
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={loading}
                      className="min-h-[250px] max-h-[500px] bg-white"
                    />
                  </div>
                </Suspense>
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Collection */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Add to Collection (optional)
            </label>
            <input
              {...register("collection")}
              placeholder="Collection name..."
              className="w-full border rounded-xl p-3.5 mt-1 bg-gray-50 focus:ring-2 focus:ring-mindease-400 focus:bg-white border-gray-300 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit(handleSaveDraft)}
              disabled={isDraftSaving || !isDirty}
              className="px-6 py-2.5 border border-mindease-200 text-mindease-700 rounded-xl hover:bg-mindease-50 flex items-center transition-all disabled:opacity-50"
            >
              {isDraftSaving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save as Draft
            </button>

            <button
              type="submit"
              disabled={loading || !isDirty}
              className="px-7 py-2.5 bg-mindease-600 text-white rounded-xl hover:bg-mindease-700 shadow-md flex items-center transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalWrite;
