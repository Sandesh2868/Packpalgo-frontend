import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useTheme } from './ThemeContext';

// Activity Templates with beautiful gradients and comprehensive options
const activityTemplates = {
  sightseeing: {
    name: "🏛️ City Sightseeing",
    gradient: "from-blue-500 via-purple-600 to-indigo-700",
    activities: [
      { name: "Visit Local Museum", duration: 120, category: "culture", icon: "🏛️" },
      { name: "Historic City Center Tour", duration: 90, category: "culture", icon: "🏰" },
      { name: "Cathedral Visit", duration: 60, category: "culture", icon: "⛪" },
      { name: "Viewpoint Photography", duration: 45, category: "photo", icon: "📸" },
      { name: "Local Market Exploration", duration: 75, category: "shopping", icon: "🛍️" }
    ]
  },
  foodie: {
    name: "🍕 Foodie Adventure",
    gradient: "from-orange-500 via-red-600 to-pink-700",
    activities: [
      { name: "Local Breakfast Spot", duration: 60, category: "food", icon: "🥐" },
      { name: "Street Food Tour", duration: 120, category: "food", icon: "🌮" },
      { name: "Cooking Class Experience", duration: 180, category: "food", icon: "👨‍🍳" },
      { name: "Wine Tasting", duration: 90, category: "food", icon: "🍷" },
      { name: "Rooftop Dinner", duration: 120, category: "food", icon: "🍽️" }
    ]
  },
  adventure: {
    name: "🏔️ Adventure Day",
    gradient: "from-green-500 via-emerald-600 to-teal-700",
    activities: [
      { name: "Mountain Hiking", duration: 240, category: "outdoor", icon: "🥾" },
      { name: "Rock Climbing", duration: 180, category: "outdoor", icon: "🧗‍♂️" },
      { name: "Kayak Adventure", duration: 150, category: "outdoor", icon: "🛶" },
      { name: "Zip Line Experience", duration: 90, category: "outdoor", icon: "🪂" },
      { name: "Sunset Camping", duration: 300, category: "outdoor", icon: "🏕️" }
    ]
  },
  relaxation: {
    name: "🧘‍♀️ Wellness Day",
    gradient: "from-pink-400 via-rose-500 to-purple-600",
    activities: [
      { name: "Morning Yoga", duration: 60, category: "wellness", icon: "🧘‍♀️" },
      { name: "Spa Treatment", duration: 120, category: "wellness", icon: "💆‍♀️" },
      { name: "Meditation Session", duration: 45, category: "wellness", icon: "🕯️" },
      { name: "Healthy Lunch", duration: 75, category: "wellness", icon: "🥗" },
      { name: "Beach Walk", duration: 90, category: "wellness", icon: "🏖️" }
    ]
  },
  family: {
    name: "👨‍👩‍👧‍👦 Family Fun",
    gradient: "from-yellow-400 via-orange-500 to-red-600",
    activities: [
      { name: "Theme Park Visit", duration: 360, category: "family", icon: "🎢" },
      { name: "Zoo Exploration", duration: 180, category: "family", icon: "🦁" },
      { name: "Interactive Museum", duration: 120, category: "family", icon: "🎪" },
      { name: "Park Picnic", duration: 90, category: "family", icon: "🧺" },
      { name: "Ice Cream Tour", duration: 60, category: "family", icon: "🍦" }
    ]
  },
  nightlife: {
    name: "🌃 Nightlife Experience",
    gradient: "from-purple-600 via-pink-700 to-red-800",
    activities: [
      { name: "Sunset Cocktails", duration: 90, category: "nightlife", icon: "🍹" },
      { name: "Live Music Venue", duration: 120, category: "nightlife", icon: "🎵" },
      { name: "Night Market", duration: 75, category: "nightlife", icon: "🏮" },
      { name: "Rooftop Bar", duration: 105, category: "nightlife", icon: "🏙️" },
      { name: "Dance Club", duration: 180, category: "nightlife", icon: "💃" }
    ]
  }
};

// Time slots for planning
const timeSlots = [
  { time: "06:00", label: "Early Morning" },
  { time: "08:00", label: "Morning" },
  { time: "10:00", label: "Late Morning" },
  { time: "12:00", label: "Lunch Time" },
  { time: "14:00", label: "Afternoon" },
  { time: "16:00", label: "Late Afternoon" },
  { time: "18:00", label: "Evening" },
  { time: "20:00", label: "Night" },
  { time: "22:00", label: "Late Night" }
];

// Activity Card Component
const ActivityCard = ({ activity, onEdit, onDelete, isDragging = false }) => {
  const getCategoryColor = (category) => {
    const colors = {
      culture: "bg-blue-100 text-blue-800",
      food: "bg-orange-100 text-orange-800",
      outdoor: "bg-green-100 text-green-800",
      wellness: "bg-pink-100 text-pink-800",
      family: "bg-yellow-100 text-yellow-800",
      nightlife: "bg-purple-100 text-purple-800",
      photo: "bg-indigo-100 text-indigo-800",
      shopping: "bg-red-100 text-red-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: isDragging ? 1.05 : 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-md hover:shadow-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 border border-gray-100 ${isDragging ? 'shadow-2xl rotate-2' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{activity.icon}</span>
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">{activity.name}</h4>
            <p className="text-xs text-gray-500">{formatDuration(activity.duration)}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(activity)}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
          {activity.category}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>📍</span>
          <span>{activity.location || 'Add location'}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Day Column Component
const DayColumn = ({ day, activities, onActivityDrop, onDeleteActivity, onEditActivity }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const activityData = e.dataTransfer.getData('application/json');
    if (activityData) {
      const activity = JSON.parse(activityData);
      onActivityDrop(day.id, activity);
    }
  };

  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <div className="flex-1 min-w-80">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
        {/* Day Header */}
        <div className={`bg-gradient-to-r ${day.gradient} p-4 rounded-t-xl text-white`}>
          <h3 className="font-bold text-lg">{day.name}</h3>
          <p className="text-white/80 text-sm">{day.date}</p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span>⏱️</span>
            <span>{hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : '0m'} planned</span>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className={`p-4 min-h-96 transition-all duration-200 ${
            isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📅</div>
              <p>Drag activities here to plan your day</p>
            </div>
          ) : (
            <Reorder.Group values={activities} onReorder={() => {}}>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <Reorder.Item key={activity.id} value={activity}>
                    <ActivityCard
                      activity={activity}
                      onEdit={onEditActivity}
                      onDelete={onDeleteActivity}
                    />
                  </Reorder.Item>
                ))}
              </div>
            </Reorder.Group>
          )}

          {isOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-2 border-dashed border-blue-300 rounded-lg p-4 mt-3 bg-blue-50 text-center text-blue-600"
            >
              Drop activity here!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Template Selection Modal
const TemplateModal = ({ isOpen, onClose, onSelectTemplate }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Choose Activity Template</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mt-2">Quick start your itinerary with curated activity templates</p>
        </div>

        <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(activityTemplates).map(([key, template]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${template.gradient} rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all`}
              onClick={() => onSelectTemplate(template)}
            >
              <h3 className="font-bold text-lg mb-2">{template.name}</h3>
              <p className="text-white/80 text-sm mb-4">{template.activities.length} activities included</p>
              <div className="space-y-2">
                {template.activities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span>{activity.icon}</span>
                    <span>{activity.name}</span>
                  </div>
                ))}
                {template.activities.length > 3 && (
                  <div className="text-white/70 text-sm">
                    +{template.activities.length - 3} more activities
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ItineraryPlannerPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [days, setDays] = useState([
    { id: 1, name: "Day 1", date: "Today", gradient: "from-blue-500 to-purple-600" },
    { id: 2, name: "Day 2", date: "Tomorrow", gradient: "from-purple-500 to-pink-600" },
    { id: 3, name: "Day 3", date: "Day After", gradient: "from-pink-500 to-red-600" }
  ]);
  
  const [dayActivities, setDayActivities] = useState({
    1: [],
    2: [],
    3: []
  });

  const [availableActivities, setAvailableActivities] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");

  useEffect(() => {
    // Initialize with some sample activities
    const sampleActivities = [
      { id: Date.now() + 1, name: "Explore Old Town", duration: 120, category: "culture", icon: "🏛️", location: "City Center" },
      { id: Date.now() + 2, name: "Local Food Market", duration: 90, category: "food", icon: "🍕", location: "Market Square" },
      { id: Date.now() + 3, name: "Museum Visit", duration: 150, category: "culture", icon: "🎨", location: "Art District" }
    ];
    setAvailableActivities(sampleActivities);
  }, []);

  const handleActivityDrop = (dayId, activity) => {
    const newActivity = { ...activity, id: Date.now() + Math.random() };
    setDayActivities(prev => ({
      ...prev,
      [dayId]: [...prev[dayId], newActivity]
    }));
  };

  const handleDeleteActivity = (activityId) => {
    setDayActivities(prev => {
      const newActivities = { ...prev };
      Object.keys(newActivities).forEach(dayId => {
        newActivities[dayId] = newActivities[dayId].filter(activity => activity.id !== activityId);
      });
      return newActivities;
    });
  };

  const handleEditActivity = (activity) => {
    // TODO: Implement activity editing
    console.log('Edit activity:', activity);
  };

  const handleSelectTemplate = (template) => {
    const templateActivities = template.activities.map(activity => ({
      ...activity,
      id: Date.now() + Math.random(),
      location: `${selectedDestination || 'Destination'}`
    }));
    setAvailableActivities(prev => [...prev, ...templateActivities]);
    setShowTemplateModal(false);
  };

  const addNewDay = () => {
    const newDay = {
      id: Date.now(),
      name: `Day ${days.length + 1}`,
      date: `Day ${days.length + 1}`,
      gradient: `from-${['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal'][days.length % 8]}-500 to-${['purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal', 'blue'][days.length % 8]}-600`
    };
    setDays(prev => [...prev, newDay]);
    setDayActivities(prev => ({ ...prev, [newDay.id]: [] }));
  };

  const generateSmartSuggestions = () => {
    // TODO: Implement AI-powered suggestions
    alert('Smart suggestions coming soon! This will analyze your activities and suggest optimized routes and timings.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Home
            </button>
            <h1 className="text-4xl font-bold text-gray-800 text-center flex items-center gap-3">
              <span className="text-4xl">🗓️</span>
              Itinerary Planner
            </h1>
            <div className="w-24"></div>
          </div>

          <p className="text-gray-600 text-center text-lg mb-8 max-w-2xl mx-auto">
            Drag & drop activities to create the perfect day-by-day itinerary. 
            Smart timing and route optimization included!
          </p>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <input
              type="text"
              placeholder="Enter destination (e.g., Paris, Tokyo)..."
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full md:w-80 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all"
              >
                📋 Add Templates
              </button>
              <button
                onClick={generateSmartSuggestions}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all"
              >
                🤖 Smart Suggestions
              </button>
              <button
                onClick={addNewDay}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all"
              >
                ➕ Add Day
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Available Activities Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🎯</span>
                Available Activities
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableActivities.map((activity) => (
                  <div
                    key={activity.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(activity));
                    }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <ActivityCard
                      activity={activity}
                      onEdit={handleEditActivity}
                      onDelete={(id) => setAvailableActivities(prev => prev.filter(a => a.id !== id))}
                    />
                  </div>
                ))}
              </div>

              {availableActivities.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">🎭</div>
                  <p className="text-sm">Add activity templates to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Days Timeline */}
          <div className="lg:col-span-3">
            <div className="flex gap-6 overflow-x-auto pb-6">
              {days.map((day) => (
                <DayColumn
                  key={day.id}
                  day={day}
                  activities={dayActivities[day.id] || []}
                  onActivityDrop={handleActivityDrop}
                  onDeleteActivity={handleDeleteActivity}
                  onEditActivity={handleEditActivity}
                />
              ))}
            </div>

            {/* Google Maps Placeholder */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🗺️</span>
                Route Overview
              </h3>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-2">🌍</div>
                  <p className="font-semibold">Interactive Map Coming Soon!</p>
                  <p className="text-sm">Google Maps integration with route optimization</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors">
                  📧 Email Itinerary
                </button>
                <button className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors">
                  📱 Export to Calendar
                </button>
                <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-colors">
                  📄 Generate PDF
                </button>
                <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-lg transition-colors">
                  🔗 Share with Friends
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <TemplateModal
            isOpen={showTemplateModal}
            onClose={() => setShowTemplateModal(false)}
            onSelectTemplate={handleSelectTemplate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}