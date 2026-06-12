// WanderZ Mock Travel Data
// Realistic Indian destinations with ₹ pricing

export const DESTINATIONS = [
  {
    id: 'goa-beach',
    name: 'Goa Beach Escape',
    location: 'South Goa, India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 2847,
    pricePerPerson: 12500,
    duration: '3N/4D',
    dates: 'Aug 14 – Aug 17',
    flights: { from: ['Delhi', 'Mumbai'], type: 'Direct', airline: 'IndiGo', price: 4500, departureTime: '06:30 AM', arrivalTime: '09:15 AM' },
    hotel: { name: 'Taj Exotica Resort & Spa', type: 'Beachfront Villa', stars: 5, pricePerNight: 6000, amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'Gym'] },
    rooms: [
      { id: 'r1', name: 'Villa Master Suite', price: 18000, capacity: 2, image: '🏖️' },
      { id: 'r2', name: 'Deluxe Sea View', price: 14000, capacity: 2, image: '🌊' },
      { id: 'r3', name: 'Standard Room', price: 9000, capacity: 2, image: '🛏️' },
      { id: 'r4', name: 'Garden Cottage', price: 11000, capacity: 3, image: '🌴' },
    ],
    activities: ['Beach Hopping', 'Water Sports', 'Sunset Cruise', 'Old Goa Heritage Walk', 'Night Market'],
    tags: ['Beach', 'Nightlife', 'Seafood', 'Water Sports'],
    explain: {
      budget: "Fits the group's ₹12k/person limit",
      vibe: "Matches the 'Beach Villa' preference from the group chat",
      logistics: "Direct flights from both Delhi and Mumbai"
    }
  },
  {
    id: 'manali-adventure',
    name: 'Manali Mountain Retreat',
    location: 'Manali, Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 1923,
    pricePerPerson: 11000,
    duration: '4N/5D',
    dates: 'Aug 14 – Aug 18',
    flights: { from: ['Delhi'], type: 'Via Chandigarh + Bus', airline: 'SpiceJet', price: 3500, departureTime: '07:00 AM', arrivalTime: '08:30 AM + 6h bus' },
    hotel: { name: 'The Himalayan', type: 'Mountain Lodge', stars: 4, pricePerNight: 4500, amenities: ['Fireplace', 'Mountain View', 'Restaurant', 'Trekking Desk'] },
    rooms: [
      { id: 'r1', name: 'Mountain View Suite', price: 15000, capacity: 2, image: '🏔️' },
      { id: 'r2', name: 'Premium Room', price: 12000, capacity: 2, image: '⛷️' },
      { id: 'r3', name: 'Standard Twin', price: 8000, capacity: 2, image: '🛏️' },
      { id: 'r4', name: 'Backpacker Dorm', price: 4000, capacity: 4, image: '🎒' },
    ],
    activities: ['Rohtang Pass Visit', 'River Rafting', 'Solang Valley Paragliding', 'Old Manali Walk', 'Hadimba Temple'],
    tags: ['Mountains', 'Adventure', 'Trekking', 'Snow'],
    explain: {
      budget: "Under budget at ₹11k/person — saves ₹1k each",
      vibe: "Perfect for the adventure seekers in the group",
      compromise: "No direct flight — requires Chandigarh transfer"
    }
  },
  {
    id: 'kerala-backwaters',
    name: 'Kerala Backwater Bliss',
    location: 'Alleppey, Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 3156,
    pricePerPerson: 15500,
    duration: '3N/4D',
    dates: 'Aug 14 – Aug 17',
    flights: { from: ['Delhi', 'Mumbai', 'Bangalore'], type: 'Direct to Kochi', airline: 'Air India', price: 5500, departureTime: '08:00 AM', arrivalTime: '11:30 AM' },
    hotel: { name: 'Kumarakom Lake Resort', type: 'Houseboat + Lakeside Villa', stars: 5, pricePerNight: 8000, amenities: ['Houseboat', 'Ayurveda Spa', 'Infinity Pool', 'Kayaking', 'Bird Watching'] },
    rooms: [
      { id: 'r1', name: 'Heritage Pool Villa', price: 22000, capacity: 2, image: '🏡' },
      { id: 'r2', name: 'Premium Houseboat', price: 16000, capacity: 2, image: '⛵' },
      { id: 'r3', name: 'Meandering Pool Villa', price: 19000, capacity: 3, image: '🌿' },
      { id: 'r4', name: 'Lake View Room', price: 12000, capacity: 2, image: '💧' },
    ],
    activities: ['Houseboat Cruise', 'Ayurveda Massage', 'Backwater Kayaking', 'Spice Plantation Tour', 'Kathakali Show'],
    tags: ['Backwaters', 'Ayurveda', 'Houseboat', 'Nature'],
    explain: {
      compromise: "₹1,500 over budget — but only option with houseboat experience",
      vibe: "Unique backwater experience matches Priya's suggestion",
      logistics: "Direct flights from all 3 origin cities"
    }
  },
  {
    id: 'rajasthan-royal',
    name: 'Royal Rajasthan Heritage',
    location: 'Udaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop',
    rating: 4.5,
    reviews: 2234,
    pricePerPerson: 13000,
    duration: '3N/4D',
    dates: 'Aug 14 – Aug 17',
    flights: { from: ['Delhi', 'Mumbai'], type: 'Direct', airline: 'Vistara', price: 4800, departureTime: '09:00 AM', arrivalTime: '10:30 AM' },
    hotel: { name: 'Taj Lake Palace', type: 'Heritage Palace', stars: 5, pricePerNight: 7000, amenities: ['Lake View', 'Heritage Walk', 'Royal Dining', 'Boat Transfer', 'Cooking Class'] },
    rooms: [
      { id: 'r1', name: 'Royal Suite', price: 25000, capacity: 2, image: '👑' },
      { id: 'r2', name: 'Palace Room', price: 15000, capacity: 2, image: '🏰' },
      { id: 'r3', name: 'Heritage Standard', price: 10000, capacity: 2, image: '🛏️' },
      { id: 'r4', name: 'Lake View Room', price: 13000, capacity: 2, image: '🌅' },
    ],
    activities: ['City Palace Tour', 'Lake Pichola Boat Ride', 'Monsoon Palace Sunset', 'Haldi Ghati Visit', 'Street Food Walk'],
    tags: ['Heritage', 'Culture', 'Photography', 'Romantic'],
    explain: {
      budget: "Within budget at ₹13k/person",
      vibe: "Heritage experience for the culture lovers",
      logistics: "Direct flights, UNESCO city tour included"
    }
  },
  {
    id: 'andaman-island',
    name: 'Andaman Island Paradise',
    location: 'Havelock Island, Andaman',
    image: 'https://images.unsplash.com/photo-1589979481223-deb893043163?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 1567,
    pricePerPerson: 18000,
    duration: '4N/5D',
    dates: 'Aug 14 – Aug 18',
    flights: { from: ['Delhi', 'Chennai'], type: 'Via Port Blair', airline: 'IndiGo', price: 7000, departureTime: '05:30 AM', arrivalTime: '10:00 AM + ferry' },
    hotel: { name: 'Taj Exotica Resort', type: 'Island Resort', stars: 5, pricePerNight: 9000, amenities: ['Private Beach', 'Scuba Center', 'Snorkeling', 'Glass Bottom Boat', 'Spa'] },
    rooms: [
      { id: 'r1', name: 'Beach Villa', price: 28000, capacity: 2, image: '🏝️' },
      { id: 'r2', name: 'Coral Room', price: 18000, capacity: 2, image: '🐠' },
      { id: 'r3', name: 'Garden Room', price: 14000, capacity: 2, image: '🌺' },
    ],
    activities: ['Scuba Diving at Havelock', 'Radhanagar Beach Day', 'Neil Island Trip', 'Cellular Jail Sound & Light', 'Mangrove Kayaking'],
    tags: ['Island', 'Scuba Diving', 'Snorkeling', 'Pristine Beaches'],
    explain: {
      compromise: "₹3,000 over budget — but rated #1 island destination in India",
      vibe: "Ultimate beach + diving experience",
      logistics: "Requires connecting flight via Port Blair"
    }
  }
];

export const GROUP_MEMBERS = [
  { id: 'u1', name: 'Arjun Mehta', avatar: 'AM', color: '#7c3aed', role: 'organizer', city: 'Delhi', budget: 15000 },
  { id: 'u2', name: 'Priya Sharma', avatar: 'PS', color: '#06b6d4', role: 'member', city: 'Mumbai', budget: 12000 },
  { id: 'u3', name: 'Rahul Singh', avatar: 'RS', color: '#10b981', role: 'member', city: 'Delhi', budget: 15000 },
  { id: 'u4', name: 'Neha Gupta', avatar: 'NG', color: '#f59e0b', role: 'member', city: 'Bangalore', budget: 18000 },
  { id: 'u5', name: 'Vikram Patel', avatar: 'VP', color: '#ff6b6b', role: 'member', city: 'Mumbai', budget: 13000 },
  { id: 'u6', name: 'Ananya Das', avatar: 'AD', color: '#f43f5e', role: 'member', city: 'Delhi', budget: 14000 },
];

export const CURRENT_USER = GROUP_MEMBERS[0]; // Arjun is the logged-in user

export const CHAT_MESSAGES = [
  { id: 'm1', userId: 'u1', text: 'Hey everyone! 🎉 Let\'s plan our August long weekend trip!', time: '10:30 AM', type: 'text' },
  { id: 'm2', userId: 'u2', text: 'Yesss! I\'ve been dying to go to Goa 🏖️', time: '10:32 AM', type: 'text' },
  { id: 'm3', userId: 'u3', text: 'What about Manali? The weather would be perfect', time: '10:35 AM', type: 'text' },
  { id: 'm4', userId: 'u4', text: 'I saw this amazing resort in Kerala on Insta!', time: '10:38 AM', type: 'text' },
  { id: 'm5', userId: 'u4', text: 'https://www.kumarakomlakeresort.com', time: '10:38 AM', type: 'link', linkData: DESTINATIONS[2] },
  { id: 'm6', userId: 'system', text: 'Neha shared a hotel — Vote on it!', time: '10:38 AM', type: 'system' },
  { id: 'm7', userId: 'u5', text: 'Budget max ₹15k per person for me', time: '10:40 AM', type: 'text' },
  { id: 'm8', userId: 'u1', text: 'Let me fire up the AI planner with everyone\'s constraints 🤖', time: '10:42 AM', type: 'text' },
  { id: 'm9', userId: 'system', text: 'Arjun started the AI Trip Planner', time: '10:42 AM', type: 'system' },
  { id: 'm10', userId: 'u2', text: 'Beach vibes plsss 🌊🐚', time: '10:45 AM', type: 'text' },
  { id: 'm11', userId: 'u6', text: 'I\'m flexible with anything honestly', time: '10:47 AM', type: 'text' },
  { id: 'm12', userId: 'u3', text: 'Just make sure there are direct flights from Delhi 😅', time: '10:50 AM', type: 'text' },
];

export const VOTES = {
  'goa-beach': { up: ['u1', 'u2', 'u5'], down: [] },
  'manali-adventure': { up: ['u3'], down: ['u2'] },
  'kerala-backwaters': { up: ['u4', 'u2'], down: [] },
  'rajasthan-royal': { up: ['u1'], down: ['u5'] },
  'andaman-island': { up: ['u2', 'u4'], down: ['u5'] },
};

export const TRIP_EXPENSES = [
  { id: 'e1', description: 'Beach Shack Lunch', amount: 3200, paidBy: 'u1', time: 'Day 1, 1:30 PM', icon: '🍽️', splitBetween: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'] },
  { id: 'e2', description: 'Water Sports Package', amount: 4800, paidBy: 'u3', time: 'Day 1, 4:00 PM', icon: '🏄', splitBetween: ['u1', 'u3', 'u5'] },
  { id: 'e3', description: 'Sunset Cruise', amount: 6000, paidBy: 'u2', time: 'Day 2, 5:00 PM', icon: '🚢', splitBetween: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'] },
  { id: 'e4', description: 'Night Market Shopping', amount: 2400, paidBy: 'u4', time: 'Day 2, 9:00 PM', icon: '🛍️', splitBetween: ['u2', 'u4', 'u6'] },
  { id: 'e5', description: 'Cab to Palolem Beach', amount: 1800, paidBy: 'u1', time: 'Day 3, 10:00 AM', icon: '🚕', splitBetween: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'] },
];

export const LONG_WEEKENDS = [
  { date: 'Aug 15, 2025', holiday: 'Independence Day', days: 4, suggestion: 'Goa Beach Escape' },
  { date: 'Oct 2, 2025', holiday: 'Gandhi Jayanti', days: 3, suggestion: 'Rajasthan Heritage Tour' },
  { date: 'Nov 1-5, 2025', holiday: 'Diwali Week', days: 5, suggestion: 'Andaman Island Paradise' },
];

export const PAYMENT_METHODS = [
  { id: 'gpay', name: 'Google Pay', icon: '💳', color: '#4285F4' },
  { id: 'phonepe', name: 'PhonePe', icon: '📱', color: '#5F259F' },
  { id: 'paytm', name: 'Paytm', icon: '💰', color: '#00B9F1' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', color: '#1a1a3e' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', color: '#0F5132' },
];

export const REFUND_POLICY = {
  full: { days: 7, text: 'Full refund if cancelled 7+ days before trip' },
  partial: { days: 3, text: '50% refund if cancelled 3-7 days before trip' },
  none: { days: 0, text: 'No refund if cancelled less than 3 days before trip' },
};

export const INDIAN_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi',
  'Goa', 'Bhopal', 'Indore', 'Nagpur', 'Coimbatore', 'Guwahati',
];
