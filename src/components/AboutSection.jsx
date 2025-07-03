import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-black text-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-4xl font-bold text-cyan-400 mb-4">🌍 About PackPalGo</h2>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          PackPalGo is a social travel platform built for explorers, backpackers, and wanderlusters. Our mission is to make travel more accessible, social, and fun by letting you:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-10">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:bg-gray-700 transition">
            <h3 className="text-xl font-semibold text-yellow-300">🌟 Discover Hidden Gems</h3>
            <p className="text-sm mt-2">Explore offbeat local experiences across India curated by real travelers.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:bg-gray-700 transition">
            <h3 className="text-xl font-semibold text-green-300">👫 Connect With Strangers</h3>
            <p className="text-sm mt-2">Join or create travel groups based on destination, interest, and time.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:bg-gray-700 transition">
            <h3 className="text-xl font-semibold text-pink-300">🚀 We're Launching Soon!</h3>
            <p className="text-sm mt-2">We’re building something exciting! Stay tuned for quizzes, maps, and more.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
