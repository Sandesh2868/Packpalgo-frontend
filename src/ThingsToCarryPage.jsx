import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';

function encodeItems(items) {
  return encodeURIComponent(items.join(","));
}

function decodeItems(encoded) {
  return decodeURIComponent(encoded).split(",").filter(Boolean);
}

const templates = {
  trekking: {
    label: "Trekking",
    items: ["Trekking Shoes", "Water Bottle", "Map", "Rain Jacket", "Sunscreen"],
    bgClass: "from-green-900 via-green-800 to-green-900",
  },
  international: {
    label: "International Travel",
    items: ["Passport", "Visa", "Currency", "Travel Insurance", "Power Adapter"],
    bgClass: "from-blue-900 via-blue-800 to-blue-900",
  },
  beach: {
    label: "Beach Trip",
    items: ["Swimsuit", "Sunscreen", "Beach Towel", "Flip Flops", "Sunglasses"],
    bgClass: "from-yellow-100 via-blue-200 to-blue-300 text-black",
  },
};

export default function ThingsToCarryPage() {
  const location = useLocation();
  const checklistRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState("trekking");
  const [items, setItems] = useState(templates[selectedTemplate].items);
  const [input, setInput] = useState("");
  const [shareURL, setShareURL] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encoded = params.get("items");
    if (encoded) setItems(decodeItems(encoded));
  }, [location.search]);

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
    link.download = "things-to-carry.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const generateShareableLink = () => {
    const encoded = encodeItems(items);
    const url = `${window.location.origin}/things-to-carry?items=${encoded}`;
    setShareURL(url);
  };

  const handleTemplateChange = (e) => {
    const value = e.target.value;
    setSelectedTemplate(value);
    setItems(templates[value].items);
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br ${templates[selectedTemplate].bgClass} p-6 transition-all duration-300`}>
      <h1 className="text-3xl font-bold text-center mb-4">Things to Carry</h1>

      <div className="text-center mb-6">
        <select
          value={selectedTemplate}
          onChange={handleTemplateChange}
          className="bg-white text-black px-4 py-2 rounded-lg shadow"
        >
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>{template.label}</option>
          ))}
        </select>
      </div>

      <div
        ref={checklistRef}
        className="bg-white text-black max-w-xl mx-auto p-6 rounded-xl shadow-lg mb-6"
      >
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex justify-between items-center border-b py-2">
              <span>{item}</span>
              <button onClick={() => removeItem(i)} className="text-red-500 hover:underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-xl mx-auto flex gap-2 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add item..."
          className="flex-1 px-3 py-2 rounded-lg border text-black"
        />
        <button onClick={addItem} className="bg-blue-500 text-white px-4 rounded-lg">
          Add
        </button>
      </div>

      <div className="text-center space-y-4">
        <button
          onClick={downloadChecklist}
          className="bg-green-500 px-6 py-2 rounded-full hover:bg-green-600"
        >
          🖼️ Download Checklist as Image
        </button>

        <div>
          <button
            onClick={generateShareableLink}
            className="bg-purple-600 px-6 py-2 rounded-full hover:bg-purple-700 mt-4"
          >
            🔗 Generate Sharable Link
          </button>
        </div>

        {shareURL && (
          <div className="bg-white text-black px-4 py-2 mt-4 rounded-xl inline-block max-w-full overflow-x-auto">
            <p className="text-sm break-words">
              <strong>Share this:</strong><br />
              <a href={shareURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {shareURL}
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
