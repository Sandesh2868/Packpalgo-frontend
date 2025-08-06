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
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 flex items-center space-x-2 sm:space-x-4">
        <AuthButton compact={true} showText={false} className="bg-black shadow-lg rounded-lg px-2 sm:px-3 py-1 sm:py-2" />
        <select
          value={theme}
          onChange={(e) => toggleTheme(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 p-1 sm:p-2 rounded text-xs sm:text-sm"
        >
          {themeOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

     <section className="relative z-20 py-32 sm:py-48 text-center bg-cover bg-center min-h-[60vh] sm:min-h-[70vh] flex flex-col justify-center items-center" style={{ backgroundImage: "var(--bg-image)" }}>
  <HeroBackground />

  {/* Overlay to make text readable */}
  <div className="absolute inset-0 bg-black/40 z-10"></div>

  <div className="relative z-20 flex flex-col items-center justify-center w-full px-4">
    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 tracking-tight font-sans text-white" style={{ letterSpacing: "-0.03em" }}>
      The Pre-Trip Portal
      <span className="block w-12 sm:w-16 h-1 bg-blue-300 mx-auto mt-3 rounded-full" />
    </h1>
    <p className="text-base sm:text-lg md:text-2xl max-w-2xl mx-auto mb-8 sm:mb-10 text-white">
      Before you pack, let's play and plan!
    </p>

    <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xs sm:max-w-md mx-auto justify-center mb-6 z-20">
      <Button onClick={() => navigate("/budget-calculator")} className="bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base">💰 Budget Calculator</Button>
      <Button onClick={() => navigate("/things-to-carry")} className="bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base">📝 Pack list</Button>
      <Button onClick={() => navigate("/itinerary-planner")} className="bg-purple-600 text-white hover:bg-purple-700 text-sm sm:text-base">📅🧳 Itinerary Planner</Button>
      <Button onClick={() => navigate("/gosplit")} className="bg-pink-600 text-white hover:bg-pink-700 text-sm sm:text-base">🤝 GoSplit</Button>
    </div>

    <Button onClick={toggleMusic} className="mt-2 text-xs sm:text-sm bg-black/60 text-white hover:bg-black">
      {musicOn ? "🔇 Mute Music" : "🔊 Play Music"}
    </Button>

    <div className="flex justify-center mt-8 sm:mt-10 z-20">
      <span className="animate-bounce-slow text-xl sm:text-2xl text-gray-200 select-none">
        <svg width="24" height="32" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
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
  {/* Pure blur overlay with no background color */}
  <div className="absolute inset-0 backdrop-blur-sm z-0 pointer-events-none"></div>

  {/* Foreground content */}
  <div className="relative z-10">
    <motion.h2
      className="text-4xl font-bold mb-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ color: "var(--text)" }}
    >
      🌍 Spin the Globe — Double tap to Explore.
    </motion.h2>
    <motion.p
      className="text-lg mb-10 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{ color: "var(--text)" }}
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
          style={{ color: "white" }}
        >
          🕹️ Travel Games
        </motion.h2>
        <motion.p
          className="text-lg mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ color: "white" }}
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
