// src/components/BudgetCalculator.jsx
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const categories = ["Travel", "Stay", "Food", "Misc"];
const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function BudgetCalculator() {
  const [destination, setDestination] = useState("");
  const [travelStyle, setTravelStyle] = useState("Mid-range");
  const [travelMode, setTravelMode] = useState("Train");
  const [people, setPeople] = useState(1);
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState({ Travel: 0, Stay: 0, Food: 0, Misc: 0 });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const data = categories.map((key) => ({ name: key, value: Number(budget[key]) }));

  const fetchAIResponse = async () => {
    setAiLoading(true);
    setAiError("");

    try {
      const res = await fetch("https://packpalgo-backend.onrender.com/api/estimate-budget", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, travelStyle, travelMode, people, days })
      });
      const result = await res.json();
      if (result.budget) {
        setBudget(result.budget);
      } else {
        setAiError("Could not fetch estimate. Try again.");
      }
    } catch (err) {
      setAiError("Server error. Try later.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setBudget({ ...budget, [key]: Number(value) });
  };

  const downloadPDF = async () => {
    const input = document.getElementById("budget-section");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("TripBudget.pdf");
  };

  const shareBudget = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Trip Budget",
        text: `Here's my budget for ${destination} trip! ✈️`,
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported in your browser.");
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-950 to-black text-white" id="budget-section">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">🧾 AI-Powered Budget Planner</h2>
        <p className="text-gray-300 mb-6">
          Enter your destination and preferences to get smart, category-wise budget estimates.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left mb-6">
          <div>
            <label className="block mb-1 text-sm">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Manali"
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">No. of People</label>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Days of Trip</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Travel Style</label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            >
              <option>Budget</option>
              <option>Mid-range</option>
              <option>Luxury</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm">Travel Mode</label>
            <select
              value={travelMode}
              onChange={(e) => setTravelMode(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            >
              <option>Flight</option>
              <option>Train</option>
              <option>Road</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchAIResponse}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded mb-6"
          disabled={aiLoading || !destination}
        >
          {aiLoading ? "Estimating..." : "💡 Get AI Budget Estimate"}
        </button>

        {aiError && <p className="text-red-400 mb-4">{aiError}</p>}

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            {categories.map((key, i) => (
              <div key={i} className="mb-4 text-left">
                <label className="block text-sm mb-1">{key} (₹)</label>
                <input
                  type="number"
                  value={budget[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                />
              </div>
            ))}
            <div className="flex gap-4 mt-6">
              <button
                onClick={downloadPDF}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
              >
                📥 Download PDF
              </button>
              <button
                onClick={shareBudget}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                📤 Share
              </button>
            </div>
          </div>

         
            <div className="relative z-20">
               <PieChart width={320} height={320}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            </div>
           
          
        </div>
      </div>
    </section>
  );
}
