import React, { useEffect, useState, lazy, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { Loader2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

// ✅ Load ReactQuill lazily for Vite (not Next.js)
const ReactQuill = lazy(() => import("react-quill-new"));


// ✅ Zod validation schema
const journalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  mood: z.string().min(1, "Please select a mood"),
  content: z.string().min(10, "Write at least 10 characters"),
  collection: z.string().optional(),
});

// ✅ Mock moods
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
    const res = await fetch("http://localhost:5000/api/journals/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch("http://localhost:5000/api/journals/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          What’s on your mind today?
        </h1>

        {loading && <BarLoader color="#3B82F6" width="100%" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              {...register("title")}
              placeholder="Give your journal a title..."
              className={`w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm font-medium">How are you feeling?</label>
            <Controller
              control={control}
              name="mood"
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 ${
                    errors.mood ? "border-red-500" : "border-gray-300"
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
              <p className="text-red-500 text-sm">{errors.mood.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium">Write your thoughts</label>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <Suspense fallback={<div>Loading editor...</div>}>
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    readOnly={loading}
                    className="mt-2"
                  />
                </Suspense>
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          {/* Collection */}
          <div>
            <label className="text-sm font-medium">
              Add to Collection (optional)
            </label>
            <input
              {...register("collection")}
              placeholder="Collection name..."
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-400 border-gray-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleSubmit(handleSaveDraft)}
              disabled={isDraftSaving || !isDirty}
              className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center"
            >
              {isDraftSaving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save as Draft
            </button>

            <button
              type="submit"
              disabled={loading || !isDirty}
              className="px-6 py-2.5 bg-mindease-600 text-white rounded-lg hover:bg-mindease-700 flex items-center"
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