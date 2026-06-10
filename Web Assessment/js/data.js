const TravelData = {
  destinations: [
    {
      id: "paris",
      name: "Paris",
      country: "France",
      continent: "Europe",
      type: "cultural",
      budgetRange: "high",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80",
      description: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy, and culture. Famous for its cafe culture and landmarks like the Eiffel Tower and Gothic Notre-Dame cathedral.",
      attractions: ["Eiffel Tower", "Louvre Museum", "Cathédrale Notre-Dame", "Arc de Triomphe", "Champs-Élysées"],
      costs: { accommodation: 150, food: 45, transport: 15, activities: 30 }
    },
    {
      id: "bali",
      name: "Bali",
      country: "Indonesia",
      continent: "Asia",
      type: "relaxation",
      budgetRange: "low",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
      description: "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. Home to religious sites like Uluwatu Temple and yoga retreats.",
      attractions: ["Uluwatu Temple", "Tegallalang Rice Terraces", "Sacred Monkey Forest", "Mount Batur", "Seminyak Beach"],
      costs: { accommodation: 35, food: 12, transport: 5, activities: 10 }
    },
    {
      id: "tokyo",
      name: "Tokyo",
      country: "Japan",
      continent: "Asia",
      type: "cultural",
      budgetRange: "high",
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9reW98ZW58MHx8MHx8fDA%3D",
      description: "Tokyo, Japan's bustling capital, mixes ultramodern skyscrapers and neon lights with historic temples. Famed for its food scene, from tiny noodle shops to Michelin-starred dining.",
      attractions: ["Senso-ji Temple", "Shibuya Crossing", "Tokyo Skytree", "Meiji Jingu Shrine", "Harajuku Street"],
      costs: { accommodation: 120, food: 40, transport: 12, activities: 25 }
    },
    {
      id: "queenstown",
      name: "Queenstown",
      country: "New Zealand",
      continent: "Oceania",
      type: "adventure",
      budgetRange: "high",
      image: "https://images.unsplash.com/photo-1600466403153-50193d187dde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVlZW5zdG93bnxlbnwwfHwwfHx8MA%3D%3D",
      description: "Queenstown sits on the shores of Lake Wakatipu set against the Southern Alps. Famed for adventure sports like bungee jumping, jet-boating, skiing, and hiking.",
      attractions: ["Milford Sound (Day Trip)", "Skyline Gondola", "Shotover Jet Boat", "Coronet Peak (Skiing)", "Lake Wakatipu"],
      costs: { accommodation: 140, food: 35, transport: 20, activities: 65 }
    },
    {
      id: "serengeti",
      name: "Serengeti National Park",
      country: "Tanzania",
      continent: "Africa",
      type: "nature",
      budgetRange: "high",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80",
      description: "Tanzania's Serengeti is world-famous for its annual Great Migration of over 1.5 million wildebeest and zebra, Nile crocodiles, and majestic safari game drives.",
      attractions: ["Wildebeest Great Migration", "Seronera Valley Game Drive", "Grumeti River Crocodile Crossing", "Hot Air Balloon Safari", "Ngorongoro Crater (Nearby)"],
      costs: { accommodation: 200, food: 50, transport: 60, activities: 90 }
    },
    {
      id: "cairo",
      name: "Cairo",
      country: "Egypt",
      continent: "Africa",
      type: "cultural",
      budgetRange: "low",
      image: "https://images.unsplash.com/photo-1626692880062-35c360fb6afc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2Fpcm98ZW58MHx8MHx8fDA%3D",
      description: "Cairo, Egypt's capital on the Nile, is famous for its antiquities, including the Egyptian Museum, the iconic Giza Pyramids, the Great Sphinx, and bustling bazaars.",
      attractions: ["Great Pyramids of Giza", "The Great Sphinx", "The Grand Egyptian Museum", "Khan el-Khalili Bazaar", "Al-Azhar Mosque"],
      costs: { accommodation: 30, food: 10, transport: 4, activities: 15 }
    },
    {
      id: "rio",
      name: "Rio de Janeiro",
      country: "Brazil",
      continent: "America",
      type: "relaxation",
      budgetRange: "medium",
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop&q=80",
      description: "Rio de Janeiro is a huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and for Sugarloaf Mountain, a granite peak with cable cars to its summit. The city is also known for its sprawling favelas (shantytowns) and its raucous Carnaval festival, featuring parade floats, flamboyant costumes and samba.",
      attractions: ["Christ the Redeemer", "Sugarloaf Mountain", "Copacabana Beach", "Ipanema Beach", "Selarón Steps (Escadaria Selarón)"],
      costs: {
        accommodation: 65,
        food: 20,
        transport: 8,
        activities: 20
      }
    },
    {
      id: "newyork",
      name: "New York City",
      country: "United States",
      continent: "America",
      type: "cultural",
      budgetRange: "high",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80",
      description: "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers. Its iconic sites include skyscrapers such as the Empire State Building and sprawling Central Park.",
      attractions: ["Statue of Liberty", "Central Park", "Times Square", "Empire State Building", "Metropolitan Museum of Art"],
      costs: {
        accommodation: 180,
        food: 55,
        transport: 10,
        activities: 35
      }
    },
    {
      id: "bangkok",
      name: "Bangkok",
      country: "Thailand",
      continent: "Asia",
      type: "cultural",
      budgetRange: "low",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80",
      description: "Bangkok, Thailand’s capital, is a large city known for ornate shrines and vibrant street life. The boat-filled Chao Phraya River feeds its network of canals, flowing past the Rattanakosin royal district, home to opulent Grand Palace and its sacred Wat Phra Kaew Temple. Nearby is Wat Pho Temple with an enormous Reclining Buddha.",
      attractions: ["The Grand Palace", "Wat Arun (Temple of Dawn)", "Wat Pho", "Chatuchak Weekend Market", "Chinatown Street Food"],
      costs: {
        accommodation: 30,
        food: 8,
        transport: 4,
        activities: 12
      }
    }
  ],
  quotes: [
    { text: "Travel is the only thing you buy that makes you richer.", author: "Anonymous" },
    { text: "To travel is to live.", author: "Hans Christian Andersen" },
    { text: "The world is a book and those who do not travel read only one page.", author: "Saint Augustine" },
    { text: "Jobs fill your pocket, but adventures fill your soul.", author: "Jaime Lyn Beatty" },
    { text: "Oh, the places you'll go.", author: "Dr. Seuss" },
    { text: "We travel not to escape life, but for life not to escape us.", author: "Anonymous" }
  ],
  faqs: [
    {
      question: "How do I save a destination to my wishlist?",
      answer: "Navigate to the Random Trip Generator page, select your travel style and budget, hit generate, and click the 'Save to Wishlist' button to lock in your destination locally."
    },
    {
      question: "Can I use TravelNest offline?",
      answer: "Yes! TravelNest is designed as a Progressive Web App (PWA). Once cached, you can explore loaded destinations, check your wishlist, and calculate trip budgets offline."
    },
    {
      question: "Where is my budget and support data stored?",
      answer: "All planned trip budgets, saved wishlists, email updates, and support entries are filed securely in your web browser's local HTML5 LocalStorage, protecting your privacy completely."
    },
    {
      question: "How does the Travel Mood synthesizer work?",
      answer: "We synthesize relaxing sound waves in real-time inside your browser using the HTML5 Web Audio API. It shapes raw frequencies directly in code without downloading heavy music files!"
    }
  ]
};

window.TravelData = TravelData;
