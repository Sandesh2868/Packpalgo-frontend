import React from "react";

export default function PotteryMeetupEvent() {
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

        {/* RSVP Button */}
        <div className="mt-8 text-center">
          <a
            href="https://docs.google.com/forms/d/1URmEQPAEddoru9zLScXZRD2eRVdG0kPcpIP0gmn2OOg/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-rose-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-rose-600 transition-transform transform hover:scale-105"
          >
            📲 RSVP Now
          </a>
        </div>
      </div>
    </div>
  );
}
