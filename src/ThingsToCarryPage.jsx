import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function encodeItems(items) {
  return encodeURIComponent(items.join(","));
}

function decodeItems(encoded) {
  return decodeURIComponent(encoded).split(",").filter(Boolean);
}

const templates = {
  // Adventure & Outdoor
  trekking: {
    label: "🥾 Mountain Trekking",
    category: "Adventure",
    items: ["Trekking Shoes", "Hiking Backpack", "Water Bottle", "Energy Bars", "Map & Compass", "Rain Jacket", "Sunscreen SPF 50", "First Aid Kit", "Headlamp", "Trekking Poles", "Warm Layers", "Emergency Whistle"],
    gradient: "from-emerald-600 via-green-700 to-teal-800",
    icon: "🏔️",
    difficulty: "Moderate"
  },
  beach: {
    label: "🏖️ Beach Paradise",
    category: "Leisure",
    items: ["Swimsuit", "Beach Towel", "Sunscreen SPF 30", "Flip Flops", "Sunglasses", "Beach Umbrella", "Waterproof Phone Case", "Beach Ball", "Snorkel Gear", "Cooler", "Beach Chair", "Aloe Vera"],
    gradient: "from-cyan-400 via-blue-500 to-blue-600",
    icon: "🌊",
    difficulty: "Easy"
  },
  camping: {
    label: "🏕️ Wilderness Camping",
    category: "Adventure",
    items: ["Tent", "Sleeping Bag", "Camping Stove", "Matches/Lighter", "Cooking Utensils", "Flashlight", "Insect Repellent", "Portable Chair", "Rope", "Multi-tool", "Water Purification Tablets", "Camping Pillow"],
    gradient: "from-orange-600 via-red-700 to-amber-800",
    icon: "🔥",
    difficulty: "Hard"
  },
  
  // International Travel
  international: {
    label: "✈️ International Adventure",
    category: "Travel",
    items: ["Passport", "Visa Documents", "Travel Insurance", "Currency/Cards", "Power Adapter", "Portable Charger", "Travel Pillow", "Language Translator App", "International SIM Card", "Copy of Documents", "Emergency Contacts", "Travel Locks"],
    gradient: "from-purple-600 via-indigo-700 to-blue-800",
    icon: "🌍",
    difficulty: "Moderate"
  },
  europe: {
    label: "🏰 European Tour",
    category: "Travel",
    items: ["Euro Currency", "Rail Pass", "Comfortable Walking Shoes", "Light Rain Jacket", "Portable WiFi", "Museum Tickets", "City Maps", "Universal Adapter", "Compact Umbrella", "Cross-body Bag", "Scarf", "Guidebook"],
    gradient: "from-rose-500 via-pink-600 to-purple-700",
    icon: "🗼",
    difficulty: "Easy"
  },
  asia: {
    label: "🏮 Asian Experience",
    category: "Travel",
    items: ["Visa Documents", "Anti-malaria Pills", "Mosquito Repellent", "Stomach Medicine", "Cash in Local Currency", "Chopsticks", "Wet Wipes", "Hand Sanitizer", "Modest Clothing", "Comfortable Sandals", "Probiotics", "Travel Adapter"],
    gradient: "from-red-600 via-orange-700 to-yellow-600",
    icon: "🏯",
    difficulty: "Moderate"
  },

  // Special Occasions
  wedding: {
    label: "💍 Wedding Guest",
    category: "Special",
    items: ["Formal Outfit", "Dress Shoes", "Gift", "Camera", "Tissues", "Breath Mints", "Phone Charger", "Blazer/Shawl", "Comfortable Flats", "Makeup Touch-up Kit", "Hair Accessories", "Plus One Details"],
    gradient: "from-pink-400 via-rose-500 to-red-600",
    icon: "💐",
    difficulty: "Easy"
  },
  business: {
    label: "💼 Business Trip",
    category: "Work",
    items: ["Laptop", "Chargers", "Business Cards", "Formal Clothes", "Presentation Files", "Notebook", "Pen", "Business Shoes", "Ironing Kit", "Professional Bag", "Watch", "Breath Freshener"],
    gradient: "from-gray-700 via-slate-800 to-zinc-900",
    icon: "📊",
    difficulty: "Easy"
  },

  // Seasonal
  winter: {
    label: "❄️ Winter Wonderland",
    category: "Seasonal",
    items: ["Heavy Winter Coat", "Thermal Underwear", "Wool Socks", "Winter Boots", "Gloves", "Scarf", "Winter Hat", "Hand Warmers", "Lip Balm", "Moisturizer", "Sunglasses", "Hot Thermos"],
    gradient: "from-blue-200 via-cyan-300 to-blue-400",
    icon: "⛄",
    difficulty: "Moderate",
    textDark: true
  },
  monsoon: {
    label: "🌧️ Monsoon Travel",
    category: "Seasonal",
    items: ["Waterproof Jacket", "Rain Boots", "Umbrella", "Quick-dry Clothes", "Waterproof Bag", "Extra Socks", "Plastic Bags", "Raincover for Backpack", "Waterproof Phone Case", "Towel", "Change of Clothes", "Antifungal Powder"],
    gradient: "from-slate-600 via-gray-700 to-blue-800",
    icon: "☔",
    difficulty: "Moderate"
  },

  // Adventure Sports
  skiing: {
    label: "🎿 Ski Adventure",
    category: "Sports",
    items: ["Ski Equipment", "Ski Boots", "Ski Goggles", "Thermal Layers", "Ski Gloves", "Helmet", "Ski Pass", "Sunscreen", "Lip Balm", "Après-ski Clothes", "Hot Chocolate Mix", "First Aid"],
    gradient: "from-white via-blue-100 to-blue-300",
    icon: "🏔️",
    difficulty: "Hard",
    textDark: true
  },
  diving: {
    label: "🤿 Scuba Diving",
    category: "Sports",
    items: ["Diving Certification", "Diving Suit", "Mask & Snorkel", "Fins", "Diving Computer", "Underwater Camera", "Reef-safe Sunscreen", "Diving Logbook", "Quick-dry Towel", "Water Shoes", "Seasickness Pills", "Dive Light"],
    gradient: "from-teal-500 via-cyan-600 to-blue-700",
    icon: "🐠",
    difficulty: "Hard"
  },

  // Family & Kids
  family: {
    label: "👨‍👩‍👧‍👦 Family Vacation",
    category: "Family",
    items: ["Kids' Clothes", "Toys & Games", "Snacks", "Baby Wipes", "First Aid Kit", "Entertainment (Tablets)", "Stroller", "Baby Formula", "Diapers", "Pacifiers", "Kids' Medicine", "Emergency Contacts"],
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    icon: "🎈",
    difficulty: "Hard"
  },
  roadtrip: {
    label: "🚗 Epic Road Trip",
    category: "Adventure",
    items: ["Car Documents", "GPS/Maps", "Car Charger", "Snacks", "Water Bottles", "Playlist", "Emergency Kit", "Spare Tire Tools", "Blanket", "Pillow", "Games", "Camera"],
    gradient: "from-amber-500 via-orange-600 to-red-700",
    icon: "🛣️",
    difficulty: "Moderate"
  },

  // Wellness & Retreat
  spa: {
    label: "🧘‍♀️ Spa Retreat",
    category: "Wellness",
    items: ["Comfortable Robes", "Flip Flops", "Hair Ties", "Face Mask", "Yoga Mat", "Meditation App", "Herbal Tea", "Journal", "Comfortable Clothes", "Essential Oils", "Water Bottle", "Healthy Snacks"],
    gradient: "from-green-300 via-emerald-400 to-teal-500",
    icon: "🌿",
    difficulty: "Easy",
    textDark: true
  },
  festival: {
    label: "🎵 Music Festival",
    category: "Events",
    items: ["Festival Tickets", "Portable Charger", "Cash", "Earplugs", "Comfortable Shoes", "Bandana", "Sunscreen", "Water Bottle", "Fanny Pack", "Wet Wipes", "Flag/Totem", "Festival Schedule"],
    gradient: "from-purple-500 via-pink-600 to-red-600",
    icon: "🎤",
    difficulty: "Moderate"
  }
};

// Pinterest-style Template Card Component
const TemplateCard = ({ templateKey, template, onSelect, delay = 0 }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="break-inside-avoid mb-6"
    >
      <div
        className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${template.gradient} ${template.textDark ? 'text-gray-800' : 'text-white'} group`}
        onClick={() => onSelect(templateKey)}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">{template.icon}</div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-2">{template.label}</h3>
          
          {/* Category */}
          <p className={`text-sm mb-4 ${template.textDark ? 'text-gray-600' : 'text-white/80'}`}>
            {template.category}
          </p>

          {/* Items Preview */}
          <div className="space-y-2 mb-4">
            {template.items.slice(0, 4).map((item, index) => (
              <div key={index} className={`flex items-center text-sm ${template.textDark ? 'text-gray-700' : 'text-white/90'}`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${template.textDark ? 'bg-gray-400' : 'bg-white/60'}`}></div>
                {item}
              </div>
            ))}
            {template.items.length > 4 && (
              <div className={`text-sm ${template.textDark ? 'text-gray-600' : 'text-white/70'} italic`}>
                +{template.items.length - 4} more items
              </div>
            )}
          </div>

          {/* Total items count */}
          <div className={`text-sm font-semibold ${template.textDark ? 'text-gray-700' : 'text-white/90'}`}>
            📋 {template.items.length} items total
          </div>
        </div>

        {/* Click to customize button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Click to customize →
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Checklist Modal Component
const ChecklistModal = ({ selectedTemplate, items, setItems, input, setInput, onClose, checklistRef }) => {
  const template = templates[selectedTemplate];
  
  const addItem = () => {
    if (input.trim()) {
      setItems([...items, input.trim()]);
      setInput("");
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const downloadChecklist = async () => {
    const canvas = await html2canvas(checklistRef.current);
    const link = document.createElement("a");
    link.download = `${template.label.replace(/[^\w\s]/gi, '')}-checklist.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const generateShareableLink = () => {
    const encoded = encodeItems(items);
    const url = `${window.location.origin}/things-to-carry?items=${encoded}`;
    navigator.clipboard.writeText(url);
    alert('Shareable link copied to clipboard!');
  };

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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${template.gradient} p-6 text-white rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">{template.icon}</span>
                {template.label}
              </h2>
              <p className="text-white/80 mt-1">{template.category} • {items.length} items</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Checklist Content */}
        <div ref={checklistRef} className="p-6">
          <div className="grid gap-3 mb-6">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-800">{item}</span>
                </div>
                <button
                  onClick={() => removeItem(i)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all text-sm px-2 py-1"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>

          {/* Add Item */}
          <div className="flex gap-2 mb-6">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder="Add custom item..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={addItem}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadChecklist}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              � Download PDF
            </button>
            <button
              onClick={generateShareableLink}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              🔗 Copy Link
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ThingsToCarryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const checklistRef = useRef(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(Object.values(templates).map(t => t.category))];

  const filteredTemplates = Object.entries(templates).filter(([key, template]) => {
    const matchesSearch = template.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encoded = params.get("items");
    if (encoded) {
      setItems(decodeItems(encoded));
      setSelectedTemplate("custom");
    }
  }, [location.search]);

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setItems([...templates[templateKey].items]);
  };

  const closeModal = () => {
    setSelectedTemplate(null);
    setItems([]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
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
              <span className="text-4xl">🎒</span>
              Pack List Templates
            </h1>
            <div className="w-24"></div>
          </div>

          <p className="text-gray-600 text-center text-lg mb-8 max-w-2xl mx-auto">
            Choose from our curated collection of packing templates, or create your own custom list.
            Never forget anything important again!
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {filteredTemplates.map(([key, template], index) => (
            <TemplateCard
              key={key}
              templateKey={key}
              template={template}
              onSelect={handleTemplateSelect}
              delay={index * 0.1}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Checklist Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <ChecklistModal
            selectedTemplate={selectedTemplate}
            items={items}
            setItems={setItems}
            input={input}
            setInput={setInput}
            onClose={closeModal}
            checklistRef={checklistRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
