import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black text-white text-center py-10 border-t border-gray-700">
      <p className="text-sm mb-2">
        &copy; {new Date().getFullYear()} PackPalGo — Built for explorers, dreamers, and wanderers.
      </p>
      <a
        href="https://www.instagram.com/packpalgo?igsh=bmxhZDcyZmtia3U0"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:underline"
      >
        Follow us on Instagram @packpalgo
      </a>
    </footer>
  );
}
