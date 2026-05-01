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
  MessageCircle
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
  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#F5EBE0] animate-pulse">
    <div className="aspect-[4/3] bg-[#F5EBE0]" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-[#F5EBE0] rounded w-3/4" />
      <div className="h-3 bg-[#F5EBE0] rounded w-full" />
      <div className="h-3 bg-[#F5EBE0] rounded w-5/6" />
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

  const t = TRANSLATIONS[lang];

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
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, lang]);

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
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#4A3728] font-sans selection:bg-[#D4A373] selection:text-white">
      
      {/* --- Navbar --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E6D5C3] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-[#F5EBE0] rounded-full transition-colors"
            id="sidebar-toggle"
          >
            <MenuIcon size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-[#6F4E37] hidden sm:block overflow-hidden">
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
            className="w-full pl-10 pr-4 py-2 bg-[#F5EBE0]/50 border border-transparent focus:border-[#D4A373] focus:bg-white rounded-full outline-none transition-all text-sm"
          />
        </div>

        <button 
          onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#6F4E37] text-white rounded-full text-xs font-medium hover:bg-[#5D4037] transition-colors"
        >
          <Globe size={14} />
          {lang === 'en' ? 'አማርኛ' : 'English'}
        </button>
      </header>

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
              className="fixed top-0 left-0 h-full w-72 bg-[#FDFBF7] z-[70] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-[#6F4E37]">{t.sidebarTitle}</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-[#F5EBE0] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                {[
                  { id: 'menu', label: t.menu, icon: Utensils },
                  { id: 'feedback', label: t.feedback, icon: MessageSquare },
                  { id: 'reviews', label: t.reviews, icon: Star },
                  { id: 'contact', label: t.contactUs, icon: Phone },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F5EBE0] text-[#4A3728] font-medium transition-all group"
                  >
                    <item.icon size={20} className="text-[#D4A373] group-hover:scale-110 transition-transform" />
                    {item.label}
                    <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </nav>

              <div className="pt-6 border-t border-[#E6D5C3]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#A68A64] mb-4">{t.socials}</p>
                <div className="flex gap-4">
                  <a href="#" className="p-2 bg-[#F5EBE0] rounded-lg text-[#6F4E37] hover:bg-[#D4A373] hover:text-white transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="p-2 bg-[#F5EBE0] rounded-lg text-[#6F4E37] hover:bg-[#D4A373] hover:text-white transition-all">
                    <Send size={20} />
                  </a>
                  <a href="#" className="p-2 bg-[#F5EBE0] rounded-lg text-[#6F4E37] hover:bg-[#D4A373] hover:text-white transition-all">
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
                className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl pointer-events-auto relative"
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md hover:bg-white rounded-full text-[#6F4E37] shadow-lg transition-all"
                >
                  <X size={20} />
                </button>

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
                      <h2 className="text-2xl font-bold text-[#4A3728]">{selectedItem.name[lang]}</h2>
                    </div>
                    <div className="text-xl font-bold text-[#6F4E37] whitespace-nowrap">
                      {selectedItem.price} {t.priceSuffix}
                    </div>
                  </div>

                  <p className="text-[#A68A64] leading-relaxed">
                    {selectedItem.description[lang]}
                  </p>

                  <div className="pt-4">
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="w-full py-4 bg-[#6F4E37] text-white font-bold rounded-2xl hover:bg-[#5D4037] transition-all shadow-lg shadow-[#6F4E37]/20"
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
        <section id="menu" className="space-y-6">
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
                  <h2 className="text-3xl font-bold text-[#4A3728] mb-2">{t.menu}</h2>
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
              ].map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id 
                    ? 'bg-[#6F4E37] text-white shadow-lg shadow-[#6F4E37]/20' 
                    : 'bg-white border border-[#E6D5C3] text-[#A68A64] hover:border-[#D4A373] hover:text-[#D4A373]'
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-[#F5EBE0] group cursor-pointer"
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
                      <h3 className="font-bold text-[#4A3728] group-hover:text-[#D4A373] transition-colors">
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
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#E6D5C3]">
              <Search size={48} className="mx-auto text-[#E6D5C3] mb-4" />
              <p className="text-[#A68A64] font-medium">No items found matching your search.</p>
            </div>
          )}
        </section>

        {/* --- Reviews Section --- */}
        <section id="reviews" className="bg-[#F5EBE0]/30 rounded-[2.5rem] p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={lang}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-[#4A3728]">{t.reviews}</h2>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-2">
              <StarRating rating={5} size={20} />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <motion.div 
                key={review.id} 
                layout
                className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6D5C3] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#6F4E37]">{review.name}</span>
                  <StarRating rating={review.rating} />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={lang}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm italic text-[#4A3728] leading-relaxed"
                  >
                    "{review.comment[lang]}"
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Feedback & Contact --- */}
        <div className="grid md:grid-cols-2 gap-8">
          <section id="feedback" className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#F5EBE0] space-y-6">
            <h2 className="text-2xl font-bold text-[#4A3728] flex items-center gap-3">
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
                  className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E6D5C3] rounded-xl outline-none focus:border-[#D4A373] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A68A64]">{t.messageLabel}</label>
                <textarea 
                  required
                  rows={4}
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E6D5C3] rounded-xl outline-none focus:border-[#D4A373] transition-all resize-none"
                />
              </div>
              <motion.button 
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={showFeedbackSuccess}
                className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                  showFeedbackSuccess 
                  ? 'bg-green-600 text-white shadow-green-600/20' 
                  : 'bg-[#6F4E37] text-white hover:bg-[#5D4037] shadow-[#6F4E37]/20'
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

          <section id="contact" className="bg-[#6F4E37] p-8 rounded-[2rem] text-white space-y-8 shadow-xl">
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
                  <p className="font-medium">+251 911 123 456</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Mail size={24} className="text-[#D4A373]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#A68A64] mb-1">Email</p>
                  <p className="font-medium">hello@abyssinia.cafe</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-sm italic opacity-80">"Experience the true essence of Ethiopian hospitality in every cup."</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-[#E6D5C3] mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-3 gap-8 items-center text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#6F4E37]">{t.cafeName}</h3>
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
            <p className="text-lg font-bold text-[#6F4E37]">+251 911 123 456</p>
          </div>
        </div>
      </footer>

      {/* --- Go to Top Button --- */}
      <AnimatePresence>
        {showGoToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-8 z-[100] p-4 bg-[#6F4E37] text-white rounded-full shadow-2xl hover:bg-[#5D4037] active:scale-90 transition-all group"
            aria-label="Go to top"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
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

      {/* --- Custom Scrollbar Styles --- */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
