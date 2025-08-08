// components/EventCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({
  image,
  title,
  date,
  time,
  location, // ✅ New prop
  description,
  link,
  external,
  comingSoon = false,
  onComingSoon
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (comingSoon) {
      if (typeof onComingSoon === "function") {
        onComingSoon();
      }
      return;
    }

    if (external) {
      window.open(link, "_blank");
    } else {
      navigate(link);
    }
  };

  return (
    <div
      className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* Event Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover"
      />

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-rose-500/70 via-pink-400/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

      {/* Event Text Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
        <h3 className="text-2xl font-bold drop-shadow-md">{title}</h3>
        <p className="text-sm drop-shadow-sm">
          {date} • {time} • {location} {/* ✅ Added location here */}
        </p>
        <p className="mt-2 text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
}
