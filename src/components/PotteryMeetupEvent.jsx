import React, { useState } from "react";

export default function PotteryMeetupEvent() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    instagram: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

 try {
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbyoU64L7GapQNn4mDhk2W5q_bawaozvON2BeIfFLT5wYypojXxQH5NuVbK6el1BADub/exec";

  const payload = {
    name: form.name,
    phone: form.phone,
    email: form.email,
    instagram: form.instagram,
  };

  const res = await fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // Server responded but with error code
    throw new Error(Server Error: ${res.status} ${res.statusText});
  }

  const data = await res.json();
  console.log("Form submitted successfully:", data);

  alert("✅ Form submitted successfully!");
} catch (error) {
  console.error("❌ Submission failed:", error);

  if (error.message.includes("Failed to fetch")) {
    alert(
      "⚠️ Unable to submit the form. This might be due to CORS restrictions or no internet connection."
    );
  } else {
    alert(⚠️ Error: ${error.message});
  }
}


  return (
    <div className="max-w-4xl mx-auto p-6 text-zinc-800 font-sans">
      <div className="bg-[#fdf6f0] rounded-2xl shadow-xl p-6">
        {/* Top Image */}
        <img
          src="/images/pottery-workshop.jpg"
          alt="Pottery Workshop"
          className="w-full rounded-2xl mb-6 shadow-lg"
        />

        <h1 className="text-4xl font-bold mb-2 text-center text-rose-500">
          🎨 Clay & Chill
        </h1>
        <p className="text-center text-xl font-medium text-zinc-600 mb-4">
          A Hand-Pressed Pottery Workshop by{" "}
          <span className="font-bold text-rose-400">PackPalGo</span>
        </p>

        {/* Event Details */}
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
            <p>
              <strong>🗓️ Date:</strong> 10th August 2025 (Sunday)
            </p>
            <p>
              <strong>⏰ Time:</strong> 3:00 PM – 4:15 PM
            </p>
            <p>
              <strong>💸 Fees:</strong> ₹799 (includes all material & pottery to
              take home)
            </p>
            <p>
              <strong>🚨 Limited Spots:</strong> Only 15 seats!
            </p>
          </div>
          <div>
            <img
              src="/images/qr-code.png"
              alt="UPI QR Code"
              className="w-full max-w-xs mx-auto rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Itinerary */}
        <h2 className="mt-8 text-2xl font-bold text-rose-500">🗺️ Itinerary</h2>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-zinc-700">
          <li>3:00 PM – 4:15 PM – Hand-Pressed Pottery Workshop</li>
        </ul>

        {/* RSVP Form */}
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
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
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

          <button
            type="submit"
            disabled={loading}
            className={w-full bg-rose-500 text-white py-3 rounded-xl font-semibold transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-rose-600"
            }}
          >
            {loading ? "Submitting..." : "Submit RSVP"}
          </button>
        </form>
      </div>
    </div>
  );
}
