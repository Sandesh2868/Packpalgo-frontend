import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import HeroBackground from "./components/HeroBackground";
import InteractiveGlobe from "./components/InteractiveGlobe";
import TravelTriviaGame from "./components/TravelTriviaGame";
import GuessThePlaceGame from "./components/GuessThePlaceGame";
import ComingSoonBanner from "./components/ComingSoonBanner";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import AuthButton from "./components/AuthButton";

const bgMusic = new Audio("/sounds/background.mp3");
bgMusic.loop = true;
const clickSound = new Audio("/sounds/click.mp3");
const correctSound = new Audio("/sounds/correct.mp3");
const wrongSound = new Audio("/sounds/wrong.mp3");

const Button = ({ children, onClick, className = "", style = {} }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition min-w-32 max-w-[160px] mx-auto w-full ${className}`}
    style={style}
  >
    {children}
  </button>
);

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const themeOptions = ["dark", "beach", "sunset", "jungle"];
  const [musicOn, setMusicOn] = useState(false);
  const navigate = useNavigate();

  const toggleMusic = () => {
    if (musicOn) {
      bgMusic.pause();
    } else {
      bgMusic.play();
    }
    setMusicOn(!musicOn);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ color: "var(--text)" }}>
      {/* Header Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-4">
        <AuthButton compact={true} showText={false} className="bg-white shadow-lg rounded-lg px-3 py-2" />
        <select
          value={theme}
          onChange={(e) => toggleTheme(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
        >
          {themeOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <section
        className="relative z-10 py-40 text-center bg-cover bg-center"
        style={{ backgroundImage: "var(--bg-image)" }}
      >
        <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
        <div className="relative z-10">
          <HeroBackground />
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            The Pre-Trip Portal
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Before you pack, let’s play and plan!
          </motion.p>

          {/* ✅ BUTTON GRID 2x2 (even on mobile) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="grid grid-cols-2 gap-4 max-w-xs sm:max-w-md mx-auto justify-center"
          >
            <Button
              style={{ backgroundColor: "var(--accent)", color: "var(--text)" }}
              onClick={() => navigate("/budget-calculator")}
            >
              💰 Budget Calculator
            </Button>
            <Button
              style={{ backgroundColor: "var(--accent)", color: "var(--text)" }}
              onClick={() => navigate("/things-to-carry")}
            >
              📝 Pack list
            </Button>
            <Button
              style={{ backgroundColor: "var(--accent)", color: "var(--text)" }}
              onClick={() => navigate("/itinerary-planner")}
            >
              📅🧳 Itinerary Planner
            </Button>
            <Button
              style={{ backgroundColor: "var(--accent)", color: "var(--text)" }}
              onClick={() => navigate("/gosplit")}
            >
              🤝 GoSplit
            </Button>
          </motion.div>

          <Button
            className="mt-4 text-sm"
            onClick={toggleMusic}
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--text)"
            }}
          >
            {musicOn ? "🔇 Mute Music" : "🔊 Play Music"}
          </Button>

          <div className="flex justify-center mt-6">
            <span className="animate-bounce-slow text-4xl text-white/80 drop-shadow-lg cursor-pointer select-none">
              <svg width="36" height="46" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      <ComingSoonBanner />

      <section
        className="relative z-10 py-10 text-center bg-cover bg-center"
        style={{ backgroundImage: "var(--bg-image)" }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50 z-0 pointer-events-none" />
        <div className="relative z-10">
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🌍 Spin the Globe — Double tap to Explore.
          </motion.h2>
          <motion.p
            className="text-lg mb-10 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Rotate and zoom the interactive globe to get inspired.
          </motion.p>
          <InteractiveGlobe />
        </div>
      </section>

      <section className="relative z-10 py-32 text-center">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🕹️ Travel Games
        </motion.h2>
        <motion.p
          className="text-lg mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Play trivia, guess hidden places, and challenge your travel buddies.
        </motion.p>
        <TravelTriviaGame
          clickSound={clickSound}
          correctSound={correctSound}
          wrongSound={wrongSound}
        />
        <GuessThePlaceGame
          clickSound={clickSound}
          correctSound={correctSound}
          wrongSound={wrongSound}
        />
      </section>

      <section className="relative z-10 py-0 text-center" style={{ color: "var(--text)" }}>
        <AboutSection />
      </section>

      <section className="relative z-10 py-0 text-center" style={{ color: "var(--text)" }}>
        <Footer />
      </section>
    </main>
  );
}
