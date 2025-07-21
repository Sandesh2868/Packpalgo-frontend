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
  },
  nature: {
    name: "🌲 Nature Walk",
    gradient: "from-green-300 via-green-500 to-green-700",
    activities: [
      { name: "Botanical Garden Visit", duration: 90, category: "nature", icon: "🌺" },
      { name: "Forest Trail Hike", duration: 120, category: "nature", icon: "🌳" },
      { name: "Bird Watching", duration: 60, category: "nature", icon: "🦜" },
      { name: "Picnic by the Lake", duration: 90, category: "nature", icon: "🏞️" },
      { name: "Sunrise Walk", duration: 60, category: "nature", icon: "🌅" }
    ]
  },
  shopping: {
    name: "🛍️ Shopping Spree",
    gradient: "from-pink-300 via-pink-500 to-pink-700",
    activities: [
      { name: "Mall Shopping", duration: 120, category: "shopping", icon: "🏬" },
      { name: "Local Boutique Tour", duration: 90, category: "shopping", icon: "👗" },
      { name: "Souvenir Hunt", duration: 60, category: "shopping", icon: "🎁" },
      { name: "Coffee Break", duration: 45, category: "food", icon: "☕" },
      { name: "Evening Market", duration: 90, category: "shopping", icon: "🛒" }
    ]
  },
  art: {
    name: "🎨 Art & Culture",
    gradient: "from-indigo-300 via-indigo-500 to-indigo-700",
    activities: [
      { name: "Art Gallery Tour", duration: 90, category: "culture", icon: "🖼️" },
      { name: "Sculpture Park", duration: 60, category: "culture", icon: "🗿" },
      { name: "Theater Show", duration: 120, category: "culture", icon: "🎭" },
      { name: "Bookstore Visit", duration: 45, category: "culture", icon: "📚" },
      { name: "Poetry Reading", duration: 60, category: "culture", icon: "📝" }
    ]
  },
  sports: {
    name: "⚽ Sports Day",
    gradient: "from-yellow-300 via-yellow-500 to-yellow-700",
    activities: [
      { name: "Morning Jog", duration: 45, category: "sports", icon: "🏃‍♂️" },
      { name: "Tennis Match", duration: 90, category: "sports", icon: "🎾" },
      { name: "Swimming", duration: 60, category: "sports", icon: "🏊‍♂️" },
      { name: "Cycling Tour", duration: 120, category: "sports", icon: "🚴‍♀️" },
      { name: "Evening Yoga", duration: 60, category: "wellness", icon: "🧘‍♂️" }
    ]
  },
  tech: {
    name: "💻 Tech Tour",
    gradient: "from-gray-400 via-gray-600 to-gray-800",
    activities: [
      { name: "Science Museum", duration: 120, category: "tech", icon: "🔬" },
      { name: "Tech Startup Visit", duration: 90, category: "tech", icon: "🏢" },
      { name: "Gadget Shopping", duration: 60, category: "tech", icon: "📱" },
      { name: "VR Experience", duration: 75, category: "tech", icon: "🕶️" },
      { name: "Coding Workshop", duration: 120, category: "tech", icon: "💡" }
    ]
  }
};

// Add after activityTemplates
const destinationActivities = {
  paris: [
    { name: "Eiffel Tower Visit", duration: 120, category: "culture", icon: "🗼", location: "Eiffel Tower" },
    { name: "Louvre Museum Tour", duration: 180, category: "culture", icon: "🖼️", location: "Louvre Museum" },
    { name: "Seine River Cruise", duration: 90, category: "outdoor", icon: "🚤", location: "Seine River" },
    { name: "Montmartre Walk", duration: 60, category: "culture", icon: "🎨", location: "Montmartre" },
    { name: "French Pastry Tasting", duration: 60, category: "food", icon: "🥐", location: "Bakery" }
  ],
  tokyo: [
    { name: "Shibuya Crossing", duration: 30, category: "culture", icon: "🚦", location: "Shibuya" },
    { name: "Senso-ji Temple", duration: 90, category: "culture", icon: "⛩️", location: "Asakusa" },
    { name: "Sushi Making Class", duration: 120, category: "food", icon: "🍣", location: "Cooking Studio" },
    { name: "Akihabara Anime Tour", duration: 120, category: "tech", icon: "🎮", location: "Akihabara" },
    { name: "Cherry Blossom Viewing", duration: 60, category: "nature", icon: "🌸", location: "Ueno Park" }
  ],
  goa: [
    { name: "Butterfly Beach", duration: 120, category: "nature", icon: "🏖️", location: "Butterfly Beach" },
    { name: "Fort Aguada Visit", duration: 90, category: "culture", icon: "🏰", location: "Fort Aguada" },
    { name: "Goan Seafood Lunch", duration: 75, category: "food", icon: "🦐", location: "Beach Shack" },
    { name: "Dudhsagar Waterfall Trek", duration: 180, category: "outdoor", icon: "💦", location: "Dudhsagar Falls" },
    { name: "Night Market Shopping", duration: 90, category: "shopping", icon: "🛍️", location: "Arpora Night Market" }
  ],
  "new york": [
    { name: "Statue of Liberty Tour", duration: 120, category: "culture", icon: "🗽", location: "Liberty Island" },
    { name: "Central Park Walk", duration: 90, category: "nature", icon: "🌳", location: "Central Park" },
    { name: "Broadway Show", duration: 150, category: "culture", icon: "🎭", location: "Broadway" },
    { name: "Times Square Nightlife", duration: 60, category: "nightlife", icon: "🌃", location: "Times Square" },
    { name: "NYC Pizza Tasting", duration: 60, category: "food", icon: "🍕", location: "Pizzeria" }
  ],
  rome: [
    { name: "Colosseum Tour", duration: 120, category: "culture", icon: "🏟️", location: "Colosseum" },
    { name: "Vatican Museums", duration: 180, category: "culture", icon: "🖼️", location: "Vatican City" },
    { name: "Trevi Fountain Visit", duration: 30, category: "culture", icon: "⛲", location: "Trevi Fountain" },
    { name: "Gelato Tasting", duration: 45, category: "food", icon: "🍦", location: "Gelateria" },
    { name: "Piazza Navona Stroll", duration: 60, category: "culture", icon: "🏛️", location: "Piazza Navona" }
  ],
  london: [
    { name: "Buckingham Palace", duration: 90, category: "culture", icon: "🏰", location: "Buckingham Palace" },
    { name: "British Museum", duration: 150, category: "culture", icon: "🏺", location: "British Museum" },
    { name: "London Eye Ride", duration: 60, category: "outdoor", icon: "🎡", location: "London Eye" },
    { name: "West End Theatre", duration: 120, category: "culture", icon: "🎭", location: "West End" },
    { name: "Fish & Chips Lunch", duration: 60, category: "food", icon: "🍟", location: "Pub" }
  ]
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

// Helper for time of day slots
const timeOfDaySlots = [
  { key: 'morning', label: 'Morning', icon: '🌅' },
  { key: 'noon', label: 'Noon', icon: '🌞' },
  { key: 'evening', label: 'Evening', icon: '🌇' }
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
      shopping: "bg-red-100 text-red-800",
      nature: "bg-teal-100 text-teal-800",
      sports: "bg-yellow-100 text-yellow-800",
      tech: "bg-gray-100 text-gray-800"
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
const DayColumn = ({ day, activities, onActivityDrop, onDeleteActivity, onEditActivity, selectedActivityForMobile, setSelectedActivityForMobile }) => {
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

  // Group activities by time of day
  const groupedActivities = timeOfDaySlots.reduce((acc, slot) => {
    acc[slot.key] = activities.filter(a => (a.timeOfDay || 'morning') === slot.key);
    return acc;
  }, {});

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
          } ${
            selectedActivityForMobile && window.innerWidth < 1024 
              ? 'bg-blue-50 border-2 border-dashed border-blue-300 cursor-pointer' 
              : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            // Mobile: Add selected activity on day click
            if (selectedActivityForMobile && window.innerWidth < 1024) {
              onActivityDrop(day.id, selectedActivityForMobile);
              setSelectedActivityForMobile(null);
            }
          }}
        >
          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📅</div>
              <p className="hidden sm:block">Drag activities here to plan your day</p>
              <p className="sm:hidden">
                {selectedActivityForMobile 
                  ? "Tap here to add selected activity" 
                  : "Select an activity from the sidebar first"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {timeOfDaySlots.map(slot => (
                <div key={slot.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{slot.icon}</span>
                    <span className="font-semibold text-gray-700">{slot.label}</span>
                  </div>
                  {groupedActivities[slot.key].length === 0 ? (
                    <div className="text-gray-300 text-sm mb-2">No activities planned</div>
                  ) : (
                    <Reorder.Group values={groupedActivities[slot.key]} onReorder={() => {}}>
                      <div className="space-y-3">
                        {groupedActivities[slot.key].map((activity, index) => (
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
                </div>
              ))}
            </div>
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
const TemplateModal = ({ isOpen, onClose, onSelectTemplate, onCreateTemplate, allTemplates }) => {
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
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Choose Activity Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 mt-2 px-6">Quick start your itinerary with curated activity templates</p>
        <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(allTemplates).map(([key, template]) => (
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
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={onCreateTemplate}>➕ Create New Template</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Time of day selector component
function TimeOfDaySelector({ value, onChange }) {
  return (
    <div className="flex gap-2 mt-2">
      {timeOfDaySlots.map(slot => (
        <button
          key={slot.key}
          type="button"
          className={`px-3 py-1 rounded-full border ${value === slot.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} transition`}
          onClick={() => onChange(slot.key)}
        >
          {slot.icon} {slot.label}
        </button>
      ))}
    </div>
  );
}

// Activity Edit Modal
function ActivityEditModal({ activity, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(activity || {});
  useEffect(() => { setForm(activity || {}); }, [activity]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Edit Activity</h2>
        <div className="space-y-3">
          <input className="w-full border rounded p-2 text-black" placeholder="Name" value={form.name || ''} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          <input className="w-full border rounded p-2 text-black" placeholder="Duration (min)" type="number" value={form.duration || ''} onChange={e => setForm(f => ({...f, duration: Number(e.target.value)}))} />
          <input className="w-full border rounded p-2 text-black" placeholder="Category" value={form.category || ''} onChange={e => setForm(f => ({...f, category: e.target.value}))} />
          <input className="w-full border rounded p-2 text-black" placeholder="Icon (emoji)" value={form.icon || ''} onChange={e => setForm(f => ({...f, icon: e.target.value}))} />
          <input className="w-full border rounded p-2 text-black" placeholder="Location" value={form.location || ''} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
          <TimeOfDaySelector value={form.timeOfDay || 'morning'} onChange={v => setForm(f => ({...f, timeOfDay: v}))} />
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

// Add Activity Modal (for manual add with timeOfDay)
function AddActivityModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', duration: 60, category: '', icon: '', location: '', timeOfDay: 'morning' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Add Activity</h2>
        <div className="space-y-3">
          <input className="w-full border rounded p-2 text-black" placeholder="Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          <input className="w-full border rounded p-2 text-black" placeholder="Duration (min)" type="number" value={form.duration} onChange={e => setForm(f => ({...f, duration: Number(e.target.value)}))} />
          <input className="w-full border rounded p-2 text-black" placeholder="Category" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} />
          <input className="w-full border rounded p-2 text-black" placeholder="Icon (emoji)" value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))} />
          <input className="w-full border rounded p-2 text-black" placeholder="Location" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
          <TimeOfDaySelector value={form.timeOfDay} onChange={v => setForm(f => ({...f, timeOfDay: v}))} />
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { onAdd(form); onClose(); }}>Add</button>
        </div>
      </div>
    </div>
  );
}

// Helper to generate a simple text itinerary
function generateItineraryText(days, dayActivities) {
  return days.map(day => {
    const activities = dayActivities[day.id] || [];
    if (activities.length === 0) return `${day.name} (${day.date}): No activities planned.`;
    const grouped = { morning: [], noon: [], evening: [] };
    activities.forEach(a => grouped[a.timeOfDay || 'morning'].push(a));
    return `${day.name} (${day.date}):\n` +
      ['morning', 'noon', 'evening'].map(slot => {
        if (grouped[slot].length === 0) return `  ${slot[0].toUpperCase() + slot.slice(1)}: None`;
        return `  ${slot[0].toUpperCase() + slot.slice(1)}:` + grouped[slot].map(a => `\n    - ${a.icon} ${a.name} (${a.duration} min)`).join('');
      }).join('\n');
  }).join('\n\n');
}

// Helper to trigger download
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper to export to calendar (.ics)
function exportToCalendar(days, dayActivities) {
  let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
  days.forEach(day => {
    const activities = dayActivities[day.id] || [];
    activities.forEach(a => {
      ics += `BEGIN:VEVENT\nSUMMARY:${a.name}\nDESCRIPTION:${a.icon} ${a.name}\nDTSTART:20240101T090000Z\nDTEND:20240101T110000Z\nEND:VEVENT\n`;
    });
  });
  ics += 'END:VCALENDAR';
  downloadFile('itinerary.ics', ics);
}

// Helper to email itinerary
function emailItinerary(days, dayActivities) {
  const subject = encodeURIComponent('My Travel Itinerary');
  const body = encodeURIComponent(generateItineraryText(days, dayActivities));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Helper to share itinerary
function shareItinerary(days, dayActivities) {
  const text = generateItineraryText(days, dayActivities);
  if (navigator.share) {
    navigator.share({ title: 'My Itinerary', text });
  } else {
    navigator.clipboard.writeText(text);
    alert('Itinerary copied to clipboard!');
  }
}

// Template creation modal
function CreateTemplateModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [gradient, setGradient] = useState('from-blue-500 via-purple-600 to-indigo-700');
  const [activities, setActivities] = useState([]);
  const [activityForm, setActivityForm] = useState({ name: '', duration: 60, category: '', icon: '', location: '', timeOfDay: 'morning' });
  const gradients = [
    'from-blue-500 via-purple-600 to-indigo-700',
    'from-orange-500 via-red-600 to-pink-700',
    'from-green-500 via-emerald-600 to-teal-700',
    'from-pink-400 via-rose-500 to-purple-600',
    'from-yellow-400 via-orange-500 to-red-600',
    'from-purple-600 via-pink-700 to-red-800',
    'from-green-300 via-green-500 to-green-700',
    'from-pink-300 via-pink-500 to-pink-700',
    'from-indigo-300 via-indigo-500 to-indigo-700',
    'from-yellow-300 via-yellow-500 to-yellow-700',
    'from-gray-400 via-gray-600 to-gray-800',
  ];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Create New Template</h2>
        <input className="w-full border rounded p-2 text-black mb-2" placeholder="Template Name" value={name} onChange={e => setName(e.target.value)} />
        <div className="mb-2">
          <label className="block mb-1 font-medium text-black">Gradient</label>
          <select className="w-full border rounded p-2 text-black" value={gradient} onChange={e => setGradient(e.target.value)}>
            {gradients.map(g => <option key={g} value={g} className="text-black">{g}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-medium text-black">Add Activity</label>
          <div className="flex flex-col gap-2">
            <input className="border rounded p-2 text-black" placeholder="Name" value={activityForm.name} onChange={e => setActivityForm(f => ({...f, name: e.target.value}))} />
            <input className="border rounded p-2 text-black" placeholder="Duration (min)" type="number" value={activityForm.duration} onChange={e => setActivityForm(f => ({...f, duration: Number(e.target.value)}))} />
            <input className="border rounded p-2 text-black" placeholder="Category" value={activityForm.category} onChange={e => setActivityForm(f => ({...f, category: e.target.value}))} />
            <input className="border rounded p-2 text-black" placeholder="Icon (emoji)" value={activityForm.icon} onChange={e => setActivityForm(f => ({...f, icon: e.target.value}))} />
            <input className="border rounded p-2 text-black" placeholder="Location" value={activityForm.location} onChange={e => setActivityForm(f => ({...f, location: e.target.value}))} />
            <TimeOfDaySelector value={activityForm.timeOfDay} onChange={v => setActivityForm(f => ({...f, timeOfDay: v}))} />
            <button className="mt-2 px-3 py-1 rounded bg-blue-100 text-blue-800" onClick={() => { setActivities(a => [...a, activityForm]); setActivityForm({ name: '', duration: 60, category: '', icon: '', location: '', timeOfDay: 'morning' }); }}>Add Activity</button>
          </div>
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-medium text-black">Activities</label>
          <ul className="mb-2">
            {activities.map((a, i) => <li key={i} className="text-sm flex gap-2 items-center text-black">{a.icon} {a.name} <span className="text-xs text-gray-400">({a.timeOfDay})</span></li>)}
          </ul>
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { onSave({ key: `user_${Date.now()}`, name, gradient, activities }); onClose(); }}>Save Template</button>
        </div>
      </div>
    </div>
  );
}

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
  const [selectedActivityForMobile, setSelectedActivityForMobile] = useState(null);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [editActivity, setEditActivity] = useState(null);
  const [userTemplates, setUserTemplates] = useState([]);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showSmartSuggestionsModal, setShowSmartSuggestionsModal] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState([]);

  useEffect(() => {
    // Initialize with some sample activities
    const sampleActivities = [
      { id: Date.now() + 1, name: "Explore Old Town", duration: 120, category: "culture", icon: "🏛️", location: "City Center" },
      { id: Date.now() + 2, name: "Local Food Market", duration: 90, category: "food", icon: "🍕", location: "Market Square" },
      { id: Date.now() + 3, name: "Museum Visit", duration: 150, category: "culture", icon: "🎨", location: "Art District" }
    ];
    setAvailableActivities(sampleActivities);
  }, []);

  useEffect(() => {
    if (selectedDestination && selectedDestination.trim().length > 1) {
      // Check for real, destination-specific activities
      const key = selectedDestination.trim().toLowerCase();
      if (destinationActivities[key]) {
        const suggestions = destinationActivities[key].map(activity => ({
          ...activity,
          id: Date.now() + Math.random(),
        }));
        setSmartSuggestions(suggestions);
        setShowSmartSuggestionsModal(true);
      } else {
        // Fallback: Generate suggestions based on templates, tailored to destination
        const suggestions = Object.values(activityTemplates).flatMap(template =>
          template.activities.slice(0, 2).map(activity => ({
            ...activity,
            id: Date.now() + Math.random(),
            location: selectedDestination,
            templateName: template.name
          }))
        );
        setSmartSuggestions(suggestions);
        setShowSmartSuggestionsModal(true);
      }
    } else {
      setShowSmartSuggestionsModal(false);
      setSmartSuggestions([]);
    }
  }, [selectedDestination]);

  const handleAcceptAllSuggestions = () => {
    setAvailableActivities(prev => [...prev, ...smartSuggestions]);
    setShowSmartSuggestionsModal(false);
  };
  const handleAcceptSingleSuggestion = (suggestion) => {
    setAvailableActivities(prev => [...prev, suggestion]);
    setSmartSuggestions(smartSuggestions.filter(s => s.id !== suggestion.id));
    if (smartSuggestions.length <= 1) setShowSmartSuggestionsModal(false);
  };
  const handleDismissSuggestions = () => {
    setShowSmartSuggestionsModal(false);
  };

  const handleActivityDrop = (dayId, activity) => {
    const newActivity = { ...activity, id: Date.now() + Math.random(), timeOfDay: activity.timeOfDay || 'morning' };
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
    setEditActivity(activity);
  };

  const handleSaveEditActivity = (updated) => {
    setAvailableActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
    setEditActivity(null);
  };

  const handleSelectTemplate = (template) => {
    const templateActivities = template.activities.map(activity => ({
      ...activity,
      id: Date.now() + Math.random(),
      location: `${selectedDestination || 'Destination'}`,
      timeOfDay: activity.timeOfDay || 'morning' // default to morning
    }));
    setAvailableActivities(prev => [...prev, ...templateActivities]);
    setShowTemplateModal(false);
  };

  const addNewDay = () => {
    const dayNumber = days.length + 1;
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-purple-500 to-pink-600', 
      'from-pink-500 to-red-600',
      'from-red-500 to-orange-600',
      'from-orange-500 to-yellow-600',
      'from-yellow-500 to-green-600',
      'from-green-500 to-teal-600',
      'from-teal-500 to-blue-600'
    ];
    
    const newDay = {
      id: Date.now(),
      name: `Day ${dayNumber}`,
      date: `Day ${dayNumber}`,
      gradient: gradients[(dayNumber - 1) % gradients.length]
    };
    setDays(prev => [...prev, newDay]);
    setDayActivities(prev => ({ ...prev, [newDay.id]: [] }));
  };

  const generateSmartSuggestions = () => {
    // If destination is entered, just show the modal (it will auto-populate suggestions)
    // If not, show the modal with a message to enter a destination
    setShowSmartSuggestionsModal(true);
  };

  const handleAddActivity = (activity) => {
    setAvailableActivities(prev => [...prev, { ...activity, id: Date.now() + Math.random() }]);
  };

  const allTemplates = { ...activityTemplates, ...Object.fromEntries(userTemplates.map(t => [t.key, t])) };

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
            <span className="block sm:inline">Smart timing and route optimization included!</span>
            <span className="block text-sm text-blue-600 mt-2 sm:hidden">
              📱 On mobile: Tap activity → Tap day to add
            </span>
          </p>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6 relative">
            <input
              type="text"
              placeholder="Enter destination (e.g., Paris, Tokyo)..."
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full md:w-80 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-700"
            />
            {/* Smart Suggestions Modal Popup */}
            <AnimatePresence>
              {showSmartSuggestionsModal && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-2 w-full md:w-96 z-40"
                >
                  <div className="bg-white border border-blue-200 rounded-xl shadow-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-blue-700">Smart Suggestions{selectedDestination ? ` for ${selectedDestination}` : ''}</h3>
                      <button onClick={handleDismissSuggestions} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                    </div>
                    {selectedDestination && smartSuggestions.length > 0 ? (
                      <>
                        <ul className="divide-y divide-blue-100 max-h-64 overflow-y-auto mb-3">
                          {smartSuggestions.map((s, idx) => (
                            <li key={s.id} className="py-2 flex items-center gap-3">
                              <span className="text-2xl">{s.icon}</span>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800">{s.name}</div>
                                <div className="text-xs text-gray-500">{s.templateName || s.location} • {s.duration} min</div>
                              </div>
                              <button onClick={() => handleAcceptSingleSuggestion(s)} className="text-green-600 hover:underline text-sm">Add</button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2 justify-end">
                          <button onClick={handleAcceptAllSuggestions} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add All</button>
                          <button onClick={handleDismissSuggestions} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Dismiss</button>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 text-center py-6">
                        Please enter a destination to get smart suggestions!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                    onClick={() => {
                      // Mobile: Select activity on click
                      if (window.innerWidth < 1024) {
                        setSelectedActivityForMobile(
                          selectedActivityForMobile?.id === activity.id ? null : activity
                        );
                      }
                    }}
                    className={`cursor-grab active:cursor-grabbing select-none transition-all duration-200 ${
                      selectedActivityForMobile?.id === activity.id 
                        ? 'ring-2 ring-blue-500 ring-offset-2' 
                        : ''
                    }`}
                  >
                    <ActivityCard
                      activity={activity}
                      onEdit={handleEditActivity}
                      onDelete={(id) => setAvailableActivities(prev => prev.filter(a => a.id !== id))}
                    />
                    {selectedActivityForMobile?.id === activity.id && (
                      <div className="lg:hidden text-center mt-2 text-sm text-blue-600 font-medium">
                        👆 Now tap a day to add this activity
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {availableActivities.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">🎭</div>
                  <p className="text-sm">Add activity templates to get started!</p>
                </div>
              )}
              <button onClick={() => setShowAddActivityModal(true)} className="w-full mb-4 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors">➕ Add Activity</button>
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
                  selectedActivityForMobile={selectedActivityForMobile}
                  setSelectedActivityForMobile={setSelectedActivityForMobile}
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
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors" onClick={() => emailItinerary(days, dayActivities)}>
                  📧 Email Itinerary
                </button>
{/*                 <button className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors" onClick={() => exportToCalendar(days, dayActivities)}>
                  📱 Export to Calendar
                </button> */}
                <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-colors" onClick={() => downloadFile('itinerary.txt', generateItineraryText(days, dayActivities))}>
                  📄 Generate PDF
                </button>
                <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-lg transition-colors" onClick={() => shareItinerary(days, dayActivities)}>
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
            onCreateTemplate={() => setShowCreateTemplateModal(true)}
            allTemplates={allTemplates}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        <AddActivityModal isOpen={showAddActivityModal} onClose={() => setShowAddActivityModal(false)} onAdd={handleAddActivity} />
      </AnimatePresence>
      <AnimatePresence>
        <ActivityEditModal activity={editActivity} isOpen={!!editActivity} onClose={() => setEditActivity(null)} onSave={handleSaveEditActivity} />
      </AnimatePresence>
      <AnimatePresence>
        <CreateTemplateModal isOpen={showCreateTemplateModal} onClose={() => setShowCreateTemplateModal(false)} onSave={tpl => setUserTemplates(prev => [...prev, tpl])} />
      </AnimatePresence>
    </div>
  );
}
