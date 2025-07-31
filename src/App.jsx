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
        className="relative z-10 py-48 text-center bg-cover bg-center min-h-[70vh] flex flex-col justify-center items-center"
        style={{ backgroundImage: "var(--bg-image)" }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <HeroBackground />
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight font-sans text-gray-900"
            style={{ letterSpacing: "-0.03em" }}
          >
            The Pre-Trip Portal
            <span className="block w-16 h-1 bg-blue-300 mx-auto mt-3 rounded-full" />
          </h1>
          <p
            className="text-lg md:text-2xl max-w-2xl mx-auto mb-10 text-gray-700"
          >
            Before you pack, let’s play and plan!
          </p>
          <div
            className="grid grid-cols-2 gap-4 max-w-xs sm:max-w-md mx-auto justify-center mb-6"
          >
            <Button onClick={() => navigate("/budget-calculator")}>💰 Budget Calculator</Button>
            <Button onClick={() => navigate("/things-to-carry")}>📝 Pack list</Button>
            <Button onClick={() => navigate("/itinerary-planner")}>📅🧳 Itinerary Planner</Button>
            <Button onClick={() => navigate("/gosplit")}>🤝 GoSplit</Button>
          </div>
          <Button
            className="mt-2 text-sm"
            onClick={toggleMusic}
          >
            {musicOn ? "🔇 Mute Music" : "🔊 Play Music"}
          </Button>
          <div className="flex justify-center mt-10">
            <span className="animate-bounce-slow text-2xl text-gray-400 select-none">
              <svg width="28" height="36" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
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
