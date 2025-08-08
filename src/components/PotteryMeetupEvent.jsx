import React, { useState } from "react";

export default function PotteryMeetupEvent() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    instagram: "",
    screenshot: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("RSVP submitted! We’ll DM you soon 💌");
    // TODO: Upload to Firebase / backend here
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
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white"
          />
          <input
            type="text"
            name="instagram"
            placeholder="Instagram Handle (optional)"
            value={form.instagram}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border bg-white"
          />
          <input
            type="file"
            name="screenshot"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white"
          />
          <button
            type="submit"
            className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition"
          >
            Submit RSVP
          </button>
        </form>
      </div>
    </div>
  );
}
