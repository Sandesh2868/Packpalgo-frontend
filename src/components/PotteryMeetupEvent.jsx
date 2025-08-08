import React, { useState } from "react";

export default function RSVPForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    instagram: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxvAcX3HTbFV4A4q1enSQvJvJfHUBW_fMmHe0raixJskyof6IIYxYdrK5Fu2ph72E4/exec";

      const res = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log("✅ Form submitted successfully:", data);

      alert("✅ RSVP submitted successfully!");
      setForm({ name: "", phone: "", email: "", instagram: "" });
    } catch (error) {
      console.error("❌ Submission failed:", error);
      alert(
        "❌ Error submitting RSVP. This is likely due to CORS or server issues."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="instagram"
        placeholder="Instagram Handle"
        value={form.instagram}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit RSVP"}
      </button>
    </form>
  );
}
