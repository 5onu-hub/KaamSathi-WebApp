export const CITIES_LIST = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow"
];

export const WORKER_CATEGORIES = [
  { 
    id: "plumbing", 
    name: "Plumbing", 
    description: "Pipe fitting, leakage repairs, tap replacements, and water tank installations.", 
    startPrice: "₹250/hr", 
    count: "9,800+ Workers", 
    rating: 4.9, 
    reviewsCount: "2,450", 
    icon: "Wrench", 
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600",
    tags: ["Popular", "Emergency Available", "Verified Workers", "Most Booked"]
  },
  { 
    id: "electrical", 
    name: "Electrical", 
    description: "Wiring, MCB setup, switchboard fixing, fan installation, and short-circuit repair.", 
    startPrice: "₹200/hr", 
    count: "12,400+ Workers", 
    rating: 4.9, 
    reviewsCount: "3,120", 
    icon: "Zap", 
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
    tags: ["Popular", "Emergency Available", "Verified Workers", "Most Booked"]
  },
  { 
    id: "carpentry", 
    name: "Carpentry", 
    description: "Custom furniture fitting, door lock repair, wooden polishing, and cabinet mounting.", 
    startPrice: "₹300/hr", 
    count: "7,500+ Workers", 
    rating: 4.8, 
    reviewsCount: "1,890", 
    icon: "Hammer", 
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600",
    tags: ["Popular", "Verified Workers"]
  },
  { 
    id: "painting", 
    name: "Painting", 
    description: "Interior & exterior wall painting, waterproof coating, texture art, and stencil designs.", 
    startPrice: "₹400/day", 
    count: "6,200+ Workers", 
    rating: 4.7, 
    reviewsCount: "1,540", 
    icon: "Paintbrush", 
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600",
    tags: ["Popular", "Most Booked"]
  },
  { 
    id: "masonry", 
    name: "Masonry (Rajmistri)", 
    description: "Brickwork, tile laying, marble flooring, plastering, and stone masonry.", 
    startPrice: "₹600/day", 
    count: "8,100+ Workers", 
    rating: 4.8, 
    reviewsCount: "1,980", 
    icon: "Home", 
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600",
    tags: ["Nearby", "Verified Workers"]
  },
  { 
    id: "cleaning", 
    name: "Deep Cleaning", 
    description: "Full home sanitization, kitchen degreasing, bathroom scrubbing, and sofa shampooing.", 
    startPrice: "₹500/service", 
    count: "11,300+ Workers", 
    rating: 4.9, 
    reviewsCount: "4,200", 
    icon: "Sparkles", 
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
    tags: ["Popular", "Most Booked"]
  },
  { 
    id: "construction", 
    name: "Construction", 
    description: "Civil structural work, site preparation, foundation laying, and concrete mixing.", 
    startPrice: "₹650/day", 
    count: "14,500+ Workers", 
    rating: 4.7, 
    reviewsCount: "2,100", 
    icon: "Building2", 
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600",
    tags: ["Nearby", "Verified Workers"]
  },
  { 
    id: "gardening", 
    name: "Gardening", 
    description: "Lawn trimming, plant potting, pruning, pest control for gardens, and landscaping.", 
    startPrice: "₹300/day", 
    count: "2,100+ Workers", 
    rating: 4.8, 
    reviewsCount: "740", 
    icon: "Trees", 
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600",
    tags: ["Nearby"]
  },
  { 
    id: "house-shifting", 
    name: "House Shifting", 
    description: "Packing furniture, loading/unloading trucks, safe transportation, and reassembly.", 
    startPrice: "₹800/shift", 
    count: "5,800+ Workers", 
    rating: 4.8, 
    reviewsCount: "1,650", 
    icon: "Truck", 
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    tags: ["Most Booked", "Emergency Available"]
  },
  { 
    id: "welding", 
    name: "Welding & Fabrication", 
    description: "Iron gate welding, window grill repair, shed fabrication, and metal joining.", 
    startPrice: "₹400/hr", 
    count: "3,300+ Workers", 
    rating: 4.7, 
    reviewsCount: "890", 
    icon: "Flame", 
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
    tags: ["Emergency Available", "Verified Workers"]
  },
  { 
    id: "ac-repair", 
    name: "AC Repair & Service", 
    description: "Split & window AC jet servicing, gas top-up, PCB repair, and new AC mounting.", 
    startPrice: "₹350/service", 
    count: "4,900+ Workers", 
    rating: 4.9, 
    reviewsCount: "2,840", 
    icon: "Wind", 
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
    tags: ["Popular", "Emergency Available", "Most Booked"]
  },
  { 
    id: "appliance-repair", 
    name: "Appliance Repair", 
    description: "Washing machine fixing, refrigerator cooling, RO water purifier service & microwave.", 
    startPrice: "₹300/service", 
    count: "6,800+ Workers", 
    rating: 4.8, 
    reviewsCount: "1,920", 
    icon: "Tv", 
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
    tags: ["Popular", "Emergency Available"]
  },
  { 
    id: "driver", 
    name: "Personal Driver", 
    description: "Experienced daily drivers, outstation travel, automatic/manual cars & luxury valet.", 
    startPrice: "₹400/day", 
    count: "5,400+ Workers", 
    rating: 4.9, 
    reviewsCount: "1,450", 
    icon: "Car", 
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600",
    tags: ["Popular", "Verified Workers"]
  },
  { 
    id: "house-helper", 
    name: "House Helper", 
    description: "Daily cooking assistant, utensil washing, dusting, laundry, and elder assistance.", 
    startPrice: "₹350/day", 
    count: "8,900+ Workers", 
    rating: 4.8, 
    reviewsCount: "2,110", 
    icon: "UserCheck", 
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
    tags: ["Most Booked", "Verified Workers"]
  },
  { 
    id: "general-labour", 
    name: "General Labour", 
    description: "Heavy lifting, warehouse loading, event setup, garden digging, and daily manual work.", 
    startPrice: "₹500/day", 
    count: "15,000+ Workers", 
    rating: 4.7, 
    reviewsCount: "3,800", 
    icon: "Users", 
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600",
    tags: ["Nearby", "Emergency Available"]
  }
];

export const MOCK_WORKERS = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    skill: "Expert Electrician",
    rating: 4.9,
    reviewsCount: 142,
    experience: "8 Years",
    hourlyRate: "₹250/hr",
    dailyRate: "₹1,500/day",
    city: "Delhi NCR",
    phone: "+91 98765 43210",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "w2",
    name: "Suresh Sharma",
    skill: "Master Plumber",
    rating: 4.8,
    reviewsCount: 98,
    experience: "10 Years",
    hourlyRate: "₹300/hr",
    dailyRate: "₹1,800/day",
    city: "Mumbai",
    phone: "+91 98765 43211",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    id: "w3",
    name: "Mohammad Aslam",
    skill: "Carpenter & Woodworker",
    rating: 4.9,
    reviewsCount: 115,
    experience: "12 Years",
    hourlyRate: "₹350/hr",
    dailyRate: "₹2,000/day",
    city: "Bangalore",
    phone: "+91 98765 43212",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  {
    id: "w4",
    name: "Vijay Singh",
    skill: "Painter & Waterproofer",
    rating: 4.7,
    reviewsCount: 84,
    experience: "7 Years",
    hourlyRate: "₹250/hr",
    dailyRate: "₹1,600/day",
    city: "Hyderabad",
    phone: "+91 98765 43213",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ananya Deshmukh",
    role: "Homeowner, Mumbai",
    content: "KaamSathi made hiring an electrician for my new home extremely easy. Ramesh arrived on time, was professional, and charged a very transparent rate.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: 2,
    name: "Rajesh Verma",
    role: "Electrician & Worker Partner",
    content: "As a daily wage worker, getting consistent jobs was difficult before KaamSathi. Now I receive direct bookings in my area and get paid instantly without middlemen.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    role: "Society Manager, Delhi",
    content: "We use KaamSathi regularly for society plumbing and electrical maintenance. The verified worker profiles and direct chat feature give us absolute peace of mind.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150"
  }
];

export const FAQS = [
  {
    question: "How does KaamSathi verify workers?",
    answer: "Every worker undergoes rigorous Aadhaar verification, police background check, and skill assessment before being listed on the platform with a verified badge."
  },
  {
    question: "Are the charges fixed or negotiable?",
    answer: "Workers list their standard hourly or daily rates upfront. You can view their rates before booking with absolute pricing transparency and zero hidden fees."
  },
  {
    question: "How do I pay the worker?",
    answer: "You can pay securely via UPI, credit/debit card, or directly in cash after the work is successfully completed to your satisfaction."
  },
  {
    question: "Can I cancel a booking if my plans change?",
    answer: "Yes, you can cancel any booking anytime before the worker arrives at your location with zero cancellation charges."
  },
  {
    question: "Is KaamSathi free for workers?",
    answer: "Yes! Registering and finding work on KaamSathi is 100% free for daily wage workers. We take 0% commission from workers' earnings."
  }
];
