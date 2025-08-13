import React from "react";

export default function DayOutKoramangalaEventCard() {
  const event = {
    image: "/images/day-out-kora.jpg",
    title: "🌟 Day Out in Koramangala",
    date: "17th August 2025 (Sunday)",
    time: "11:00 AM – 6:00 PM",
    location: "Koramangala, Bangalore",
    price: "₹999 (includes all activities)",
    spots: "Limited slots — reserve yours with just ₹100 now, pay the rest on the day!",
    description:
      "Gear up for a full day of fun in the heart of Bangalore! From icebreakers and group bonding to a sunset walk and a surprise activity — it's all about making memories, meeting new friends, and soaking in good vibes. Bring your energy, your smile, and let's make this Sunday unforgettable!",
    itinerary: [
      "👋 Icebreaks & Squad Vibes — meet, laugh, vibe!",
      "🍔 Brunch — fuel up, foodie style!",
      "🕵️ Escape Room Chaos — crack codes, beat the clock!",
      "🌅 Sunset Stroll + Mystery Fun — aesthetic + thrill combo",
      "📸 Group Pic & Chill Wrap-Up — memories locked in!"
    ],
    link: "https://docs.google.com/forms/d/e/1FAIpQLSd85XjbsDtbP6_P65aKD0RFdzrX-Yp77ArpkmN8SEVP2aO4cQ/viewform?usp=dialog"
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-zinc-800 font-sans">
      <div className="bg-[#f0f9ff] rounded-2xl shadow-xl p-6">
        <img
          src={event.image}
          alt={event.title}
          className="w-full rounded-2xl mb-6 shadow-lg"
        />

        <h1 className="text-4xl font-bold mb-2 text-center text-blue-500">
          {event.title}
        </h1>
        <p className="text-center text-lg font-medium text-zinc-600 mb-4">
          Hosted by <span className="font-bold text-blue-400">PackPalGo</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <p><strong>📍 Place:</strong> {event.location}</p>
            <p><strong>🗓️ Date:</strong> {event.date}</p>
            <p><strong>⏰ Time:</strong> {event.time}</p>
            <p><strong>💸 Fees:</strong> {event.price}</p>
            <p><strong>🚨 Note:</strong> {event.spots}</p>
          </div>
          <div>
            <img
              src="/images/qr-code.png"
              alt="UPI QR Code"
              className="w-full max-w-xs mx-auto rounded-xl shadow-md"
            />
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold text-blue-500">🗺️ Itinerary</h2>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-zinc-700">
          {event.itinerary.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            📲 RSVP Now
          </a>
        </div>
      </div>
    </div>
  );
}
