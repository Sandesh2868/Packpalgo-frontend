import React from "react";

const topPlaces = [
  // {
  //   name: "Taj Mahal, Agra",
  //   image: "/images/taj-mahal.jpg",
  //   fact: "Built by Shah Jahan as a symbol of love in 1632.",
  // },
  // {
  //   name: "Jaipur, Rajasthan",
  //   image: "/images/jaipur.jpg",
  //   fact: "The Pink City known for its majestic forts and palaces.",
  // },
  // {
  //   name: "Kerala Backwaters",
  //   image: "/images/kerala.jpg",
  //   fact: "A serene network of canals and lagoons in South India.",
  // },
  // {
  //   name: "Ladakh",
  //   image: "/images/ladakh.jpg",
  //   fact: "Famous for its cold desert landscape and Buddhist culture.",
  // },
  // {
  //   name: "Varanasi Ghats",
  //   image: "/images/varanasi.jpg",
  //   fact: "Spiritual heart of India with sacred riverside rituals.",
  // },
  // {
  //   name: "Goa Beaches",
  //   image: "/images/goa.jpg",
  //   fact: "Known for nightlife, Portuguese heritage, and golden beaches.",
  // },
  // {
  //   name: "Rann of Kutch",
  //   image: "/images/kutch.jpg",
  //   fact: "World’s largest salt desert, comes alive during Rann Utsav.",
  // },
  // {
  //   name: "Hampi",
  //   image: "/images/hampi.jpg",
  //   fact: "Ruins of the Vijayanagara Empire, a UNESCO site.",
  // },
  // {
  //   name: "Darjeeling",
  //   image: "/images/darjeeling.jpg",
  //   fact: "Tea gardens with scenic views of the Himalayas.",
  // },
  // {
  //   name: "Andaman Islands",
  //   image: "/images/andaman.jpg",
  //   fact: "Tropical beaches, coral reefs, and rich marine life.",
  // },
];

const hiddenGems = [
  {
    name: "Ziro Valley",
    location: "Arunachal Pradesh",
    tags: ["nature", "culture", "festival"],
    image: "/images/Ziro-Valley.webp",
    fact: "Apatani tribal culture and a peaceful valley with rolling rice fields.",
    mapLink: "https://www.google.com/maps?q=Ziro+Valley,+Arunachal+Pradesh"
  },
  {
    name: "Dzukou Valley",
    location: "Nagaland",
    tags: ["trekking", "flora", "remote"],
    image: "/images/Dzukou Valley.webp",
    fact: "Remote and lush green valley famous for Dzukou lilies and solitude.",
    mapLink: "https://www.google.com/maps?q=Dzukou+Valley,+Nagaland"
  },
  {
    name: "Tirthan Valley",
    location: "Himachal Pradesh",
    tags: ["rivers", "eco-tourism", "fishing"],
    image: "/images/tirthan.jpeg",
    fact: "Less touristy Himachali valley with riverside stays and trout fishing.",
    mapLink: "https://www.google.com/maps?q=Tirthan+Valley,+Himachal+Pradesh"
  },
  {
    name: "Kalap Village",
    location: "Uttarakhand",
    tags: ["remote", "village-life", "Himalayas"],
    image: "/images/Kalap Village.jpg",
    fact: "Remote Himalayan village with no roads, offering authentic local life.",
    mapLink: "https://www.google.com/maps?q=Kalap+Village,+Uttarkashi"
  },
  {
    name: "Majuli Island",
    location: "Assam",
    tags: ["island", "culture", "monasteries"],
    image: "/images/Majuli Island.jpg",
    fact: "World’s largest river island with neo-Vaishnavite monasteries and traditions.",
    mapLink: "https://www.google.com/maps?q=Majuli+Island,+Assam"
  },
  {
    name: "Butterfly Beach",
    location: "Goa",
    tags: ["beach", "hidden", "boating"],
    image: "/images/butterfly-beach.jpg",
    fact: "Hidden crescent beach only reachable by boat or trek.",
    mapLink: "https://www.google.com/maps?q=Butterfly+Beach,+Goa"
  },
  {
    name: "Kanatal",
    location: "Uttarakhand",
    tags: ["offbeat", "hills", "camping"],
    image: "/images/kanatal.jpg",
    fact: "Quiet hill village near Mussoorie with apple orchards and trails.",
    mapLink: "https://www.google.com/maps?q=Kanatal,+Uttarakhand"
  },
  {
    name: "Patan",
    location: "Gujarat",
    tags: ["heritage", "architecture", "stepwell"],
    image: "/images/patan.jpg",
    fact: "Home to the intricately carved Rani ki Vav stepwell.",
    mapLink: "https://www.google.com/maps?q=Patan,+Gujarat"
  },
  {
    name: "Sandakphu",
    location: "West Bengal",
    tags: ["trekking", "Himalayas", "viewpoints"],
    image: "/images/sandakphu.jpg",
    fact: "Trek to view 4 of the world’s 5 highest peaks including Everest.",
    mapLink: "https://www.google.com/maps?q=Sandakphu"
  },
  {
    name: "Gokarna",
    location: "Karnataka",
    tags: ["beach", "spiritual", "peaceful"],
    image: "/images/gokarna.jpg",
    fact: "Spiritual beach town with hidden coves and peaceful vibes.",
    mapLink: "https://www.google.com/maps?q=Gokarna"
  },
];


const mustTryFoods = [
  {
      name: "Masala Dosa",
    image: "/images/masala-dosa.jpg",
    fact: "Crispy fermented rice crepe stuffed with spiced potatoes.",
    location: "Bengaluru, Karnataka",
    tags: ["breakfast", "south indian", "crispy"],
    // mapLink: "https://goo.gl/maps/Qpftcu2tCBzGuAGg6"
  },
  {
    name: "Hyderabadi Biryani",
    image: "/images/hyderabadi-biryani.jpg",
    fact: "Aromatic rice dish layered with marinated meat and saffron.",
    location: "Hyderabad, Telangana",
    tags: ["biryani", "spicy", "rice"],
    // mapLink: "https://goo.gl/maps/6rwL1XYLo72eC7W86"
  },
  {
     name: "Sarson Da Saag with Makki Di Roti",
    image: "/images/sarson-saag.jpg",
    fact: "A hearty winter delicacy made from mustard greens and served with cornmeal flatbread and white butter.",
    location: "Amritsar, Punjab",
    tags: ["punjabi", "winter", "green"],
    // mapLink: "https://goo.gl/maps/AvToFDbZ4uRrfhDh9"
  },
  {
    name: "Rogan Josh",
    image: "/images/rogan-josh.jpg",
    fact: "A rich, aromatic lamb curry from Kashmir.",
    location: "Srinagar, Jammu & Kashmir",
    tags: ["kashmiri", "curry", "lamb"],
    // mapLink: "https://goo.gl/maps/8xzAf1sRM9wFEL9f9"
  },
  {
    name: "Sandesh",
    image: "/images/sandesh.jpg",
    fact: "A delicate Bengali sweet made from chhena and sugar.",
    location: "Kolkata, West Bengal",
    tags: ["sweet", "bengali", "dessert"],
    // mapLink: "https://goo.gl/maps/zRTP6xRPtbv1knv46"
  },
   {
    name: "Laal Maas",
    image: "/images/laal-maas.jpg",
    fact: "A fiery Rajasthani mutton curry cooked with red chillies and rustic spices — not for the faint-hearted.",
    location: "Jodhpur, Rajasthan",
    tags: ["spicy", "rajasthani", "mutton"],
    // mapLink: "https://goo.gl/maps/SRWsyYZ4UTEBaKRB9"
  },
  {
    name: "Appam with Stew",
    image: "/images/appam-stew.jpg",
    fact: "A soft rice pancake paired with aromatic coconut-based vegetable or chicken stew — Kerala’s breakfast gem.",
    location: "Alleppey, Kerala",
    tags: ["kerala", "coconut", "breakfast"],
    // mapLink: "https://goo.gl/maps/FotmMdcFVcDcAMrt5"
  }
];


const CardSection = ({ title, data }) => (
  <section className="mb-16">
    <h2 className="text-3xl font-semibold mb-6 text-center">{title}</h2>
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item, idx) => (
        <a
          key={idx}
          href={item.mapLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:scale-105 transform transition block"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-1">{item.name}</h3>
            {item.location && (
              <p className="text-sm text-cyan-300 mb-1">📍 {item.location}</p>
            )}
            <p className="text-sm text-gray-300">{item.fact}</p>
            {item.tags && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-700 px-2 py-1 rounded-full text-white"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </a>
      ))}
    </div> {/* ✅ This div was missing a closing tag */}
  </section>
);


export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 sm:p-10">
      <h1 className="text-4xl font-bold mb-10 text-center">Explore India</h1>
      {/* <CardSection title="🏆 Top 10 Places" data={topPlaces} /> */}
      <CardSection title="Hidden Gems" data={hiddenGems} />
      <CardSection title="Must-Try Foods" data={mustTryFoods} />
    </main>
  );
}
