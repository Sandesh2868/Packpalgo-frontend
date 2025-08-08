import React, { useState } from "react";
import { storage } from "../../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PotteryMeetupEvent() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    instagram: "",
    screenshot: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const uploadScreenshotAndGetUrl = async (file) => {
    if (!file) return "";
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const path = `rsvp_screenshots/${timestamp}_${safeName}`;
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  };

  const submitToGoogleSheets = async (payload) => {
    const endpoint = import.meta.env.VITE_SHEETS_WEBAPP_URL || "";
    if (!endpoint) {
      throw new Error("Missing VITE_SHEETS_WEBAPP_URL env var");
    }
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Sheets API error (${res.status}): ${text}`);
    }
    return res.json().catch(() => ({}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!form.name || !form.phone) {
        throw new Error("Name and phone are required");
      }

      // 1) Upload screenshot to Firebase Storage (optional)
      const screenshotUrl = await uploadScreenshotAndGetUrl(form.screenshot);

      // 2) Send RSVP to Google Sheets via Apps Script Web App
      const payload = {
        event: "Pottery Meetup",
        name: form.name,
        phone: form.phone,
        instagram: form.instagram || "",
        screenshotUrl,
        submittedAt: new Date().toISOString(),
      };

      await submitToGoogleSheets(payload);

      setSuccessMessage("RSVP submitted! We’ll DM you soon 💌");
      setForm({ name: "", phone: "", instagram: "", screenshot: null });
      // Clear file input visually
      const fileInput = document.getElementById("rsvp-screenshot-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setErrorMessage(err.message || "Failed to submit RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-zinc-800 font-sans">
      <div className="bg-[#fdf6f0] rounded-2xl shadow-xl p-6">
        <h1 className="text-4xl font-bold mb-2 text-center text-rose-500">🎨 Clay & Chill</h1>
        <p className="text-center text-xl font-medium text-zinc-600 mb-4">
          A Hand-Pressed Pottery Workshop by <span className="font-bold text-rose-400">PackPalGo</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <p>
              <strong>📍 Place:</strong>{" "}
              <a
                href="https://share.google/GVRV3gRlbxm98u7SE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 underline"
              >
                View Location
              </a>
            </p>
            <p><strong>🗓️ Date:</strong> 10th August 2025 (Sunday)</p>
            <p><strong>⏰ Time:</strong> 3:00 PM – 4:15 PM</p>
            <p><strong>💸 Fees:</strong> ₹499 (includes materials & snacks)</p>
            <p><strong>🎽 Dress Code:</strong> Comfy, earthy, Insta-worthy</p>
            <p><strong>🚨 Limited Spots:</strong> Only 15 seats!</p>
          </div>
          <div>
            <img
              src="/qr-code.png" // Replace with your QR image path
              alt="UPI QR Code"
              className="w-full max-w-xs mx-auto rounded-xl shadow-md"
            />
            <p className="text-center text-sm mt-2 text-zinc-500">UPI: packpalgo@ybl</p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold text-rose-500">🗺️ Itinerary</h2>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-zinc-700">
          <li>3:00 PM – Welcome & Chai</li>
          <li>3:15 PM – Hand-Pressed Pottery Workshop</li>
          <li>4:10 PM – Showcase & Quick Group Photo</li>
        </ul>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-zinc-700">📲 RSVP Now</h3>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="p-3 rounded-lg bg-green-100 text-green-700">{successMessage}</div>
          )}

          {!import.meta.env.VITE_SHEETS_WEBAPP_URL && (
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
              Configure <code>VITE_SHEETS_WEBAPP_URL</code> in your environment to enable Google Sheets submission.
            </div>
          )}

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white"
            disabled={submitting}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white"
            disabled={submitting}
          />
          <input
            type="text"
            name="instagram"
            placeholder="Instagram Handle (optional)"
            value={form.instagram}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border bg-white"
            disabled={submitting}
          />
          <input
            id="rsvp-screenshot-input"
            type="file"
            name="screenshot"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rose-500 disabled:bg-rose-300 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition"
          >
            {submitting ? "Submitting…" : "Submit RSVP"}
          </button>
        </form>
      </div>
    </div>
  );
}
