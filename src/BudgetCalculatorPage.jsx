import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import BudgetCalculator from './components/BudgetCalculator';

export default function BudgetCalculatorPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <main 
      className="relative min-h-screen overflow-x-hidden" 
      style={{ color: "var(--text)" }}
    >
      {/* Hero Section */}
      <section
        className="relative z-10 py-20 text-center bg-cover bg-center"
        style={{
          backgroundImage: "var(--bg-image)",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto px-4"
          >
            {/* Navigation */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg transition-colors"
              >
                ← Back to Home
              </button>
              <h1 className="text-4xl md:text-5xl font-bold">💰 Budget Calculator</h1>
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
            
            <motion.p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Get AI-powered budget estimates for your next adventure. 
              Plan smarter, travel better!
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Budget Calculator Section */}
      <BudgetCalculator />

      {/* Quick Actions Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-black text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6 text-white">What's Next?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/things-to-carry')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              📝 Create Pack List
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              🌍 Explore Destinations
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              🕹️ Play Travel Games
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}