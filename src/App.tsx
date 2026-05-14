/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Menu as MenuIcon, 
  X, 
  Coffee, 
  Utensils, 
  GlassWater, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Send, 
  MessageSquare,
  Globe,
  ChevronRight,
  ChevronUp,
  Check,
  Sun,
  Moon,
  MessageCircle,
  Heart,
  Share2,
  Twitter,
  Facebook,
  Copy,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

// --- Types ---
type Language = 'en' | 'am';

interface MenuItem {
  id: number;
  name: { en: string; am: string };
  price: number;
  category: 'coffee' | 'juice' | 'food';
  image: string;
  description: { en: string; am: string };
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: { en: string; am: string };
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: { 
      duration: 0.2 
    } 
  }
};

const sectionVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// --- Sample Data ---
const MENU_DATA: MenuItem[] = [
  {
    id: 1,
    name: { en: "Traditional Macchiato", am: "ባህላዊ ማኪያቶ" },
    price: 45,
    category: 'coffee',
    image: "https://picsum.photos/seed/macchiato/400/300",
    description: { en: "Rich espresso with a dollop of foam.", am: "ጥሩ የቡና ጣዕም ያለው ማኪያቶ።" }
  },
  {
    id: 2,
    name: { en: "Ethiopian Spris", am: "የኢትዮጵያ ስፕሪስ" },
    price: 55,
    category: 'juice',
    image: "https://picsum.photos/seed/spris/400/300",
    description: { en: "Layered avocado, mango, and papaya juice.", am: "የአቮካዶ፣ የማንጎ እና የፓፓያ ድብልቅ ጭማቂ።" }
  },
  {
    id: 3,
    name: { en: "Special Firfir", am: "ልዩ ፍርፍር" },
    price: 120,
    category: 'food',
    image: "https://picsum.photos/seed/firfir/400/300",
    description: { en: "Spicy shredded injera with clarified butter.", am: "በቅቤ የተሰራ ጣፋጭ ፍርፍር።" }
  },
  {
    id: 4,
    name: { en: "Caffè Latte", am: "ካፌ ላቴ" },
    price: 60,
    category: 'coffee',
    image: "https://picsum.photos/seed/latte/400/300",
    description: { en: "Smooth espresso with steamed milk.", am: "ለስላሳ የቡና ጣዕም ያለው ላቴ።" }
  },
  {
    id: 5,
    name: { en: "Mango Smoothie", am: "የማንጎ ስሙዝ" },
    price: 65,
    category: 'juice',
    image: "https://picsum.photos/seed/mango/400/300",
    description: { en: "Fresh mango blended with ice.", am: "ትኩስ ማንጎ በበረዶ የተፈጨ።" }
  },
  {
    id: 6,
    name: { en: "Club Sandwich", am: "ክለብ ሳንድዊች" },
    price: 150,
    category: 'food',
    image: "https://picsum.photos/seed/sandwich/400/300",
    description: { en: "Triple-layered chicken and egg sandwich.", am: "የዶሮ እና የእንቁላል ሳንድዊች።" }
  },
  {
    id: 7,
    name: { en: "Black Coffee", am: "ጥቁር ቡና" },
    price: 35,
    category: 'coffee',
    image: "https://picsum.photos/seed/blackcoffee/400/300",
    description: { en: "Pure Ethiopian highland coffee.", am: "ንጹህ የኢትዮጵያ ሀይላንድ ቡና።" }
  },
  {
    id: 8,
    name: { en: "Avocado Juice", am: "የአቮካዶ ጭማቂ" },
    price: 50,
    category: 'juice',
    image: "https://picsum.photos/seed/avocado/400/300",
    description: { en: "Creamy fresh avocado juice.", am: "ለስላሳ የአቮካዶ ጭማቂ።" }
  }
];

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Sara T.",
    rating: 5,
    comment: { en: "Best coffee in town! The atmosphere is amazing.", am: "በከተማው ውስጥ ምርጥ ቡና! ድባቡ በጣም ደስ ይላል።" }
  },
  {
    id: 2,
    name: "Dawit K.",
    rating: 4,
    comment: { en: "Great food and fast service. Highly recommended.", am: "ጥሩ ምግብ እና ፈጣን አገልግሎት። በጣም እመክራለሁ።" }
  },
  {
    id: 3,
    name: "Marta L.",
    rating: 5,
    comment: { en: "The spris is to die for! So fresh.", am: "ስፕሪሱ በጣም ልዩ ነው! በጣም ትኩስ ነው።" }
  }
];

// --- Translations ---
const TRANSLATIONS = {
  en: {
    cafeName: "Abyssinia Premium",
    searchPlaceholder: "Search by name or price...",
    categories: "Categories",
    all: "All",
    coffee: "Coffee",
    juice: "Juice",
    food: "Food",
    feedback: "Feedback",
    contactUs: "Contact Us",
    reviews: "Reviews",
    menu: "Menu",
    nameLabel: "Your Name",
    messageLabel: "Your Message",
    submit: "Submit Feedback",
    location: "Bole Road, Addis Ababa, Ethiopia",
    rights: "All rights reserved.",
    priceSuffix: "ETB",
    sidebarTitle: "Navigation",
    socials: "Follow Us",
    feedbackSuccess: "Thank you for your feedback!",
    favorites: "Favorites",
    noFavorites: "You haven't added any favorites yet.",
    share: "Share",
    linkCopied: "Link copied to clipboard!",
    shareVia: "Share via",
    copyLink: "Copy Link",
  },
  am: {
    cafeName: "አቢሲኒያ ፕሪሚየም",
    searchPlaceholder: "በስም ወይም በዋጋ ይፈልጉ...",
    categories: "ምድቦች",
    all: "ሁሉም",
    coffee: "ቡና",
    juice: "ጭማቂ",
    food: "ምግብ",
    feedback: "አስተያየት",
    contactUs: "ያግኙን",
    reviews: "ግምገማዎች",
    menu: "ሜኑ",
    nameLabel: "የእርስዎ ስም",
    messageLabel: "የእርስዎ መልዕክት",
    submit: "አስተያየት ይላኩ",
    location: "ቦሌ መንገድ፣ አዲስ አበባ፣ ኢትዮጵያ",
    rights: "መብቱ በህግ የተጠበቀ ነው።",
    priceSuffix: "ብር",
    sidebarTitle: "አሰሳ",
    socials: "ይከተሉን",
    feedbackSuccess: "ለአስተያየትዎ እናመሰግናለን!",
    favorites: "ተወዳጆች",
    noFavorites: "ምንም ተወዳጅ ምግብ አልመረጡም።",
    share: "ያጋሩ",
    linkCopied: "ሊንኩ ተገልብጧል!",
    shareVia: "በዚህ ያጋሩ",
    copyLink: "ሊንኩን ቅዳ",
  }
};

// --- Components ---

const StarRating = ({ rating, size = 12 }: { rating: number, size?: number }) => {
  return (
    <div className="flex gap-0.5 text-[#D4A373]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          fill={i < rating ? "currentColor" : "none"} 
          stroke={i < rating ? "none" : "currentColor"}
          className={i >= rating ? "opacity-30" : ""}
        />
      ))}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1A1108] rounded-2xl overflow-hidden shadow-md border border-[#F5EBE0] dark:border-[#2D1F15] relative group">
    {/* Shimmer Effect */}
    <div className="absolute inset-0 z-10 pointer-events-none">
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 dark:via-[#D4A373]/5 to-transparent -skew-x-12"
      />
    </div>

    <div className="relative aspect-[4/3] bg-[#F5EBE0] dark:bg-[#2D1F15]/50 overflow-hidden">
      {/* Mocking action buttons */}
      <div className="absolute top-3 left-3 flex gap-2">
        <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/5" />
        <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/5" />
      </div>
      {/* Mocking price badge */}
      <div className="absolute top-3 right-3 w-16 h-6 rounded-full bg-white/50 dark:bg-white/5" />
    </div>

    <div className="p-4 space-y-3">
      <div className="h-5 bg-[#F5EBE0] dark:bg-[#2D1F15]/50 rounded-lg w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-[#F5EBE0] dark:bg-[#2D1F15]/30 rounded-lg w-full" />
        <div className="h-3 bg-[#F5EBE0] dark:bg-[#2D1F15]/30 rounded-lg w-5/6" />
      </div>
    </div>
  </div>
);

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [activeShareItem, setActiveShareItem] = useState<MenuItem | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Initial load and filter changes simulation
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, lang]);

  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedImage(null);
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredItems = useMemo(() => {
    return MENU_DATA.filter(item => {
      const matchesSearch = 
        item.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.price.toString().includes(searchQuery);
      
      let matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (activeCategory === 'favorites') {
        matchesCategory = favorites.includes(item.id);
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, lang, favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleShare = async (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    
    if (navigator.share) {
      const shareData = {
        title: item.name[lang],
        text: `${item.name[lang]} - ${item.description[lang]}`,
        url: window.location.href,
      };
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
          setActiveShareItem(item);
        }
      }
    } else {
      setActiveShareItem(item);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackName && feedbackMsg) {
      setShowFeedbackSuccess(true);
      setFeedbackName("");
      setFeedbackMsg("");
      setTimeout(() => setShowFeedbackSuccess(false), 3000);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#120C08] text-[#4A3728] dark:text-[#E6D5C3] font-sans selection:bg-[#D4A373] selection:text-white transition-colors duration-300">
      
      {/* --- Navbar --- */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-[#1A1108]/80 backdrop-blur-md border-b border-[#E6D5C3] dark:border-[#2D1F15] px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-[#F5EBE0] dark:hover:bg-[#2D1F15] rounded-full transition-colors text-[#4A3728] dark:text-[#E6D5C3]"
            id="sidebar-toggle"
          >
            <MenuIcon size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-[#6F4E37] dark:text-[#D4A373] hidden sm:block overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={lang}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {t.cafeName}
              </motion.span>
            </AnimatePresence>
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A68A64]" size={18} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F5EBE0]/50 dark:bg-[#2D1F15]/50 border border-transparent focus:border-[#D4A373] focus:bg-white dark:focus:bg-[#2D1F15] rounded-full outline-none transition-all text-sm dark:text-white dark:placeholder-[#A68A64]/70"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 text-[#6F4E37] dark:text-[#D4A373] hover:bg-[#F5EBE0] dark:hover:bg-[#2D1F15] rounded-full transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button 
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#6F4E37] dark:bg-[#D4A373] text-white dark:text-[#120C08] rounded-full text-xs font-bold hover:opacity-90 transition-all"
          >
            <Globe size={14} />
            {lang === 'en' ? 'አማርኛ' : 'English'}
          </button>
        </div>
      </motion.header>

      {/* --- Sidebar --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#FDFBF7] dark:bg-[#1A1108] z-[70] shadow-2xl p-6 flex flex-col border-r dark:border-[#2D1F15]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-[#6F4E37] dark:text-[#D4A373]">{t.sidebarTitle}</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-[#F5EBE0] dark:hover:bg-[#2D1F15] rounded-full transition-colors text-[#4A3728] dark:text-[#E6D5C3]"
                >
                  <X size={20} />
                </button>
              </div>

              <motion.nav 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2 flex-1"
              >
                {[
                  { id: 'menu', label: t.menu, icon: Utensils },
                  { id: 'feedback', label: t.feedback, icon: MessageSquare },
                  { id: 'reviews', label: t.reviews, icon: Star },
                  { id: 'contact', label: t.contactUs, icon: Phone },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    variants={itemVariants}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F5EBE0] dark:hover:bg-[#2D1F15] text-[#4A3728] dark:text-[#E6D5C3] font-medium transition-all group"
                  >
                    <item.icon size={20} className="text-[#D4A373] group-hover:scale-110 transition-transform" />
                    {item.label}
                    <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </motion.nav>

              <div className="pt-6 border-t border-[#E6D5C3] dark:border-[#2D1F15]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#A68A64] mb-4">{t.socials}</p>
                <div className="flex gap-4">
                  <a href="#" className="p-2 bg-[#F5EBE0] dark:bg-[#2D1F15] rounded-lg text-[#6F4E37] dark:text-[#D4A373] hover:bg-[#D4A373] dark:hover:bg-[#6F4E37] hover:text-white transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="p-2 bg-[#F5EBE0] dark:bg-[#2D1F15] rounded-lg text-[#6F4E37] dark:text-[#D4A373] hover:bg-[#D4A373] dark:hover:bg-[#6F4E37] hover:text-white transition-all">
                    <Send size={20} />
                  </a>
                  <a href="#" className="p-2 bg-[#F5EBE0] dark:bg-[#2D1F15] rounded-lg text-[#6F4E37] dark:text-[#D4A373] hover:bg-[#D4A373] dark:hover:bg-[#6F4E37] hover:text-white transition-all">
                    <MessageCircle size={20} />
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- Item Modal --- */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-md"
            />
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-[#1A1108] w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl pointer-events-auto relative border dark:border-[#2D1F15]"
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-[#1A1108]/80 backdrop-blur-md hover:bg-white dark:hover:bg-[#2D1F15] rounded-full text-[#6F4E37] dark:text-[#D4A373] shadow-lg transition-all"
                >
                  <X size={20} />
                </button>
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <button 
                    onClick={(e) => toggleFavorite(e, selectedItem.id)}
                    className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
                      favorites.includes(selectedItem.id)
                      ? 'bg-[#D4A373] text-white'
                      : 'bg-white/80 dark:bg-[#1A1108]/80 text-[#6F4E37] dark:text-[#D4A373] hover:scale-110'
                    }`}
                  >
                    <Heart size={20} fill={favorites.includes(selectedItem.id) ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={(e) => handleShare(e, selectedItem)}
                    className="p-2 bg-white/80 dark:bg-[#1A1108]/80 backdrop-blur-md shadow-lg rounded-full text-[#6F4E37] dark:text-[#D4A373] hover:scale-110 transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                <div className="aspect-video overflow-hidden cursor-zoom-in group">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name[lang]} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onClick={() => setZoomedImage(selectedItem.image)}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                     <Search className="text-white" size={32} />
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#D4A373] text-xs font-bold uppercase tracking-widest">
                        {selectedItem.category === 'coffee' && <Coffee size={14} />}
                        {selectedItem.category === 'juice' && <GlassWater size={14} />}
                        {selectedItem.category === 'food' && <Utensils size={14} />}
                        {t[selectedItem.category]}
                      </div>
                      <h2 className="text-2xl font-bold text-[#4A3728] dark:text-white">{selectedItem.name[lang]}</h2>
                    </div>
                    <div className="text-xl font-bold text-[#6F4E37] dark:text-[#D4A373] whitespace-nowrap">
                      {selectedItem.price} {t.priceSuffix}
                    </div>
                  </div>

                  <p className="text-[#A68A64] leading-relaxed">
                    {selectedItem.description[lang]}
                  </p>

                  <div className="pt-4">
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="w-full py-4 bg-[#6F4E37] dark:bg-[#D4A373] text-white dark:text-[#120C08] font-bold rounded-2xl hover:bg-[#5D4037] dark:hover:opacity-90 transition-all shadow-lg shadow-[#6F4E37]/20"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* --- Hero / Categories --- */}
        <motion.section 
          id="menu" 
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold text-[#4A3728] dark:text-[#E6D5C3] mb-2">{t.menu}</h2>
                  <p className="text-[#A68A64] max-w-md">{t.categories}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {[
                { id: 'all', label: t.all, icon: Globe },
                { id: 'coffee', label: t.coffee, icon: Coffee },
                { id: 'juice', label: t.juice, icon: GlassWater },
                { id: 'food', label: t.food, icon: Utensils },
                { id: 'favorites', label: t.favorites, icon: Heart },
              ].map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id 
                    ? 'bg-[#6F4E37] dark:bg-[#D4A373] text-white dark:text-[#120C08] shadow-lg shadow-[#6F4E37]/20' 
                    : 'bg-white dark:bg-[#1A1108] border border-[#E6D5C3] dark:border-[#2D1F15] text-[#A68A64] hover:border-[#D4A373] hover:text-[#D4A373]'
                  }`}
                >
                  <cat.icon size={16} />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={lang}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {cat.label}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* --- Menu Grid --- */}
          <motion.div 
            layout
            variants={containerVariants}
            initial="hidden"
            animate={isLoading ? "hidden" : "visible"}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    variants={itemVariants}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={itemVariants}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      boxShadow: "0 20px 40px -15px rgba(111, 78, 55, 0.3), 0 10px 20px -10px rgba(0, 0, 0, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 17
                    }}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white dark:bg-[#1A1108] rounded-2xl overflow-hidden shadow-md transition-all border border-[#F5EBE0] dark:border-[#2D1F15] group cursor-pointer"
                  >
                    <div 
                      className="relative aspect-[4/3] overflow-hidden cursor-zoom-in"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(item.image);
                      }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name[lang]} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Action Buttons */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <button
                          onClick={(e) => toggleFavorite(e, item.id)}
                          className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${
                            favorites.includes(item.id)
                            ? 'bg-[#D4A373] text-white'
                            : 'bg-white/80 dark:bg-[#1A1108]/80 text-[#6F4E37] dark:text-[#D4A373] hover:scale-110'
                          }`}
                        >
                          <Heart size={16} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => handleShare(e, item)}
                          className="p-2 bg-white/80 dark:bg-[#1A1108]/80 backdrop-blur-md rounded-full text-[#6F4E37] dark:text-[#D4A373] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#6F4E37]/80 backdrop-blur-sm flex flex-col justify-center p-6 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <p className="text-xs sm:text-sm font-medium leading-relaxed mb-2 line-clamp-4">
                          {item.description[lang]}
                        </p>
                        <p className="text-base sm:text-lg font-bold">
                          {item.price} {t.priceSuffix}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#6F4E37] shadow-sm group-hover:opacity-0 transition-opacity">
                        {item.price} {t.priceSuffix}
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-[#4A3728] dark:text-[#E6D5C3] group-hover:text-[#D4A373] transition-colors">
                        {item.name[lang]}
                      </h3>
                      <p className="text-xs text-[#A68A64] line-clamp-2 leading-relaxed">
                        {item.description[lang]}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-[#1A1108] rounded-3xl border-2 border-dashed border-[#E6D5C3] dark:border-[#2D1F15]">
              {activeCategory === 'favorites' ? (
                <Heart size={48} className="mx-auto text-[#E6D5C3] dark:text-[#2D1F15] mb-4" />
              ) : (
                <Search size={48} className="mx-auto text-[#E6D5C3] dark:text-[#2D1F15] mb-4" />
              )}
              <p className="text-[#A68A64] font-medium">
                {activeCategory === 'favorites' ? t.noFavorites : "No items found matching your search."}
              </p>
            </div>
          )}
        </motion.section>

        {/* --- Reviews Section --- */}
        <motion.section 
          id="reviews" 
          className="bg-[#F5EBE0]/30 dark:bg-[#1A1108]/50 rounded-[2.5rem] p-8 sm:p-12 space-y-8 transition-colors duration-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <div className="text-center space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={lang}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-[#4A3728] dark:text-[#E6D5C3]">{t.reviews}</h2>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-2">
              <StarRating rating={5} size={20} />
            </div>
          </div>
          <motion.div 
            variants={containerVariants}
            className="grid sm:grid-cols-3 gap-6"
          >
            {REVIEWS.map((review) => (
              <motion.div 
                key={review.id} 
                layout
                variants={itemVariants}
                className="bg-white dark:bg-[#1A1108] p-6 rounded-2xl shadow-sm border border-[#E6D5C3] dark:border-[#2D1F15] space-y-4 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#6F4E37] dark:text-[#D4A373]">{review.name}</span>
                  <StarRating rating={review.rating} />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={lang}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm italic text-[#4A3728] dark:text-[#E6D5C3] leading-relaxed"
                  >
                    "{review.comment[lang]}"
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* --- Feedback & Contact --- */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <section id="feedback" className="bg-white dark:bg-[#1A1108] p-8 rounded-[2rem] shadow-sm border border-[#F5EBE0] dark:border-[#2D1F15] space-y-6 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-[#4A3728] dark:text-[#E6D5C3] flex items-center gap-3">
              <MessageSquare className="text-[#D4A373]" />
              {t.feedback}
            </h2>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A68A64]">{t.nameLabel}</label>
                <input 
                  type="text" 
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-[#120C08] border border-[#E6D5C3] dark:border-[#2D1F15] rounded-xl outline-none focus:border-[#D4A373] transition-all dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A68A64]">{t.messageLabel}</label>
                <textarea 
                  required
                  rows={4}
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-[#120C08] border border-[#E6D5C3] dark:border-[#2D1F15] rounded-xl outline-none focus:border-[#D4A373] transition-all resize-none dark:text-white"
                />
              </div>
              <motion.button 
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={showFeedbackSuccess}
                className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                  showFeedbackSuccess 
                  ? 'bg-green-600 text-white shadow-green-600/20' 
                  : 'bg-[#6F4E37] dark:bg-[#D4A373] text-white dark:text-[#120C08] hover:bg-[#5D4037] dark:hover:opacity-90 shadow-[#6F4E37]/20 transition-all duration-300'
                }`}
              >
                <AnimatePresence mode="wait">
                  {showFeedbackSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={20} />
                      {t.feedbackSuccess}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {t.submit}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </section>

          <section id="contact" className="bg-[#6F4E37] dark:bg-[#1A1108] p-8 rounded-[2rem] text-white space-y-8 shadow-xl border dark:border-[#2D1F15] transition-colors duration-300">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Phone className="text-[#D4A373]" />
              {t.contactUs}
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <MapPin size={24} className="text-[#D4A373]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#A68A64] mb-1">Location</p>
                  <p className="font-medium">{t.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Phone size={24} className="text-[#D4A373]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#A68A64] mb-1">Phone</p>
                  <p className="font-medium text-[#D4A373]">+251 911 123 456</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Mail size={24} className="text-[#D4A373]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#A68A64] mb-1">Email</p>
                  <p className="font-medium text-[#D4A373]">hello@abyssinia.cafe</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <div className="bg-white/5 dark:bg-[#120C08]/50 p-6 rounded-2xl border border-white/10 dark:border-[#2D1F15]">
                <p className="text-sm italic opacity-80">"Experience the true essence of Ethiopian hospitality in every cup."</p>
              </div>
            </div>
          </section>
        </motion.div>
      </main>

      {/* --- Footer --- */}
      <motion.footer 
        className="bg-white dark:bg-[#1A1108] border-t border-[#E6D5C3] dark:border-[#2D1F15] mt-20 py-12 transition-colors duration-300"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-3 gap-8 items-center text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#6F4E37] dark:text-[#D4A373]">{t.cafeName}</h3>
            <p className="text-sm text-[#A68A64]">
              © {new Date().getFullYear()} {t.cafeName}. {t.rights}
            </p>
          </div>
          
          <div className="flex justify-center gap-6">
            <a href="#" className="text-[#A68A64] hover:text-[#D4A373] transition-colors"><Instagram size={24} /></a>
            <a href="#" className="text-[#A68A64] hover:text-[#D4A373] transition-colors"><Send size={24} /></a>
            <a href="#" className="text-[#A68A64] hover:text-[#D4A373] transition-colors"><MessageCircle size={24} /></a>
          </div>

          <div className="sm:text-right space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#A68A64]">Order Now</p>
            <p className="text-lg font-bold text-[#6F4E37] dark:text-[#D4A373]">+251 911 123 456</p>
          </div>
        </div>
      </motion.footer>

      {/* --- Go to Top Button --- */}
      <AnimatePresence>
        {showGoToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 30 }}
            whileHover={{ y: -8, scale: 1.1 }}
            whileTap={{ scale: 0.9, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 17
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-8 z-[100] p-4 bg-[#6F4E37] dark:bg-[#D4A373] text-white dark:text-[#120C08] rounded-full shadow-2xl hover:bg-[#5D4037] dark:hover:opacity-90 transition-all group"
            aria-label="Go to top"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- Zoomed Image Overlay --- */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center overflow-hidden touch-none"
            onClick={() => setZoomedImage(null)}
          >
            <motion.button 
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setZoomedImage(null);
              }}
              className="absolute top-6 right-6 z-[210] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/20"
            >
              <X size={24} />
            </motion.button>

            <div className="w-full h-full flex items-center justify-center p-4">
              <QuickPinchZoom
                onUpdate={({ x, y, scale }) => {
                  const el = document.getElementById('zoom-img-target');
                  if (el) {
                    el.style.transform = make3dTransformValue({ x, y, scale });
                  }
                }}
                tapZoomFactor={2}
                draggableUnZoomed={false}
              >
                <div 
                  className="flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img
                    id="zoom-img-target"
                    src={zoomedImage}
                    alt="Zoomed menu item"
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl will-change-transform"
                    style={{
                      userSelect: 'none',
                    }}
                  />
                </div>
              </QuickPinchZoom>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium whitespace-nowrap bg-white/5 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10 pointer-events-none">
              Pinch to zoom • Drag to pan • Esc to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Share Sheet (Advanced UI) --- */}
      <AnimatePresence>
        {activeShareItem && (
          <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveShareItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#1A1108] rounded-t-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-t sm:border dark:border-[#2D1F15] p-8 sm:p-10 space-y-8"
            >
              {/* Drag Handle for Mobile */}
              <div className="w-12 h-1.5 bg-[#E6D5C3] dark:bg-[#2D1F15] rounded-full mx-auto -mt-2 mb-6 sm:hidden" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-[#6F4E37] dark:text-[#D4A373] tracking-tight">{t.share}</h3>
                  <p className="text-sm text-[#A68A64] font-medium">{t.shareVia} social media</p>
                </div>
                <button 
                  onClick={() => setActiveShareItem(null)}
                  className="p-3 hover:bg-[#F5EBE0] dark:hover:bg-[#2D1F15] rounded-full transition-colors text-[#4A3728] dark:text-[#E6D5C3]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Item Preview Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-5 bg-[#FDFBF7] dark:bg-[#120C08] p-5 rounded-3xl border border-[#F5EBE0] dark:border-[#2D1F15] shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-[#D4A373]/10" />
                <div className="relative">
                  <img 
                    src={activeShareItem.image} 
                    alt={activeShareItem.name[lang]} 
                    className="w-20 h-20 rounded-2xl object-cover shadow-md transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-[#6F4E37] text-white p-1.5 rounded-lg">
                    <Share2 size={12} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black text-[#4A3728] dark:text-[#E6D5C3] truncate">{activeShareItem.name[lang]}</p>
                  <p className="text-xs text-[#A68A64] font-medium uppercase tracking-widest">{activeShareItem.category}</p>
                  <p className="text-sm text-[#6F4E37] dark:text-[#A68A64] line-clamp-1 mt-1 font-medium">{activeShareItem.description[lang]}</p>
                </div>
              </motion.div>

              {/* Share Options Grid */}
              <div className="grid grid-cols-4 gap-4 sm:gap-6">
                {[
                  { id: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25D366]/10 text-[#25D366]', url: `https://wa.me/?text=${encodeURIComponent(activeShareItem.name[lang] + ' ' + window.location.href)}` },
                  { id: 'X (Twitter)', icon: Twitter, color: 'bg-black/10 dark:bg-white/10 text-black dark:text-white', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(activeShareItem.name[lang])}&url=${encodeURIComponent(window.location.href)}` },
                  { id: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]/10 text-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                  { id: 'Browser', icon: ExternalLink, color: 'bg-[#FF4500]/10 text-[#FF4500]', url: window.location.href },
                ].map((option, idx) => (
                  <motion.a
                    key={option.id}
                    href={option.id === 'Browser' ? undefined : option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      if (option.id === 'Browser') {
                        e.preventDefault();
                        window.open(window.location.href, '_blank');
                      }
                    }}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-3xl ${option.color} transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:ring-4 group-hover:ring-current/10 bg-opacity-20`}>
                      <option.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#4A3728] dark:text-[#E6D5C3] text-center">{option.id}</span>
                  </motion.a>
                ))}
              </div>

              {/* Copy Link Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A68A64]">{t.copyLink}</p>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#A68A64]">
                    <Copy size={16} />
                  </div>
                  <input 
                    readOnly 
                    value={window.location.href}
                    className="w-full pl-12 pr-12 py-4 bg-[#F5EBE0]/20 dark:bg-[#120C08] border-2 border-[#F5EBE0] dark:border-[#2D1F15] rounded-3xl text-sm font-bold text-[#6F4E37] dark:text-[#A68A64] outline-none transition-all focus:border-[#D4A373]"
                  />
                  <button 
                    onClick={() => {
                      copyToClipboard(window.location.href);
                      setActiveShareItem(null);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#4A3728] text-white rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95"
                  >
                    {lang === 'en' ? 'COPY' : 'ቅዳ'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Share Toast --- */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[500] bg-[#6F4E37] dark:bg-[#D4A373] text-white dark:text-[#120C08] px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 font-bold min-w-[280px] border border-white/10"
          >
            <div className="p-2 bg-white/20 rounded-full">
              <Check size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm">{t.linkCopied}</p>
              <motion.div 
                className="h-1 bg-white/30 rounded-full mt-2 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              >
                <div className="h-full bg-white w-full" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Custom Scrollbar Styles --- */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
