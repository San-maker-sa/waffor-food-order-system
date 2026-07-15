import React, { useState, useEffect } from 'react';
import './App.css';
import logoImg from './assets/logo.png';

const MENU_ITEMS = [
  // ==================== BREAKFAST (10 items) ====================
  { id: 'idly-1', name: 'Soft Steamed Idly', price: 60.00, description: 'Fluffy steamed rice cakes served with hot sambar and fresh coconut chutney.', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: true, rating: 4.8, prepTime: '8-10 mins' },
  { id: 'dosa-1', name: 'Crispy Paper Dosa', price: 80.00, description: 'Thin golden crepe made from fermented rice-lentil batter served with spicy chutneys.', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: true, rating: 4.9, prepTime: '10-12 mins' },
  { id: 'vada-1', name: 'Crispy Medu Vada', price: 50.00, description: 'Deep-fried savory lentil donuts with a crunchy crust and fluffy interior.', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: true, rating: 4.7, prepTime: '10 mins' },
  { id: 'poori-1', name: 'Hot Poori Masala', price: 90.00, description: 'Golden puffed wheat breads served with spiced potato masala curry.', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: true, rating: 4.8, prepTime: '12-15 mins' },
  { id: 'pongal-1', name: 'Ghee Venn Pongal', price: 85.00, description: 'Warm comforting rice and lentil porridge seasoned with black pepper, cumin, and ghee.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: true, rating: 4.7, prepTime: '8 mins' },
  { id: 'brk-nv-1', name: 'Egg Podimas Dosa', price: 110.00, description: 'Crispy rice crepe cooked with scrambled eggs, onions, green chilies, and black pepper.', image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: false, rating: 4.8, prepTime: '12 mins' },
  { id: 'brk-nv-2', name: 'Chicken Kheema Parotta', price: 160.00, description: 'Layered Malabar parotta stuffed with spiced minced chicken and aromatic herbs.', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: false, rating: 4.9, prepTime: '15 mins' },
  { id: 'brk-nv-3', name: 'Chicken Sausage & Eggs Plate', price: 180.00, description: 'Grilled chicken sausages, sunny-side up eggs, and butter-toasted bread slices.', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: false, rating: 4.6, prepTime: '15 mins' },
  { id: 'brk-v-1', name: 'Rava Masala Dosa', price: 95.00, description: 'Semolina crepe filled with spiced potato mash, cashews, and curry leaves.', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: true, rating: 4.7, prepTime: '12 mins' },
  { id: 'brk-nv-4', name: 'Malabar Chicken Stew with Appam', price: 175.00, description: 'Soft, lacy fermented rice pancakes served with coconut-based mild chicken stew.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80', category: 'breakfast', isVeg: false, rating: 4.9, prepTime: '18 mins' },

  // ==================== MAINS (10 items) ====================
  { id: 'burger-1', name: 'Premium Cheese Burger', price: 149.00, description: 'Flame-grilled angus beef, cheddar, signature sauce, toasted brioche.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: false, rating: 4.7, prepTime: '15-20 mins' },
  { id: 'pizza-1', name: 'Classic Pepperoni Pizza', price: 399.00, description: 'San Marzano sauce, fresh mozzarella, double pepperoni, hot honey drizzle.', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: false, rating: 4.9, prepTime: '20-25 mins' },
  { id: 'pasta-1', name: 'Truffle Mushroom Pasta', price: 349.00, description: 'Creamy porcini truffle sauce, wild mushrooms, parmesan, fresh fettuccine.', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: true, rating: 4.8, prepTime: '15 mins' },
  { id: 'fries-1', name: 'Crispy Garlic Fries', price: 99.00, description: 'Double-fried hand-cut potatoes, garlic herb butter, sea salt.', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: true, rating: 4.5, prepTime: '10 mins' },
  { id: 'main-nv-1', name: 'Hyderabadi Chicken Biryani', price: 280.00, description: 'Fragrant basmati rice layered with juicy spiced chicken, saffron, and fresh mint.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: false, rating: 4.9, prepTime: '25 mins' },
  { id: 'main-nv-2', name: 'Butter Chicken Masala', price: 260.00, description: 'Tandoori chicken chunks cooked in a rich, velvety tomato, butter, and cashew gravy.', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: false, rating: 4.8, prepTime: '20 mins' },
  { id: 'main-nv-3', name: 'Chettinad Pepper Chicken', price: 230.00, description: 'Fiery chicken stir-fry tossed with fresh crushed black pepper and regional Chettinad spices.', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: false, rating: 4.8, prepTime: '18 mins' },
  { id: 'main-nv-4', name: 'Crispy Fish & Chips', price: 290.00, description: 'Golden batter-fried cod fish fillets served with lemon wedges and house tartar sauce.', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: false, rating: 4.7, prepTime: '15 mins' },
  { id: 'main-v-1', name: 'Paneer Butter Masala', price: 220.00, description: 'Cottage cheese cubes simmered in a mildly sweet, creamy tomato-based butter gravy.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: true, rating: 4.8, prepTime: '15 mins' },
  { id: 'main-nv-5', name: 'Tandoori Chicken (Half)', price: 240.00, description: 'Yogurt and spice marinated bone-in chicken roasted to perfection in a clay oven.', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80', category: 'mains', isVeg: false, rating: 4.9, prepTime: '22 mins' },

  // ==================== DRINKS (10 items) ====================
  { id: 'drink-1', name: 'Fresh Mint Limeade', price: 79.00, description: 'Muddled fresh mint, lime juice, sparkling water, organic cane sugar.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.6, prepTime: '5 mins' },
  { id: 'drink-v-1', name: 'Classic Mango Lassi', price: 89.00, description: 'Creamy yogurt drink blended with fresh sweet Alphonso mangoes and cardamoms.', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.8, prepTime: '6 mins' },
  { id: 'drink-v-2', name: 'Virgin Mint Mojito', price: 99.00, description: 'Muddled lime chunks, mint leaves, and white sugar topped with ice-cold carbonated soda.', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.7, prepTime: '5 mins' },
  { id: 'drink-v-3', name: 'Cold Coffee with Ice Cream', price: 120.00, description: 'Strong espresso blended with milk and sugar, topped with a rich scoop of vanilla ice cream.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.8, prepTime: '7 mins' },
  { id: 'drink-v-4', name: 'Aromatic Masala Chai', price: 40.00, description: 'Traditional Indian tea brewed with black tea leaves, milk, ginger, cardamoms, and cloves.', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.9, prepTime: '8 mins' },
  { id: 'drink-v-5', name: 'South Indian Filter Coffee', price: 50.00, description: 'Strong decoction coffee brewed with hot frothy milk in traditional brass tumbler.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.8, prepTime: '5 mins' },
  { id: 'drink-v-6', name: 'Fresh Watermelon Juice', price: 80.00, description: 'Freshly extracted sweet watermelon juice with a splash of lime and mint.', image: 'https://images.unsplash.com/photo-1589733901241-5e53429e145e?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.7, prepTime: '5 mins' },
  { id: 'drink-v-7', name: 'Strawberry Cream Milkshake', price: 110.00, description: 'Thick creamy milkshake blended with fresh strawberries and vanilla ice cream.', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.7, prepTime: '6 mins' },
  { id: 'drink-v-8', name: 'Iced Peach Tea', price: 90.00, description: 'Chilled brewed black tea flavored with sweet peach extract and served with mint.', image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.6, prepTime: '5 mins' },
  { id: 'drink-v-9', name: 'Oreo Fudge Milkshake', price: 130.00, description: 'Thick shake blended with Oreo cookies, milk, and chocolate syrup, topped with cream.', image: 'https://images.unsplash.com/photo-1553787499-6f9133860275?w=500&auto=format&fit=crop&q=80', category: 'drinks', isVeg: true, rating: 4.8, prepTime: '7 mins' },

  // ==================== DESSERTS (10 items) ====================
  { id: 'icecream-1', name: 'Royal Ice Cream Scoop', price: 110.00, description: 'Rich, creamy ice cream scoops topped with fresh berries.', image: 'https://images.unsplash.com/photo-1501443715934-627181246b86?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.6, prepTime: '5 mins' },
  { id: 'sweet-1', name: 'Assorted Sweet Delights', price: 120.00, description: 'Premium selection of sweet items including hot gulab jamun and badam halwa.', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.8, prepTime: '5 mins' },
  { id: 'dessert-v-1', name: 'Hot Gulab Jamun with Ice Cream', price: 95.00, description: 'Soft golden milk balls soaked in cardamom syrup, served with vanilla ice cream.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.9, prepTime: '6 mins' },
  { id: 'dessert-v-2', name: 'Fudgy Chocolate Brownie', price: 130.00, description: 'Warm fudge brownie loaded with chocolate chunks and served with chocolate sauce.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.8, prepTime: '5 mins' },
  { id: 'dessert-v-3', name: 'Classic Italian Tiramisu', price: 180.00, description: 'Espresso-soaked ladyfingers layered with rich cocoa and mascarpone cheese.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.9, prepTime: '5 mins' },
  { id: 'dessert-v-4', name: 'Saffron Rasmalai (2 Pcs)', price: 80.00, description: 'Soft cottage cheese patties soaked in saffron-infused thickened sweet milk.', image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.8, prepTime: '5 mins' },
  { id: 'dessert-v-5', name: 'Warm Apple Pie', price: 140.00, description: 'Flaky baked crust stuffed with spiced cinnamon apples, served with cream.', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.7, prepTime: '8 mins' },
  { id: 'dessert-v-6', name: 'New York Blueberry Cheesecake', price: 190.00, description: 'Rich cream cheese cake on a graham cracker crust with sweet blueberry compote.', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.9, prepTime: '5 mins' },
  { id: 'dessert-v-7', name: 'Red Velvet Pastry Slice', price: 110.00, description: 'Fluffy layers of cocoa red velvet cake frosted with tangy cream cheese icing.', image: 'https://images.unsplash.com/photo-1587314200619-a968b75cc699?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.7, prepTime: '5 mins' },
  { id: 'dessert-v-8', name: 'Royal Kesar Pista Kulfi', price: 70.00, description: 'Dense and creamy traditional Indian frozen dessert rich in saffron and pistachios.', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80', category: 'desserts', isVeg: true, rating: 4.8, prepTime: '5 mins' }
];

const NEARBY_RESTAURANTS = [
  {
    id: 'rest-breakfast',
    name: 'Waffor Breakfast Hub',
    category: 'breakfast',
    specialty: 'Soft Steamed Idly, Crispy Paper Dosa, Ghee Pongal',
    distance: '1.2 km',
    rating: 4.8,
    prepTime: '10-12 mins',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'rest-mains',
    name: 'Fast Food Galaxy',
    category: 'mains',
    specialty: 'Cheese Burger, Pepperoni Pizza, Garlic Fries',
    distance: '2.5 km',
    rating: 4.7,
    prepTime: '15-20 mins',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'rest-drinks',
    name: 'Lassi & Mojito Junction',
    category: 'drinks',
    specialty: 'Mango Lassi, Virgin Mint Mojito, Cold Coffee',
    distance: '0.8 km',
    rating: 4.9,
    prepTime: '5-8 mins',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'rest-desserts',
    name: 'Royal Sweet Delights',
    category: 'desserts',
    specialty: 'Gulab Jamun, Chocolate Brownie, Saffron Rasmalai',
    distance: '1.5 km',
    rating: 4.8,
    prepTime: '8-10 mins',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80'
  }
];

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  if (hostname.endsWith('.gitpod.io')) {
    return `${protocol}//${hostname.replace('5173-', '8081-')}`;
  }
  if (hostname.endsWith('.github.dev') || hostname.endsWith('.app.github.dev')) {
    return `${protocol}//${hostname.replace('-5173', '-8081')}`;
  }
  return 'http://localhost:8081';
};

const API_BASE_URL = getApiBaseUrl();

export default function App() {
  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState('CUSTOMER');

  // App global state
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      return localStorage.getItem(`address_${u?.id || 'guest'}`) || '';
    } catch (e) {
      return '';
    }
  });
  const [phone, setPhone] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      return localStorage.getItem(`phone_${u?.id || 'guest'}`) || '';
    } catch (e) {
      return '';
    }
  });
  const [profileAddress, setProfileAddress] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      return localStorage.getItem(`address_${u?.id || 'guest'}`) || '';
    } catch (e) {
      return '';
    }
  });
  const [profilePhone, setProfilePhone] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      return localStorage.getItem(`phone_${u?.id || 'guest'}`) || '';
    } catch (e) {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vegFilter, setVegFilter] = useState('all'); // 'all', 'veg', 'nonveg'
  const [notification, setNotification] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);

  // Dynamic filter for food items
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDiet = vegFilter === 'all' || (vegFilter === 'veg' ? item.isVeg : !item.isVeg);
    return matchesSearch && matchesCategory && matchesDiet;
  });

  // Dynamic filter for nearby restaurants
  const filteredRestaurants = NEARBY_RESTAURANTS.filter((rest) => {
    // If a category is selected, only show the restaurant for that category
    if (selectedCategory !== 'all' && rest.category !== selectedCategory) {
      return false;
    }
    
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const matchesName = rest.name.toLowerCase().includes(query);
    const matchesSpecialty = rest.specialty.toLowerCase().includes(query);
    const matchesCategoryName = rest.category.toLowerCase().includes(query);
    
    const matchesItems = MENU_ITEMS.some((item) => 
      item.category === rest.category && 
      (item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query))
    );
    
    return matchesName || matchesSpecialty || matchesCategoryName || matchesItems;
  });

  // Payment Modal state
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // Payment Gateway Simulation state
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null); // { orderId, amount, method, transactionId }

  // Cancel confirmation state
  const [cancelConfirmOrder, setCancelConfirmOrder] = useState(null); // orderId to confirm cancel

  // Receipt modal state
  const [receiptOrder, setReceiptOrder] = useState(null); // order object to show receipt

  // OTP Verification state
  const [otpStep, setOtpStep] = useState(false);
  const [correctOtp, setCorrectOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);

  // Validations
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phoneNumber) => {
    // Clean spaces, dashes, parentheses
    let cleaned = phoneNumber.trim().replace(/[-\s()]/g, '');
    // Strip common country code prefixes to extract core 10 digits
    if (cleaned.startsWith('+91')) cleaned = cleaned.substring(3);
    else if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.substring(2);
    else if (cleaned.startsWith('0') && cleaned.length === 11) cleaned = cleaned.substring(1);
    
    // Validate if it is exactly 10 digit number
    return /^\d{10}$/.test(cleaned);
  };

  const validateName = (nameString) => {
    // Only letters, spaces, dots, single quotes, and dashes, length 2 to 50
    return /^[a-zA-Z\s.'-]{2,50}$/.test(nameString.trim());
  };

  const validateCardNumber = (num) => {
    // Clean spaces and dashes, check if exactly 16 digits
    const cleaned = num.replace(/[-\s]/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiry = (exp) => {
    // Clean spaces and allow MM/YY or MM/YYYY formats
    let cleaned = exp.trim().replace(/\s/g, '');
    if (/^(0[1-9]|1[0-2])\/?\d{4}$/.test(cleaned)) {
      const parts = cleaned.split('/');
      if (parts.length === 2) {
        cleaned = parts[0] + '/' + parts[1].substring(2);
      } else {
        cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(4);
      }
    }
    return /^(0[1-9]|1[0-2])\/?\d{2}$/.test(cleaned);
  };

  const validateCvv = (cvv) => {
    // Allows 3 or 4 digits
    return /^\d{3,4}$/.test(cvv.trim());
  };

  const validateUpi = (upi) => {
    // Standard UPI VPA format
    return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upi.trim());
  };

  // Poll backend for orders
  const fetchOrders = () => {
    fetch(`${API_BASE_URL}/api/orders`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        setOrders(data.reverse());
        setBackendConnected(true);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setBackendConnected(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      const savedAddr = localStorage.getItem(`address_${user.id}`);
      const savedPhone = localStorage.getItem(`phone_${user.id}`);
      setAddress(savedAddr || '');
      setPhone(savedPhone || '');
      setProfileAddress(savedAddr || '');
      setProfilePhone(savedPhone || '');
    } else {
      setAddress('');
      setPhone('');
      setProfileAddress('');
      setProfilePhone('');
    }
  }, [user]);

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    setAddress('');
    setPhone('');
    showNotification('Logged out successfully', 'success');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    if (!validateEmail(authEmail)) {
      showNotification('Please enter the correct format: email must contain @ and a domain name (e.g. name@example.com)', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      if (!res.ok) {
        let errorMsg = 'Invalid email or password.';
        try {
          const data = await res.json();
          if (data && data.message) errorMsg = data.message;
        } catch (errJson) {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setAuthEmail('');
      setAuthPassword('');
      showNotification(`Welcome back, ${data.name}!`, 'success');
    } catch (err) {
      console.error(err);
      if (err.message && err.message !== 'Failed to fetch') {
        showNotification(err.message, 'error');
      } else {
        showNotification('Connection failed. Please check if your backend service is running and accessible.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!authName || !authEmail || !authPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    if (!validateName(authName)) {
      showNotification('Please enter the correct format: name should contain only alphabets and spaces', 'error');
      return;
    }
    if (!validateEmail(authEmail)) {
      showNotification('Please enter the correct format: email must contain @ and a domain name (e.g. name@example.com)', 'error');
      return;
    }
    if (authPassword.length < 6) {
      showNotification('Please enter the correct format: password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: authName, email: authEmail, password: authPassword, role: authRole })
      });

      if (!res.ok) {
        let errorMsg = 'Registration failed. Email might already be in use.';
        try {
          const data = await res.json();
          if (data && data.message) errorMsg = data.message;
        } catch (errJson) {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      showNotification('Account created successfully!', 'success');
    } catch (err) {
      console.error(err);
      if (err.message && err.message !== 'Failed to fetch') {
        showNotification(err.message, 'error');
      } else {
        showNotification('Connection failed. Please check if your backend service is running and accessible.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cart actions
  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      setCart(cart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    showNotification(`${item.name} added to cart!`, 'success');
  };

  const updateCartQuantity = (itemId, q) => {
    if (q <= 0) {
      setCart(cart.filter((i) => i.id !== itemId));
    } else {
      setCart(cart.map((i) => (i.id === itemId ? { ...i, quantity: q } : i)));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Customer: Place Order
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }
    if (!address.trim() || !phone.trim()) {
      showNotification('Please fill in address and contact number', 'error');
      return;
    }
    if (address.trim().length < 3) {
      showNotification('Please enter the correct format: address must be at least 3 characters long', 'error');
      return;
    }
    if (!validatePhone(phone)) {
      showNotification('Please enter the correct format: mobile number must be exactly 10 digits only', 'error');
      return;
    }

    setLoading(true);
    const fullAddress = `${address.trim()} | Phone: ${phone.trim()}`;
    const payload = {
      customerId: user.name,
      address: fullAddress,
      itemDetails: cart.map((i) => ({
        foodId: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price
      }))
    };

    fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to place order');
        return res.json();
      })
      .then((data) => {
        showNotification('Order placed successfully! Awaiting payment.', 'success');
        // Auto-save address and phone to profile/localStorage on checkout
        if (user) {
          localStorage.setItem(`address_${user.id}`, address.trim());
          localStorage.setItem(`phone_${user.id}`, phone.trim());
          setProfileAddress(address.trim());
          setProfilePhone(phone.trim());
        }
        setCart([]);
        // Refill from profile/localStorage instead of leaving empty
        const savedAddr = user ? localStorage.getItem(`address_${user.id}`) : '';
        const savedPhone = user ? localStorage.getItem(`phone_${user.id}`) : '';
        setAddress(savedAddr || '');
        setPhone(savedPhone || '');
        setActiveTab('orders');
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        showNotification('Failed to place order. Try again.', 'error');
      })
      .finally(() => setLoading(false));
  };

  // Customer: Make Payment (Confirm in Modal with strict field checks)
  const handlePayment = () => {
    if (!activePaymentOrder) return;

    // COD flow — separate endpoint, no gateway simulation
    if (paymentMethod === 'cod') {
      setLoading(true);
      const orderId = activePaymentOrder.orderId;
      fetch(`${API_BASE_URL}/api/orders/${orderId}/cod`, {
        method: 'POST'
      })
        .then((res) => {
          if (!res.ok) throw new Error('COD confirmation failed');
          return res.json();
        })
        .then((data) => {
          showNotification(`Order confirmed with Cash on Delivery! ₹${activePaymentOrder.amount.toFixed(2)} will be collected by the delivery partner.`, 'success');
          setActivePaymentOrder(null);
          setActiveTab('orders');
          fetchOrders();
        })
        .catch((err) => {
          console.error(err);
          showNotification('Failed to confirm COD order. Try again.', 'error');
        })
        .finally(() => setLoading(false));
      return;
    }

    // Validate inputs strictly based on selected payment method
    if (paymentMethod === 'card') {
      if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
        showNotification('Please fill in all card details', 'error');
        return;
      }
      if (!validateName(cardHolder)) {
        showNotification('Please enter the correct format: card holder name should contain only alphabets and spaces', 'error');
        return;
      }
      if (!validateCardNumber(cardNumber)) {
        showNotification('Please enter the correct format: card number must be exactly 16 digits only', 'error');
        return;
      }
      if (!validateExpiry(cardExpiry)) {
        showNotification('Please enter the correct format: expiry date must be in MM/YY format', 'error');
        return;
      }
      if (!validateCvv(cardCvv)) {
        showNotification('Please enter the correct format: CVV must be exactly 3 or 4 digits only', 'error');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        showNotification('Please enter your UPI ID', 'error');
        return;
      }
      if (!validateUpi(upiId)) {
        showNotification('Please enter the correct format: UPI ID must be in username@bank format (e.g. user@okhdfc)', 'error');
        return;
      }
    }

    // Show gateway processing overlay and simulate gateway redirect
    setPaymentProcessing(true);

    setTimeout(() => {
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setCorrectOtp(generatedCode);
      setOtpInput('');
      setOtpStep(true);
      showNotification('OTP sent to your registered mobile/email!', 'success');
    }, 1500);
  };

  // Verify OTP and complete the backend payment
  const handleVerifyOtp = () => {
    if (otpInput.trim() !== correctOtp) {
      showNotification('Invalid OTP. Please check the code and try again.', 'error');
      return;
    }

    setOtpVerifying(true);
    const orderId = activePaymentOrder.orderId;
    const amount = activePaymentOrder.amount;
    const method = paymentMethod.toUpperCase();

    fetch(`${API_BASE_URL}/api/orders/${orderId}/pay?paymentMethod=${method}`, {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Payment failed');
        return res.json();
      })
      .then((data) => {
        setPaymentProcessing(false);
        setOtpStep(false);
        setCorrectOtp('');
        setOtpInput('');
        // Show success modal with transaction details
        const txId = 'TXN-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
        setPaymentSuccess({ orderId: orderId.substring(0, 8), amount, method, transactionId: txId });
        // Reset modal fields
        setActivePaymentOrder(null);
        setCardHolder('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        setUpiId('');
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        showNotification('Payment failed at gateway. Please try again.', 'error');
      })
      .finally(() => {
        setOtpVerifying(false);
      });
  };

  // Resend OTP
  const handleResendOtp = () => {
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCorrectOtp(generatedCode);
    setOtpInput('');
    showNotification('A new OTP has been sent successfully!', 'success');
  };

  // Delivery Partner: Confirm COD Cash Collection
  const handleConfirmCodPayment = (orderId) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/orders/${orderId}/confirm-cod-payment`, {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to confirm COD payment');
        return res.json();
      })
      .then((data) => {
        showNotification('Cash on Delivery payment confirmed successfully!', 'success');
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        showNotification('Failed to confirm COD payment.', 'error');
      })
      .finally(() => setLoading(false));
  };

  // Customer: Cancel Order
  const handleCancelOrder = (orderId) => {
    setLoading(true);
    setCancelConfirmOrder(null);
    fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) return res.text().then(t => { throw new Error(t); });
        return res.json();
      })
      .then((data) => {
        const refundMsg = data.paymentStatus === 'REFUND_INITIATED' ? ' Refund has been initiated.' : '';
        showNotification(`Order cancelled successfully!${refundMsg}`, 'success');
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        showNotification(err.message || 'Failed to cancel order.', 'error');
      })
      .finally(() => setLoading(false));
  };

  // Customer: Reorder from past order
  const handleReorder = (order) => {
    if (order.itemDetails && order.itemDetails.length > 0) {
      const newCartItems = order.itemDetails.map(item => {
        const menuItem = MENU_ITEMS.find(m => m.id === item.foodId);
        return {
          id: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: menuItem?.description || '',
          image: menuItem?.image || '',
          category: menuItem?.category || 'mains',
          isVeg: menuItem?.isVeg ?? true,
          rating: menuItem?.rating || 4.5,
          prepTime: menuItem?.prepTime || '10 mins'
        };
      });
      setCart(newCartItems);
      setActiveTab('menu');
      showNotification(`${newCartItems.length} item(s) from your past order added to cart!`, 'success');
    } else {
      showNotification('Unable to reorder — item details not available for this order.', 'error');
    }
  };

  // Shopkeeper: Accept Order
  const handleAcceptOrder = (orderId) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/orders/${orderId}/accept`, {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to accept order');
        return res.json();
      })
      .then((data) => {
        showNotification('Order accepted. Preparation started!', 'success');
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        showNotification('Failed to accept order.', 'error');
      })
      .finally(() => setLoading(false));
  };

  // Shopkeeper: Update Kitchen Status
  const handleUpdateStatus = (orderId, targetStatus) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/orders/${orderId}/status?status=${targetStatus}`, {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
      })
      .then((data) => {
        showNotification(`Order status updated to: ${targetStatus.replace(/_/g, ' ')}`, 'success');
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        showNotification('Failed to update status.', 'error');
      })
      .finally(() => setLoading(false));
  };

  // Delivery Partner: Mark Delivered
  const handleMarkDelivered = (orderId) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/orders/${orderId}/deliver`, {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to mark delivered');
        return res.json();
      })
      .then((data) => {
        showNotification('Order marked as DELIVERED successfully!', 'success');
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        showNotification('Failed to mark delivered.', 'error');
      })
      .finally(() => setLoading(false));
  };

  // Helpers
  const getStepIndex = (status) => {
    const steps = ['PLACED', 'PAYMENT_COMPLETED', 'PREPARING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    return steps.indexOf(status.toUpperCase());
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toUpperCase()) {
      case 'PLACED': return 'badge-placed';
      case 'PAYMENT_COMPLETED': return 'badge-payment';
      case 'PREPARING': return 'badge-preparing';
      case 'READY_FOR_DELIVERY': return 'badge-ready';
      case 'OUT_FOR_DELIVERY': return 'badge-out';
      case 'DELIVERED': return 'badge-delivered';
      case 'CANCELLED':
      case 'FAILED': return 'badge-failed';
      default: return 'badge-placed';
    }
  };

  const parseAddressDetails = (addressStr) => {
    if (!addressStr) return { addr: 'Unknown', phone: 'N/A' };
    const parts = addressStr.split('| Contact:');
    const parts2 = addressStr.split('| Phone:');
    if (parts2.length > 1) {
      return { addr: parts2[0].trim(), phone: parts2[1].trim() };
    }
    if (parts.length > 1) {
      return { addr: parts[0].trim(), phone: parts[1].trim() };
    }
    return { addr: addressStr, phone: 'N/A' };
  };

  // RENDER: Auth Gate
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand-header">
            <img src={logoImg} className="auth-logo" alt="Waffor Foods Logo" />
            <h2>Waffor Foods</h2>
          </div>
          <p className="subtitle">Secure Role-Based Entrance Gateway</p>

          <div className={`status-banner ${backendConnected ? 'connected' : 'disconnected'}`} style={{ margin: '0.5rem auto 1.5rem auto' }}>
            <span className="pulse-dot"></span>
            System: {backendConnected ? 'Connected' : 'Offline (Backend Unreachable)'}
          </div>

          {notification && (
            <div className={`alert-box alert-${notification.type}`}>
              {notification.text}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                  value={authName} 
                  onChange={(e) => setAuthName(e.target.value)} 
                  required 
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="e.g. john@example.com"
                value={authEmail} 
                onChange={(e) => setAuthEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={authPassword} 
                onChange={(e) => setAuthPassword(e.target.value)} 
                required 
              />
            </div>

            {isRegistering && (
              <div className="form-group">
                <label className="form-label">User Role</label>
                <select 
                  className="form-input" 
                  value={authRole} 
                  onChange={(e) => setAuthRole(e.target.value)}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="SHOPKEEPER">Shop Keeper</option>
                  <option value="DELIVERY">Delivery Partner</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Authenticate')}
            </button>
          </form>

          <div className="auth-footer">
            {isRegistering ? (
              <p>Already have an account? <span onClick={() => setIsRegistering(false)}>Login here</span></p>
            ) : (
              <p>New to the system? <span onClick={() => setIsRegistering(true)}>Register here</span></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Main Dashboard
  return (
    <div className="container">
      {/* Top Banner Status */}
      <div className={`status-banner ${backendConnected ? 'connected' : 'disconnected'}`}>
        <span className="pulse-dot"></span>
        System: {backendConnected ? 'Connected (Port 8081)' : 'Offline (Check Order Service)'}
      </div>

      {/* Navigation Header */}
      <header className="main-header">
        <div className="brand">
          <img src={logoImg} className="brand-logo" alt="Waffor Foods Logo" />
          <h1>Waffor Foods</h1>
          <span className="user-badge">{user.role} PORTAL</span>
        </div>
        
        <div className="user-profile">
          <span className="user-name">Welcome, <strong>{user.name}</strong></span>
          <button className="btn-secondary btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {notification && (
        <div className={`alert-box alert-${notification.type}`}>
          {notification.text}
        </div>
      )}

      {/* ---------------- CUSTOMER INTERFACE ---------------- */}
      {user.role === 'CUSTOMER' && (
        <div>
          {/* Premium Customer Navbar */}
          <nav className="customer-navbar">
            <button className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
              <span className="nav-icon">🏠</span> Home
            </button>
            <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); fetchOrders(); }}>
              <span className="nav-icon">📋</span> My Orders
            </button>
            <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <span className="nav-icon">👤</span> Profile
            </button>
          </nav>

          {activeTab === 'menu' && (
            <div>
              {/* Premium Hero Promo Banner */}
              <div className="menu-hero-banner">
                <div className="hero-banner-overlay"></div>
                <div className="hero-banner-content">
                  <span className="hero-badge">⚡ Live Order Tracking Enabled</span>
                  <h1>Craving Warm, Fresh Food?</h1>
                  <p>Order from Waffor Foods and witness premium saga-orchestrated microservices bring it right to your door!</p>
                </div>
              </div>

              {/* Search & Category Filter Section */}
              <div className="menu-controls-panel">
                <div className="search-bar-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for dishes, snacks, sweets..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value) {
                        setSelectedCategory('all');
                      }
                    }}
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>

                <div className="category-filters">
                  <button 
                    className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    🍽️ All Menu
                  </button>
                  <button 
                    className={`category-pill ${selectedCategory === 'breakfast' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('breakfast')}
                  >
                    🥞 Breakfast
                  </button>
                  <button 
                    className={`category-pill ${selectedCategory === 'mains' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('mains')}
                  >
                    🍔 Fast Food
                  </button>
                  <button 
                    className={`category-pill ${selectedCategory === 'drinks' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('drinks')}
                  >
                    🍹 Drinks
                  </button>
                  <button 
                    className={`category-pill ${selectedCategory === 'desserts' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('desserts')}
                  >
                    🧁 Desserts
                  </button>
                </div>
                
                <div className="diet-filters" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className={`diet-pill ${vegFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setVegFilter('all')}
                  >
                    🟢🔴 All Diet
                  </button>
                  <button 
                    className={`diet-pill veg ${vegFilter === 'veg' ? 'active' : ''}`}
                    onClick={() => setVegFilter('veg')}
                  >
                    🟢 Veg Only
                  </button>
                  <button 
                    className={`diet-pill nonveg ${vegFilter === 'nonveg' ? 'active' : ''}`}
                    onClick={() => setVegFilter('nonveg')}
                  >
                    🔴 Non-Veg Only
                  </button>
                </div>
              </div>

              {/* Nearby Kitchens / Restaurants Section */}
              <div className="nearby-section">
                <div className="nearby-header">
                  <h2>⚡ Nearby Kitchens</h2>
                  <span className="nearby-subtitle">Super-fast delivery from your favorite local kitchens</span>
                </div>
                {filteredRestaurants.length === 0 ? (
                  <div className="nearby-empty">
                    <p>No nearby kitchens match your search criteria.</p>
                  </div>
                ) : (
                  <div className="nearby-grid">
                    {filteredRestaurants.map((rest) => {
                      const isActive = selectedCategory === rest.category;
                      return (
                        <div 
                          key={rest.id} 
                          className={`restaurant-card-premium ${isActive ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(isActive ? 'all' : rest.category)}
                        >
                          <div className="restaurant-card-image-wrapper">
                            <img src={rest.image} alt={rest.name} className="restaurant-card-image" loading="lazy" />
                            <span className="restaurant-status-badge">🟢 Open</span>
                            <span className="restaurant-distance-badge">📍 {rest.distance}</span>
                          </div>
                          <div className="restaurant-card-content">
                            <div className="restaurant-card-header-row">
                              <h3>{rest.name}</h3>
                              <span className="restaurant-rating">⭐ {rest.rating}</span>
                            </div>
                            <p className="restaurant-specialty">{rest.specialty}</p>
                            <div className="restaurant-card-footer">
                              <span className="restaurant-time">⏱️ {rest.prepTime}</span>
                              <button 
                                className={`btn-view-menu ${isActive ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCategory(isActive ? 'all' : rest.category);
                                }}
                              >
                                {isActive ? 'Showing Menu' : 'View Menu'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="dashboard-grid">
                {/* Menu items */}
                <div className="panel list-panel">
                  <div className="panel-header-row">
                    <h2>Browse Menu</h2>
                    <span className="items-count-badge">{filteredMenuItems.length} dishes</span>
                  </div>
                  {filteredMenuItems.length === 0 ? (
                    <div className="empty-state">
                      <p>No dishes found matching "{searchQuery}". Try searching for something else!</p>
                    </div>
                  ) : (
                    <div className="menu-grid">
                      {filteredMenuItems.map((item) => (
                        <div key={item.id} className="menu-card-premium">
                          <div className="menu-card-image-wrapper">
                            <img src={item.image} alt={item.name} className="menu-card-image" loading="lazy" />
                            {/* Veg/Non-Veg Indicator Badge */}
                            <span className={`food-type-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                              <span className="badge-inner-dot"></span>
                            </span>
                            {/* Prep Time */}
                            <span className="prep-time-tag">⏱️ {item.prepTime}</span>
                          </div>
                          <div className="menu-card-content">
                            <div className="menu-card-header-row">
                              <h3>{item.name}</h3>
                              <span className="rating-badge">⭐ {item.rating.toFixed(1)}</span>
                            </div>
                            <p className="menu-card-desc">{item.description}</p>
                            <div className="menu-card-footer">
                              <span className="menu-price">₹{item.price.toFixed(2)}</span>
                              <button className="btn-primary btn-add-cart" onClick={() => addToCart(item)}>
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              {/* Shopping Cart */}
              <div className="panel form-panel">
                <h2>Shopping Cart</h2>
                {cart.length === 0 ? (
                  <div className="empty-state">
                    <p>Your cart is empty. Add food items to start checkout!</p>
                  </div>
                ) : (
                  <div>
                    <div className="cart-list">
                      {cart.map((item) => (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item-info">
                            <h4>{item.name}</h4>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="cart-item-actions">
                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                            <span className="cart-qty">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="cart-total">
                      <span>Total Amount:</span>
                      <strong>₹{calculateTotal().toFixed(2)}</strong>
                    </div>

                    <form onSubmit={handlePlaceOrder} style={{ marginTop: '1.5rem' }}>
                      <div className="form-group">
                        <label className="form-label">Delivery Address</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. 123 Tech Park Rd, App 4B"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Number (Indian Mobile)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required 
                        />
                      </div>
                      <button type="submit" className="btn-primary checkout-btn" disabled={loading}>
                        {loading ? 'Placing Order...' : 'Place Order'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

          {activeTab === 'orders' && (
            <div className="panel full-panel">
              <h2>My Order History</h2>
              {orders.filter(o => o.customerId === user.name).length === 0 ? (
                <div className="empty-state">
                  <p>You have not placed any orders yet.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.filter(o => o.customerId === user.name).map((order) => {
                    const stepIndex = getStepIndex(order.status);
                    const isCancelled = order.status === 'CANCELLED' || order.status === 'FAILED';
                    const addrDetails = parseAddressDetails(order.address);

                    return (
                      <div key={order.orderId} className={`order-card ${isCancelled ? 'cancelled' : ''}`}>
                        <div className="order-header">
                          <div>
                            <span className="order-id">ID: {order.orderId.substring(0, 8)}...</span>
                            <span className="order-time">Placed: {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'N/A'}</span>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="order-details">
                          <p><strong>Items:</strong> {order.items}</p>
                          <p><strong>Total Price:</strong> ₹{order.amount.toFixed(2)}</p>
                          <p><strong>Address:</strong> {addrDetails.addr}</p>
                          <p><strong>Payment Status:</strong>{' '}
                            {order.paymentMethod === 'COD' && order.paymentStatus === 'COD_PENDING' ? (
                              <span className="badge badge-cod">💵 COD — Awaiting Delivery</span>
                            ) : order.paymentMethod === 'COD' && order.paymentStatus === 'PAID' ? (
                              <span className="badge badge-delivered">💵 COD — Paid</span>
                            ) : order.paymentStatus === 'PAID' ? (
                              <span className="badge badge-payment">✅ Paid via {order.paymentMethod}</span>
                            ) : (
                              <span>{order.paymentStatus}</span>
                            )}
                            {' '}
                            {order.paymentStatus === 'PENDING' && (
                              <button className="btn-pay" onClick={() => setActivePaymentOrder(order)} disabled={loading}>
                                Pay Now
                              </button>
                            )}
                          </p>
                        </div>

                        {/* Tracker */}
                        {!isCancelled && (
                          <div className="progress-tracker">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${(Math.max(0, stepIndex) / 5) * 100}%` }}
                              ></div>
                            </div>
                            <div className="steps-container">
                              <div className={`step-node ${stepIndex >= 0 ? 'active' : ''}`}>
                                <span className="node-dot"></span>
                                <span className="node-label">Placed</span>
                              </div>
                              <div className={`step-node ${stepIndex >= 1 ? 'active' : ''}`}>
                                <span className="node-dot"></span>
                                <span className="node-label">Paid</span>
                              </div>
                              <div className={`step-node ${stepIndex >= 2 ? 'active' : ''}`}>
                                <span className="node-dot"></span>
                                <span className="node-label">Preparing</span>
                              </div>
                              <div className={`step-node ${stepIndex >= 3 ? 'active' : ''}`}>
                                <span className="node-dot"></span>
                                <span className="node-label">Ready</span>
                              </div>
                              <div className={`step-node ${stepIndex >= 4 ? 'active' : ''}`}>
                                <span className="node-dot"></span>
                                <span className="node-label">Transit</span>
                              </div>
                              <div className={`step-node ${stepIndex >= 5 ? 'active' : ''}`}>
                                <span className="node-dot"></span>
                                <span className="node-label">Delivered</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isCancelled && (
                          <div className="compensation-alert">
                            Workflow Terminated / Compensated
                          </div>
                        )}

                        <div className="order-card-footer-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                          {/* Cancel Order Button */}
                          {!isCancelled && (order.status === 'PLACED' || order.status === 'PAYMENT_COMPLETED') && (
                            <button 
                              className="btn-secondary btn-red" 
                              onClick={() => setCancelConfirmOrder(order.orderId)}
                              style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}
                            >
                              ✕ Cancel Order
                            </button>
                          )}

                          {/* Reorder Button */}
                          {order.status === 'DELIVERED' && (
                            <button 
                              className="btn-primary btn-orange" 
                              onClick={() => handleReorder(order)}
                              style={{ flex: 1 }}
                            >
                              🔄 Reorder
                            </button>
                          )}

                          {/* View Receipt Button */}
                          {(order.status === 'DELIVERED' || order.status === 'OUT_FOR_DELIVERY' || order.status === 'READY_FOR_DELIVERY' || order.status === 'PREPARING' || order.status === 'PAYMENT_COMPLETED') && (
                            <button 
                              className="btn-secondary" 
                              onClick={() => setReceiptOrder(order)}
                              style={{ flex: 1 }}
                            >
                              📄 View Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="panel full-panel profile-panel">
              <div className="profile-header-card">
                <div className="profile-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-meta">
                  <h2>{user.name}</h2>
                  <span className="profile-role-badge">Premium {user.role}</span>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="profile-section-card">
                  <h3>Saved Delivery Address</h3>
                  <p className="section-desc">Manage your default delivery coordinates and contact info for quick ordering.</p>
                  
                  <div className="form-group">
                    <label className="form-label">Default Address</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 123 Tech Park Rd, App 4B"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 9876543210"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      if (profileAddress.trim().length < 3) {
                        showNotification('Please enter the correct format: address must be at least 3 characters long', 'error');
                        return;
                      }
                      if (!validatePhone(profilePhone)) {
                        showNotification('Please enter the correct format: mobile number must be exactly 10 digits only', 'error');
                        return;
                      }
                      localStorage.setItem(`address_${user.id}`, profileAddress.trim());
                      localStorage.setItem(`phone_${user.id}`, profilePhone.trim());
                      setAddress(profileAddress.trim());
                      setPhone(profilePhone.trim());
                      showNotification('Profile and delivery details updated successfully!', 'success');
                    }}
                  >
                    Save Address Book
                  </button>
                </div>

                <div className="profile-section-card summary-card">
                  <h3>Membership & Status</h3>
                  <div className="profile-stat-row">
                    <span>Account ID:</span>
                    <strong className="mono-text">{user.id.substring(0, 8)}...</strong>
                  </div>
                  <div className="profile-stat-row">
                    <span>Order Count:</span>
                    <strong>{orders.filter(o => o.customerId === user.name).length} Orders</strong>
                  </div>
                  <div className="profile-stat-row">
                    <span>Loyalty Status:</span>
                    <strong className="accent-text">Gold Member</strong>
                  </div>
                  <div className="profile-stat-row">
                    <span>Pre-authorized Payment:</span>
                    <strong className="green-text">Active (Visa / UPI linked)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- SHOP KEEPER INTERFACE ---------------- */}
      {user.role === 'SHOPKEEPER' && (
        <div>
          {/* Tabs */}
          <div className="tabs-bar">
            <button className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
              New Orders ({orders.filter(o => o.status === 'PAYMENT_COMPLETED').length})
            </button>
            <button className={`tab-btn ${activeTab === 'preparing' ? 'active' : ''}`} onClick={() => setActiveTab('preparing')}>
              Preparing ({orders.filter(o => o.status === 'PREPARING').length})
            </button>
            <button className={`tab-btn ${activeTab === 'ready' ? 'active' : ''}`} onClick={() => setActiveTab('ready')}>
              Ready ({orders.filter(o => o.status === 'READY_FOR_DELIVERY').length})
            </button>
            <button className={`tab-btn ${activeTab === 'out' ? 'active' : ''}`} onClick={() => setActiveTab('out')}>
              Out for Delivery ({orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length})
            </button>
            <button className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>
              Cancelled ({orders.filter(o => o.status === 'CANCELLED' || o.status === 'FAILED').length})
            </button>
          </div>

          <div className="panel full-panel">
            <h2>Shop Operations Board</h2>
            
            {/* Shopkeeper Analytics Dashboard */}
            <div className="stats-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>💰</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Revenue</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-neon)', marginTop: '0.25rem' }}>
                  ₹{orders.filter(o => o.status === 'DELIVERED').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                </div>
              </div>
              
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>📊</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {orders.length}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>🍳</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preparing</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fd7e14', marginTop: '0.25rem' }}>
                  {orders.filter(o => o.status === 'PREPARING').length}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>📦</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Awaiting Pickup</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6f42c1', marginTop: '0.25rem' }}>
                  {orders.filter(o => o.status === 'READY_FOR_DELIVERY').length}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>✅</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#198754', marginTop: '0.25rem' }}>
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </div>
              </div>
            </div>
            
            {/* New Orders */}
            {activeTab === 'new' && (
              <div>
                <h3>Pending Acceptance</h3>
                {orders.filter(o => o.status === 'PAYMENT_COMPLETED').length === 0 ? (
                  <p className="empty-state">No new paid orders waiting to be accepted.</p>
                ) : (
                  <div className="orders-list">
                    {orders.filter(o => o.status === 'PAYMENT_COMPLETED').map((order) => (
                      <div key={order.orderId} className="order-card row-layout">
                        <div className="order-card-info">
                          <span className="order-id">ID: {order.orderId.substring(0, 8)}...</span>
                          <p><strong>Customer:</strong> {order.customerId}</p>
                          <p><strong>Ordered Items:</strong> {order.items}</p>
                          <p><strong>Amount:</strong> ₹{order.amount.toFixed(2)}</p>
                        </div>
                        <div className="order-card-action">
                          <button className="btn-primary" onClick={() => handleAcceptOrder(order.orderId)} disabled={loading}>
                            Accept & Start Preparing
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Preparing Orders */}
            {activeTab === 'preparing' && (
              <div>
                <h3>Food in Preparation</h3>
                {orders.filter(o => o.status === 'PREPARING').length === 0 ? (
                  <p className="empty-state">No orders are currently in preparation.</p>
                ) : (
                  <div className="orders-list">
                    {orders.filter(o => o.status === 'PREPARING').map((order) => (
                      <div key={order.orderId} className="order-card row-layout">
                        <div className="order-card-info">
                          <span className="order-id">ID: {order.orderId.substring(0, 8)}...</span>
                          <p><strong>Customer:</strong> {order.customerId}</p>
                          <p><strong>Ordered Items:</strong> {order.items}</p>
                        </div>
                        <div className="order-card-action">
                          <button className="btn-primary btn-orange" onClick={() => handleUpdateStatus(order.orderId, 'READY_FOR_DELIVERY')} disabled={loading}>
                            Mark Ready for Delivery
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ready Orders */}
            {activeTab === 'ready' && (
              <div>
                <h3>Orders Ready for Dispatch</h3>
                {orders.filter(o => o.status === 'READY_FOR_DELIVERY').length === 0 ? (
                  <p className="empty-state">No orders are waiting for delivery dispatch.</p>
                ) : (
                  <div className="orders-list">
                    {orders.filter(o => o.status === 'READY_FOR_DELIVERY').map((order) => (
                      <div key={order.orderId} className="order-card row-layout">
                        <div className="order-card-info">
                          <span className="order-id">ID: {order.orderId.substring(0, 8)}...</span>
                          <p><strong>Customer:</strong> {order.customerId}</p>
                          <p><strong>Ordered Items:</strong> {order.items}</p>
                          <p><strong>Address:</strong> {parseAddressDetails(order.address).addr}</p>
                        </div>
                        <div className="order-card-action">
                          <button className="btn-primary btn-purple" onClick={() => handleUpdateStatus(order.orderId, 'OUT_FOR_DELIVERY')} disabled={loading}>
                            Dispatch for Delivery
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Out for Delivery Orders */}
            {activeTab === 'out' && (
              <div>
                <h3>Dispatched Orders (In Transit)</h3>
                {orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length === 0 ? (
                  <p className="empty-state">No orders are currently out for delivery.</p>
                ) : (
                  <div className="orders-list">
                    {orders.filter(o => o.status === 'OUT_FOR_DELIVERY').map((order) => (
                      <div key={order.orderId} className="order-card">
                        <span className="order-id">ID: {order.orderId.substring(0, 8)}...</span>
                        <div className="order-details">
                          <p><strong>Customer:</strong> {order.customerId}</p>
                          <p><strong>Address:</strong> {parseAddressDetails(order.address).addr}</p>
                          <p><strong>Rider Delivery ID:</strong> {order.deliveryPartnerId || 'Pending Assignment'}</p>
                          <p><strong>Ordered Items:</strong> {order.items}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cancelled Orders */}
            {activeTab === 'cancelled' && (
              <div>
                <h3>Cancelled & Failed Orders</h3>
                {orders.filter(o => o.status === 'CANCELLED' || o.status === 'FAILED').length === 0 ? (
                  <p className="empty-state">No cancelled or failed orders found.</p>
                ) : (
                  <div className="orders-list">
                    {orders.filter(o => o.status === 'CANCELLED' || o.status === 'FAILED').map((order) => (
                      <div key={order.orderId} className="order-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        <div className="order-header">
                          <div>
                            <span className="order-id">ID: {order.orderId.substring(0, 8)}...</span>
                            <span className="order-time">Placed: {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'N/A'}</span>
                          </div>
                          <span className="badge badge-failed">
                            {order.status}
                          </span>
                        </div>
                        <div className="order-details">
                          <p><strong>Customer:</strong> {order.customerId}</p>
                          <p><strong>Ordered Items:</strong> {order.items}</p>
                          <p><strong>Total Price:</strong> ₹{order.amount.toFixed(2)}</p>
                          <p><strong>Payment Status:</strong> <span className="mono-text" style={{ color: '#ef4444' }}>{order.paymentStatus}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- DELIVERY PARTNER INTERFACE ---------------- */}
      {user.role === 'DELIVERY' && (
        <div>
          {/* Tabs */}
          <div className="tabs-bar">
            <button className={`tab-btn ${activeTab === 'assigned' ? 'active' : ''}`} onClick={() => setActiveTab('assigned')}>
              Assigned Orders ({orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length})
            </button>
            <button className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`} onClick={() => setActiveTab('delivered')}>
              Delivered History ({orders.filter(o => o.status === 'DELIVERED').length})
            </button>
          </div>

          <div className="panel full-panel">
            <h2>Rider Delivery Dashboard</h2>

            {/* Rider Delivery Stats Dashboard */}
            <div className="stats-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>🚴</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Deliveries</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-neon)', marginTop: '0.25rem' }}>
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>💵</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>COD Cash Collected</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fbbf24', marginTop: '0.25rem' }}>
                  ₹{orders.filter(o => o.status === 'DELIVERED' && o.paymentMethod === 'COD').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>📦</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Deliveries</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffc107', marginTop: '0.25rem' }}>
                  {orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>⭐</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completion Rate</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#34d399', marginTop: '0.25rem' }}>
                  {orders.filter(o => o.status === 'DELIVERED').length + orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length > 0
                    ? ((orders.filter(o => o.status === 'DELIVERED').length / (orders.filter(o => o.status === 'DELIVERED').length + orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length)) * 100).toFixed(0) + '%'
                    : '100%'}
                </div>
              </div>
            </div>

            {/* Assigned Orders */}
            {activeTab === 'assigned' && (
              <div>
                <h3>Assigned Deliveries</h3>
                {orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length === 0 ? (
                  <p className="empty-state">No active deliveries assigned to you.</p>
                ) : (
                  <div className="orders-list">
                    {orders.filter(o => o.status === 'OUT_FOR_DELIVERY').map((order) => {
                      const addrDetails = parseAddressDetails(order.address);
                      const isCodOrder = order.paymentMethod === 'COD';
                      const isCodPending = isCodOrder && order.paymentStatus === 'COD_PENDING';
                      return (
                        <div key={order.orderId} className="order-card row-layout">
                          <div className="order-card-info">
                            <span className="order-id">ID: {order.orderId.substring(0, 8)}...</span>
                            <p><strong>Customer Name:</strong> {order.customerId}</p>
                            <p><strong>Delivery Address:</strong> {addrDetails.addr}</p>
                            <p><strong>Contact Number:</strong> {addrDetails.phone}</p>
                            <p><strong>Order Details:</strong> {order.items}</p>
                            {isCodOrder && (
                              <div className="cod-collection-badge">
                                💵 Collect ₹{order.amount.toFixed(2)} Cash from Customer
                                {isCodPending && <span className="cod-status-pending"> (Payment Pending)</span>}
                                {!isCodPending && <span className="cod-status-confirmed"> (Cash Collected ✅)</span>}
                              </div>
                            )}
                          </div>
                          <div className="order-card-action">
                            {isCodPending && (
                              <button className="btn-primary btn-orange" onClick={() => handleConfirmCodPayment(order.orderId)} disabled={loading}>
                                Confirm Cash Collected
                              </button>
                            )}
                            <button 
                              className="btn-primary btn-green" 
                              onClick={() => handleMarkDelivered(order.orderId)} 
                              disabled={loading || isCodPending}
                              title={isCodPending ? 'Confirm cash collection first' : 'Mark order as delivered'}
                            >
                              Mark as Delivered
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Delivered History */}
            {activeTab === 'delivered' && (
              <div>
                <h3>Delivery Completion History</h3>
                {orders.filter(o => o.status === 'DELIVERED').length === 0 ? (
                  <p className="empty-state">You have not completed any deliveries yet.</p>
                ) : (
                  <div className="orders-list">
                    {orders.filter(o => o.status === 'DELIVERED').map((order) => {
                      const addrDetails = parseAddressDetails(order.address);
                      return (
                        <div key={order.orderId} className="order-card">
                          <span className="order-id">ID: {order.orderId.substring(0, 8)}...</span>
                          <div className="order-details">
                            <p><strong>Customer Name:</strong> {order.customerId}</p>
                            <p><strong>Delivery Address:</strong> {addrDetails.addr}</p>
                            <p><strong>Completed Delivery ID:</strong> {order.deliveryPartnerId}</p>
                            <p><strong>Ordered Items:</strong> {order.items}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- INTERACTIVE PAYMENT OPTIONAL MODAL ---------------- */}
      {activePaymentOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Select Payment Method</h2>
            <p className="modal-amount">Amount to Pay: <strong>₹{activePaymentOrder.amount.toFixed(2)}</strong></p>

            <div className="modal-method-tabs">
              <button 
                type="button" 
                className={`method-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Credit Card
              </button>
              <button 
                type="button" 
                className={`method-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                📱 UPI
              </button>
              <button 
                type="button" 
                className={`method-tab-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                💵 Cash on Delivery
              </button>
            </div>

            <div>
              {paymentMethod === 'card' && (
                <div className="payment-fields">
                  <div className="form-group">
                    <label className="form-label">Card Holder Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. John Doe" 
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="1234567891011121" 
                      maxLength="16"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      required 
                    />
                    <span className="input-tip">Enter your 16 digit card number</span>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="MM/YY" 
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required 
                      />
                      <span className="input-tip">Format: MM/YY or MMYY</span>
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="•••" 
                        maxLength="4"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required 
                      />
                      <span className="input-tip">3 or 4 digits</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="payment-fields">
                  <div className="form-group">
                    <label className="form-label">UPI ID / VPA</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. name@upi" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required 
                    />
                    <span className="input-tip">Format: username@bank</span>
                  </div>
                  <div className="upi-qr-mock">
                    <div className="mock-qr-code"></div>
                    <span className="input-tip">Scan QR Code or proceed using UPI ID</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="payment-fields cod-info">
                  <div className="cod-info-icon">💵</div>
                  <p>You have chosen <strong>Cash on Delivery</strong>.</p>
                  <p className="input-tip">Please ensure you have exact change of ₹{activePaymentOrder.amount.toFixed(2)} when the rider delivers your food.</p>
                  <p className="input-tip" style={{ marginTop: '0.5rem', color: 'var(--color-accent)' }}>⚠️ Note: Payment will be confirmed by the delivery partner upon cash collection.</p>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActivePaymentOrder(null)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" disabled={loading || paymentProcessing} onClick={handlePayment}>
                  {loading ? 'Processing...' : (paymentMethod === 'cod' ? 'Confirm Order (COD)' : 'Confirm & Pay')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PAYMENT GATEWAY PROCESSING OVERLAY ---------------- */}
      {/* ---------------- PAYMENT GATEWAY PROCESSING OVERLAY & OTP MODAL ---------------- */}
      {paymentProcessing && (
        <div className="modal-overlay gateway-overlay">
          {!otpStep ? (
            <div className="gateway-modal">
              <div className="gateway-spinner"></div>
              <h2>Redirecting to Payment Gateway...</h2>
              <p className="gateway-subtext">Please wait while we securely process your payment.</p>
              <p className="gateway-method">Payment Method: <strong>{paymentMethod.toUpperCase()}</strong></p>
              <div className="gateway-progress-bar">
                <div className="gateway-progress-fill"></div>
              </div>
              <p className="input-tip">Do not close or refresh this page</p>
            </div>
          ) : (
            <div className="modal-content gateway-modal otp-modal" style={{ maxWidth: '400px', background: 'var(--bg-panel)' }}>
              <h2 style={{ background: 'none', webkitTextFillColor: 'initial', webkitBackgroundClip: 'initial', color: 'var(--text-main)', border: 'none', padding: 0 }}>🔐 Secure OTP Verification</h2>
              <p className="gateway-subtext" style={{ marginTop: '0.5rem' }}>
                Please enter the 4-digit Secure OTP sent to your device to authorize this transaction of <strong>₹{activePaymentOrder ? activePaymentOrder.amount.toFixed(2) : '0.00'}</strong>.
              </p>
              
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '0.75rem', margin: '1rem 0', color: 'var(--accent-neon)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                🔑 Testing OTP Code: <span style={{ fontSize: '1.2rem', color: '#fff', letterSpacing: '2px', marginLeft: '4px' }}>{correctOtp}</span>
              </div>

              <div className="form-group" style={{ margin: '1.5rem 0' }}>
                <label className="form-label" style={{ textAlign: 'left' }}>Enter 4-Digit OTP</label>
                <input 
                  type="text" 
                  maxLength="4" 
                  className="form-input" 
                  placeholder="••••" 
                  value={otpInput} 
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', height: '50px' }}
                  disabled={otpVerifying}
                />
              </div>

              <div className="modal-actions" style={{ gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setPaymentProcessing(false);
                    setOtpStep(false);
                    setCorrectOtp('');
                    setOtpInput('');
                  }}
                  disabled={otpVerifying}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleVerifyOtp}
                  disabled={otpVerifying || otpInput.length < 4}
                  style={{ flex: 2 }}
                >
                  {otpVerifying ? 'Verifying...' : 'Verify & Pay'}
                </button>
              </div>

              <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Didn't receive the code?{' '}
                <span 
                  onClick={otpVerifying ? null : handleResendOtp} 
                  style={{ color: 'var(--accent-neon)', cursor: otpVerifying ? 'not-allowed' : 'pointer', fontWeight: '600', textDecoration: 'underline' }}
                >
                  Resend OTP
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- PAYMENT SUCCESS MODAL ---------------- */}
      {paymentSuccess && (
        <div className="modal-overlay success-overlay">
          <div className="modal-content success-modal">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <div className="success-details">
              <div className="success-row">
                <span>Order ID:</span>
                <strong>{paymentSuccess.orderId}...</strong>
              </div>
              <div className="success-row">
                <span>Amount Paid:</span>
                <strong>₹{paymentSuccess.amount.toFixed(2)}</strong>
              </div>
              <div className="success-row">
                <span>Payment Method:</span>
                <strong>{paymentSuccess.method === 'CARD' ? '💳 Credit Card' : '📱 UPI'}</strong>
              </div>
              <div className="success-row">
                <span>Transaction ID:</span>
                <strong className="mono-text">{paymentSuccess.transactionId}</strong>
              </div>
            </div>
            <p className="gateway-subtext">Your order is now being prepared. You can track it in My Orders.</p>
            <button 
              className="btn-primary" 
              onClick={() => { setPaymentSuccess(null); setActiveTab('orders'); }}
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              View My Orders
            </button>
          </div>
        </div>
      )}

      {/* ---------------- CANCEL CONFIRMATION MODAL ---------------- */}
      {cancelConfirmOrder && (
        <div className="modal-overlay cancel-overlay">
          <div className="modal-content cancel-modal" style={{ border: '1px solid #ef4444' }}>
            <div style={{ fontSize: '3rem', textShadow: '0 0 10px rgba(239, 68, 68, 0.4)', marginBottom: '1rem', textAlign: 'center' }}>⚠️</div>
            <h2 style={{ textAlign: 'center', color: '#f87171', background: 'none', webkitTextFillColor: 'initial', webkitBackgroundClip: 'initial' }}>Cancel Order?</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: '1rem 0' }}>
              Are you sure you want to cancel order <strong>#{cancelConfirmOrder.substring(0, 8)}...</strong>? This action cannot be undone.
            </p>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-accent)' }}>
              * If you paid online, a full refund request will be dispatched automatically.
            </p>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setCancelConfirmOrder(null)}>
                No, Keep Order
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ background: '#ef4444' }} 
                onClick={() => handleCancelOrder(cancelConfirmOrder)}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- VIEW RECEIPT / INVOICE MODAL ---------------- */}
      {receiptOrder && (
        <div className="modal-overlay receipt-overlay">
          <div className="modal-content receipt-modal" style={{ maxWidth: '540px', padding: '2.5rem', background: 'var(--bg-panel)' }}>
            <div className="receipt-print-area">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent-neon)' }}>Waffor Foods Receipt</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Saga-Orchestrated Premium Delivery</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                <div>
                  <p><strong>Order ID:</strong> <span className="mono-text">{receiptOrder.orderId}</span></p>
                  <p><strong>Date:</strong> {receiptOrder.createdAt ? new Date(receiptOrder.createdAt).toLocaleString() : 'N/A'}</p>
                  <p><strong>Customer:</strong> {receiptOrder.customerId}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p><strong>Payment Method:</strong> {receiptOrder.paymentMethod || 'N/A'}</p>
                  <p><strong>Payment Status:</strong> {receiptOrder.paymentStatus || 'N/A'}</p>
                  <p><strong>Delivery Driver ID:</strong> {receiptOrder.deliveryPartnerId || 'Pending Assignment'}</p>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', padding: '0.75rem 0', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0' }}>Item Description</th>
                      <th style={{ textAlign: 'center', padding: '0.5rem' }}>Qty</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem 0' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptOrder.itemDetails && receiptOrder.itemDetails.length > 0 ? (
                      receiptOrder.itemDetails.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '0.5rem 0', color: 'var(--text-main)' }}>{item.name}</td>
                          <td style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-muted)' }}>{item.quantity}</td>
                          <td style={{ textAlign: 'right', padding: '0.5rem 0', color: 'var(--text-main)' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ padding: '1rem 0', color: 'var(--text-muted)', textAlign: 'center' }}>
                          {receiptOrder.items}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'flex-end', marginLeft: 'auto', maxWidth: '240px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                  <span>₹{(receiptOrder.amount - (receiptOrder.amount * 0.05)).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST (5%):</span>
                  <span>₹{(receiptOrder.amount * 0.05).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed var(--border-color)', paddingTop: '0.5rem', fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-neon)' }}>
                  <span>Total Amount:</span>
                  <span>₹{receiptOrder.amount.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <p>Thank you for ordering from Waffor Foods!</p>
                <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#10b981' }}>✓ Saga Workflow Execution Status: COMPLETED_SUCCESSFULLY</p>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setReceiptOrder(null)}>
                Close
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ flex: 1 }} 
                onClick={() => {
                  window.print();
                }}
              >
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
