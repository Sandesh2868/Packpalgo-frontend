import React from "react";

export default function ComingSoonBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-white py-6 px-4 text-center shadow-md z-20 relative">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 animate-pulse">
        🚀 PackPalGo is Coming Soon!
      </h1>
      <p className="text-md md:text-lg font-medium max-w-2xl mx-auto mb-4">
        Your go-to platform to discover hidden gems, connect with travel buddies,
        and create unforgettable trips. Launching soon!
      </p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdrC7PFcIhxDR4rqGHrxdvKmivxk-i6wdrCqanGi8aG6JSXuQ/viewform?usp=dialog"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white text-pink-700 font-semibold px-6 py-2 rounded-full hover:bg-pink-100 transition"
      >
        Join Waitlist
      </a>
    </section>
  );
}
