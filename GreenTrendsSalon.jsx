import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DESIGN SYSTEM
   Palette: Deep black + champagne gold + electric emerald
   Fonts: Playfair Display (display) + DM Sans (body)
───────────────────────────────────────────────*/

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:   #060608;
    --surface: #0e0e12;
    --card:    #141418;
    --border:  rgba(255,255,255,0.07);
    --gold:    #c9a84c;
    --gold2:   #f0d07a;
    --green:   #3ddc84;
    --green2:  #00ff88;
    --white:   #f5f0e8;
    --muted:   #888;
    --r:       16px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

  .display { font-family: 'Playfair Display', serif; }

  /* Glassmorphism card */
  .glass {
    background: rgba(255,255,255,0.035);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--border);
    border-radius: var(--r);
  }

  /* Gold gradient text */
  .gold-text {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 50%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .green-text {
    background: linear-gradient(135deg, var(--green) 0%, var(--green2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Noise grain overlay */
  .grain::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  /* Animations */
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(30px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse-gold {
    0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
    50%      { box-shadow: 0 0 0 14px rgba(201,168,76,0); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes glow-green {
    0%,100% { box-shadow: 0 0 20px rgba(61,220,132,0.3); }
    50%      { box-shadow: 0 0 40px rgba(61,220,132,0.6); }
  }

  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .delay-1 { animation-delay: 0.1s; opacity:0; }
  .delay-2 { animation-delay: 0.2s; opacity:0; }
  .delay-3 { animation-delay: 0.35s; opacity:0; }
  .delay-4 { animation-delay: 0.5s; opacity:0; }

  /* Buttons */
  .btn-gold {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--gold), var(--gold2), var(--gold));
    background-size: 200% 100%;
    color: #000;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.04em;
    padding: 14px 28px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    animation: shimmer 3s infinite linear;
  }
  .btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(201,168,76,0.4);
  }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent;
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    padding: 13px 28px;
    border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.25);
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    backdrop-filter: blur(10px);
  }
  .btn-ghost:hover {
    border-color: var(--green);
    color: var(--green);
    background: rgba(61,220,132,0.07);
    transform: translateY(-2px);
  }

  .btn-green {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #25d366, #128c7e);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 15px 32px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    animation: glow-green 2.5s infinite;
  }
  .btn-green:hover { transform: translateY(-2px) scale(1.03); }

  /* Section titles */
  .section-label {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px;
  }
  .section-label::before {
    content: '';
    display: block;
    width: 28px; height: 1px;
    background: var(--gold);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .section-sub {
    color: var(--muted);
    font-size: 1rem;
    max-width: 520px;
    line-height: 1.7;
  }

  /* Service Card */
  .service-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--r);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
    position: relative;
  }
  .service-card:hover {
    transform: translateY(-6px);
    border-color: rgba(201,168,76,0.35);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .service-card:hover .service-overlay {
    opacity: 1;
  }
  .service-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%);
    opacity: 0.6;
    transition: opacity 0.4s ease;
  }

  /* Review stars */
  .stars { color: #f59e0b; letter-spacing: 2px; font-size: 0.85rem; }

  /* Input */
  .field {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .field:focus { border-color: var(--gold); }
  .field::placeholder { color: var(--muted); }
  option { background: #1a1a22; }

  /* Sticky WhatsApp */
  .wa-sticky {
    position: fixed;
    bottom: 28px; right: 24px;
    z-index: 999;
    width: 58px; height: 58px;
    background: #25d366;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(37,211,102,0.5);
    cursor: pointer;
    animation: pulse-gold 2.5s infinite, float 3s ease-in-out infinite;
    text-decoration: none;
    transition: transform 0.2s;
  }
  .wa-sticky:hover { transform: scale(1.12); }

  /* Sticky Book btn */
  .sticky-book {
    position: fixed;
    bottom: 28px; left: 24px;
    z-index: 999;
    animation: pulse-gold 3s infinite;
  }

  /* Nav */
  .nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5%;
    height: 72px;
    transition: all 0.3s ease;
  }
  .nav.scrolled {
    background: rgba(6,6,8,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a {
    color: rgba(245,240,232,0.7);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--gold); }

  /* Offer banner */
  .offer-marquee {
    background: linear-gradient(90deg, var(--gold), #b8860b, var(--gold));
    padding: 10px 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .marquee-inner {
    display: inline-flex; gap: 60px;
    animation: marquee 22s linear infinite;
  }
  .marquee-item {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #000;
    display: inline-flex; align-items: center; gap: 12px;
  }

  /* Gallery */
  .gallery-track {
    display: flex; gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 8px;
  }
  .gallery-track::-webkit-scrollbar { display: none; }
  .gallery-card {
    flex: 0 0 280px;
    scroll-snap-align: start;
    border-radius: var(--r);
    overflow: hidden;
    position: relative;
    height: 360px;
  }

  /* Feature icon */
  .feature-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
    margin-bottom: 14px;
    background: rgba(201,168,76,0.12);
    border: 1px solid rgba(201,168,76,0.2);
  }

  /* Divider */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 0;
  }

  /* Pricing badge */
  .price-badge {
    display: inline-block;
    background: rgba(61,220,132,0.12);
    border: 1px solid rgba(61,220,132,0.25);
    color: var(--green);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.05em;
  }

  /* Section padding */
  .section { padding: 90px 5%; }
  @media (max-width: 768px) {
    .section { padding: 70px 5%; }
    .nav-links { display: none; }
    .hide-mobile { display: none; }
  }

  /* Map embed */
  .map-container {
    border-radius: var(--r);
    overflow: hidden;
    border: 1px solid var(--border);
    height: 340px;
  }

  /* Membership card */
  .membership-card {
    border-radius: 20px;
    padding: 36px;
    position: relative;
    overflow: hidden;
  }
  .membership-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at top left, rgba(201,168,76,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  /* Ring decoration */
  .ring-deco {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.12);
    pointer-events: none;
  }

  /* Form success */
  @keyframes checkPop {
    0% { transform: scale(0); opacity:0; }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); opacity:1; }
  }

  /* Mobile menu btn */
  .hamburger {
    display: none;
    flex-direction: column; gap: 5px; cursor: pointer;
    padding: 4px;
  }
  .hamburger span {
    display: block; width: 22px; height: 2px;
    background: var(--white); border-radius: 2px;
    transition: all 0.3s;
  }
  @media (max-width: 768px) { .hamburger { display: flex; } }

  .mobile-menu {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(6,6,8,0.97);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 36px;
  }
  .mobile-menu a {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 600;
    color: var(--white); text-decoration: none;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--gold); }

  /* Tab selector */
  .tab-btn {
    padding: 9px 22px;
    border-radius: 50px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500;
    cursor: pointer;
    transition: all 0.25s;
  }
  .tab-btn.active {
    background: var(--gold);
    color: #000;
    border-color: var(--gold);
    font-weight: 600;
  }

  /* AI reco card */
  .ai-card {
    background: linear-gradient(135deg, rgba(61,220,132,0.08), rgba(61,220,132,0.02));
    border: 1px solid rgba(61,220,132,0.2);
    border-radius: var(--r);
    padding: 20px;
    transition: all 0.3s;
  }
  .ai-card:hover {
    border-color: rgba(61,220,132,0.5);
    transform: translateY(-3px);
  }
`;

/* ─── DATA ───────────────────────────────────── */

const SERVICES = [
  {
    category: "Hair",
    emoji: "✂️",
    gradient: "linear-gradient(135deg,#1a0a2e,#2d1b4e)",
    items: [
      { name: "Haircut & Styling", price: "₹299–₹699", desc: "Precision cuts for all hair types" },
      { name: "Hair Coloring", price: "₹799–₹3999", desc: "Global, highlights & balayage" },
      { name: "Keratin Treatment", price: "₹2499–₹5999", desc: "Frizz-free smooth hair for months" },
      { name: "Hair Spa", price: "₹599–₹1499", desc: "Deep conditioning & scalp therapy" },
    ],
  },
  {
    category: "Skin",
    emoji: "✨",
    gradient: "linear-gradient(135deg,#0a1a0e,#0d2e1a)",
    items: [
      { name: "Facial & Skin Care", price: "₹499–₹1999", desc: "Glow facials & anti-aging treatments" },
      { name: "De-Tan Treatment", price: "₹399–₹999", desc: "Instant brightening & tan removal" },
      { name: "Clean-Up", price: "₹299–₹599", desc: "Deep cleanse & blackhead removal" },
    ],
  },
  {
    category: "Grooming",
    emoji: "🪒",
    gradient: "linear-gradient(135deg,#1a1000,#2e1f00)",
    items: [
      { name: "Beard Grooming", price: "₹199–₹499", desc: "Shape, trim & hot towel finish" },
      { name: "Manicure", price: "₹299–₹799", desc: "Nail art & hand care therapy" },
      { name: "Pedicure", price: "₹399–₹999", desc: "Foot spa & nail treatment" },
    ],
  },
  {
    category: "Bridal",
    emoji: "💍",
    gradient: "linear-gradient(135deg,#1a0010,#2e0020)",
    items: [
      { name: "Bridal Makeup", price: "₹4999–₹14999", desc: "Full glam for your special day" },
      { name: "Party Makeup", price: "₹999–₹3499", desc: "Event-ready stunning looks" },
      { name: "Pre-Bridal Package", price: "₹8999–₹24999", desc: "Complete beauty ritual package" },
    ],
  },
];

const REVIEWS = [
  { name: "Priya Sharma", rating: 5, text: "Best salon in the area! My keratin treatment was done so professionally. The staff is very welcoming and the results are amazing. Totally worth every rupee.", time: "2 weeks ago" },
  { name: "Arjun Mehta", rating: 5, text: "Got a haircut and beard grooming here. The stylist really understood what I wanted. The place is super clean and hygienic. Will definitely come back!", time: "1 month ago" },
  { name: "Sneha Gupta", rating: 5, text: "Had my bridal makeup done here and I looked absolutely stunning! The team was patient, professional and the makeup stayed perfect all day. Highly recommend!", time: "3 weeks ago" },
  { name: "Rohit Verma", rating: 5, text: "Amazing experience! Tried the hair spa and my hair feels so healthy now. Great ambience, premium products, and very reasonable pricing.", time: "5 days ago" },
  { name: "Ananya Joshi", rating: 5, text: "The balayage color they did for me turned out better than any reference photo I brought! Certified experts who truly know their craft.", time: "2 months ago" },
];

const WHY = [
  { icon: "🏆", title: "Certified Stylists", desc: "All our professionals are trained & certified by top academies with 5+ years of experience." },
  { icon: "💎", title: "Premium Products", desc: "We use only international salon brands like L'Oréal, Wella, and OGX for best results." },
  { icon: "💰", title: "Affordable Luxury", desc: "Premium quality services at prices designed for everyone — students to professionals." },
  { icon: "🧼", title: "Hygiene First", desc: "Sterilized tools, single-use accessories, and salon-grade sanitization after every client." },
  { icon: "⏰", title: "Zero Wait Time", desc: "Book in advance and we'll be ready for you. Respect for your time is our promise." },
  { icon: "🌟", title: "Personalized Care", desc: "One-on-one consultation before every service to understand your unique style goals." },
];

const OFFERS = [
  "✦ 20% OFF on First Visit  ✦ Free Hair Consultation  ✦ Refer a Friend & Get ₹200 Off  ✦ Student Discount 15%  ✦ Bridal Package Deal Available  ✦ Weekend Combo Offers",
];

const MEMBERSHIPS = [
  { name: "Silver", price: "₹1,999", per: "/ 3 months", perks: ["10% off all services", "Priority booking", "1 free clean-up", "Welcome gift kit"] },
  { name: "Gold", price: "₹3,999", per: "/ 6 months", perks: ["20% off all services", "Priority booking", "2 free facials", "Exclusive member events", "Birthday surprise"], highlight: true },
  { name: "Platinum", price: "₹6,999", per: "/ year", perks: ["30% off all services", "Priority + home call", "Unlimited clean-ups", "Quarterly full package", "VIP member card"] },
];

const BEFORE_AFTER = [
  { label: "Hair Color Transformation", tag: "Balayage", bg: "linear-gradient(135deg,#1a0a2e 0%,#4a1a6e 100%)" },
  { label: "Keratin Smoothening", tag: "Hair Treatment", bg: "linear-gradient(135deg,#0a1a14 0%,#1a4a34 100%)" },
  { label: "Beard Grooming", tag: "Men's Style", bg: "linear-gradient(135deg,#1a1000 0%,#4a3000 100%)" },
  { label: "Bridal Makeover", tag: "Bridal", bg: "linear-gradient(135deg,#1a000e 0%,#4a002e 100%)" },
  { label: "Haircut & Styling", tag: "Women's Cut", bg: "linear-gradient(135deg,#000a1a 0%,#002a4a 100%)" },
];

const AI_RECOS = [
  { service: "Keratin Treatment", match: "98%", reason: "Perfect for frizzy & damaged hair this monsoon season" },
  { service: "Balayage Coloring", match: "95%", reason: "Trending style — low maintenance, high impact look" },
  { service: "Deep Conditioning Spa", match: "91%", reason: "Restore moisture & shine after chemical treatments" },
];

/* ─── COMPONENTS ───────────────────────────── */

function StarRating({ n = 5 }) {
  return <span className="stars">{"★".repeat(n)}</span>;
}

function SectionLabel({ children }) {
  return <p className="section-label">{children}</p>;
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrolled;
}

/* ─── MAIN COMPONENT ──────────────────────── */
export default function GreenTrendsSalon() {
  const scrolled = useScrolled();
  const [activeTab, setActiveTab] = useState("Hair");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "", date: "", time: "" });
  const [submitted, setSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiInput, setAiInput] = useState("");
  const galleryRef = useRef(null);

  const handleBook = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a professional beauty consultant at Green Trends Unisex Salon. A customer describes their hair/skin concern: "${aiInput}". Recommend 2-3 specific salon services from this list: Haircut & Styling, Hair Coloring (Balayage, Highlights, Global), Keratin Treatment, Hair Spa, Deep Conditioning, Facial & Skin Care, De-Tan Treatment, Clean-Up, Beard Grooming, Manicure, Pedicure, Bridal Makeup, Party Makeup. Format your response as:

RECOMMENDATION 1: [Service Name]
WHY: [One sentence explanation]
PRICE: [₹XXX–₹XXXX]

RECOMMENDATION 2: [Service Name]  
WHY: [One sentence explanation]
PRICE: [₹XXX–₹XXXX]

RECOMMENDATION 3 (optional): [Service Name]
WHY: [One sentence explanation]
PRICE: [₹XXX–₹XXXX]

TIP: [One practical beauty tip]

Keep it friendly, professional and concise.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setAiResult(text);
    } catch {
      setAiResult("Unable to load recommendations. Please try again.");
    }
    setAiLoading(false);
  };

  const activeServices = SERVICES.find(s => s.category === activeTab)?.items || [];

  const navLinks = ["Services", "Gallery", "About", "Reviews", "Booking", "Contact"];

  return (
    <>
      <style>{style}</style>

      {/* ── STICKY BUTTONS ── */}
      <a href="https://wa.me/919999999999?text=Hi%20Green%20Trends!%20I%27d%20like%20to%20book%20an%20appointment."
         target="_blank" rel="noreferrer" className="wa-sticky" aria-label="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <div className="sticky-book hide-mobile">
        <a href="#booking" className="btn-gold" style={{ fontSize: "0.82rem", padding: "12px 22px" }}>
          📅 Book Now
        </a>
      </div>

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>✂</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.01em" }}>
            Green <span className="gold-text">Trends</span>
          </span>
        </div>
        <ul className="nav-links">
          {navLinks.map(l => <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>)}
        </ul>
        <a href="#booking" className="btn-gold hide-mobile" style={{ fontSize: "0.82rem", padding: "11px 22px" }}>Book Appointment</a>
        <button className="hamburger" onClick={() => setMobileMenu(true)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      {mobileMenu && (
        <div className="mobile-menu" onClick={() => setMobileMenu(false)}>
          {navLinks.map(l => <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>)}
          <a href="#booking" className="btn-gold">Book Appointment</a>
        </div>
      )}

      {/* ── OFFER BANNER ── */}
      <div className="offer-marquee" style={{ marginTop: 72 }}>
        <div className="marquee-inner">
          {[...OFFERS, ...OFFERS].map((o, i) => (
            <span key={i} className="marquee-item">{o}</span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section id="hero" style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden", background: "var(--black)" }}>
        {/* Background gradient art */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 70% at 80% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(61,220,132,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="ring-deco" style={{ width: 600, height: 600, top: -200, right: -100 }} />
        <div className="ring-deco" style={{ width: 300, height: 300, bottom: 50, left: -50 }} />

        {/* Hero visual */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", overflow: "hidden", opacity: 0.35 }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #0a1a14 60%, #1a1000 100%)" }} />
          {/* Decorative shapes */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${10 + (i * 4.7) % 80}%`,
              top: `${5 + (i * 7.3) % 85}%`,
              width: `${20 + (i * 3) % 60}px`,
              height: `${20 + (i * 3) % 60}px`,
              borderRadius: "50%",
              background: i % 3 === 0 ? "rgba(201,168,76,0.15)" : i % 3 === 1 ? "rgba(61,220,132,0.1)" : "rgba(255,255,255,0.04)",
              animation: `float ${3 + i % 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 2, padding: "0 5%", maxWidth: 700 }}>
          <p className="fade-up delay-1 section-label" style={{ fontSize: "0.75rem" }}>🌟 Premium Unisex Salon · Trusted Since 2018</p>
          <h1 className="fade-up delay-2 display" style={{ fontSize: "clamp(2.6rem,6vw,4.2rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
            Transform Your Look<br />with <span className="gold-text">Expert Styling</span>
          </h1>
          <p className="fade-up delay-3" style={{ color: "rgba(245,240,232,0.6)", fontSize: "1.1rem", marginBottom: 12, lineHeight: 1.7 }}>
            Premium Salon Experience Near You
          </p>
          <p className="fade-up delay-3" style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 36, lineHeight: 1.7, maxWidth: 500 }}>
            From precision haircuts to bridal transformations — experience luxury beauty services tailored just for you.
          </p>
          <div className="fade-up delay-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#booking" className="btn-gold">📅 Book Appointment</a>
            <a href="tel:+919999999999" className="btn-ghost">📞 Call Now</a>
          </div>

          {/* Trust bar */}
          <div className="fade-up delay-4" style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
            {[["2000+", "Happy Clients"], ["15+", "Expert Stylists"], ["6+", "Years of Trust"], ["4.9★", "Google Rating"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 700 }} className="gold-text">{n}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="section" style={{ background: "var(--surface)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>Our Services</SectionLabel>
          <h2 className="section-title display">Everything You <span className="gold-text">Need</span></h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>From everyday grooming to complete makeovers — all under one roof.</p>
        </div>

        {/* Tab selector */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
          {SERVICES.map(s => (
            <button key={s.category} className={`tab-btn ${activeTab === s.category ? "active" : ""}`} onClick={() => setActiveTab(s.category)}>
              {s.emoji} {s.category}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {activeServices.map((item, i) => (
            <div key={i} className="glass" style={{ padding: "24px", borderRadius: "var(--r)", transition: "all 0.3s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ marginBottom: 14, fontSize: "1.8rem" }}>
                {["✂️","🎨","💆","💇","🧖","💅","🪒","👰"][i % 8]}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>{item.name}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 14, lineHeight: 1.6 }}>{item.desc}</p>
              <span className="price-badge">{item.price}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a href="#booking" className="btn-gold">View All Services & Book →</a>
        </div>
      </section>

      <div className="divider" />

      {/* ── AI RECOMMENDATIONS ── */}
      <section id="ai" className="section" style={{ background: "var(--black)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>AI Beauty Advisor</SectionLabel>
          <h2 className="section-title display">
            Get <span className="green-text">Personalized</span> Recommendations
          </h2>
          <p className="section-sub" style={{ margin: "0 auto 36px" }}>
            Describe your hair or skin concern and our AI stylist will suggest the perfect services for you.
          </p>

          <div className="glass" style={{ padding: "28px", marginBottom: 28 }}>
            <textarea
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              className="field"
              rows={3}
              placeholder="E.g. My hair is frizzy, damaged and I want a low-maintenance style for summer..."
              style={{ resize: "vertical", marginBottom: 16 }}
            />
            <button className="btn-green" onClick={handleAI} disabled={aiLoading} style={{ width: "100%", justifyContent: "center" }}>
              {aiLoading ? "🤖 Analyzing your concern..." : "✨ Get AI Recommendations"}
            </button>
          </div>

          {aiResult && (
            <div className="glass" style={{ padding: "28px", textAlign: "left", borderColor: "rgba(61,220,132,0.25)" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--green)", marginBottom: 16, fontWeight: 600, letterSpacing: "0.1em" }}>🤖 AI BEAUTY ADVISOR</p>
              <pre style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.92rem", lineHeight: 1.8, whiteSpace: "pre-wrap", color: "var(--white)" }}>
                {aiResult}
              </pre>
              <a href="#booking" className="btn-gold" style={{ marginTop: 20, display: "inline-flex" }}>Book Recommended Service</a>
            </div>
          )}

          {/* Default AI cards */}
          {!aiResult && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 14, marginTop: 8 }}>
              {AI_RECOS.map((r, i) => (
                <div key={i} className="ai-card">
                  <div style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.85rem", marginBottom: 8 }}>{r.match} Match</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>{r.service}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{r.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="divider" />

      {/* ── GALLERY ── */}
      <section id="gallery" className="section" style={{ background: "var(--surface)", paddingBottom: 60 }}>
        <div style={{ marginBottom: 36 }}>
          <SectionLabel>Transformations</SectionLabel>
          <h2 className="section-title display">Before & <span className="gold-text">After</span></h2>
          <p className="section-sub">Real results from our real clients. See the Green Trends difference.</p>
        </div>
        <div className="gallery-track" ref={galleryRef}>
          {BEFORE_AFTER.map((g, i) => (
            <div key={i} className="gallery-card" style={{ background: g.bg, position: "relative" }}>
              {/* Decorative content inside gallery card */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                {/* Before/After split visual */}
                <div style={{ display: "flex", gap: 0, width: "80%", height: 160, borderRadius: 10, overflow: "hidden", border: "2px solid rgba(255,255,255,0.15)" }}>
                  <div style={{ flex: 1, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.8rem" }}>😐</span>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>BEFORE</span>
                  </div>
                  <div style={{ width: 2, background: "rgba(201,168,76,0.8)" }} />
                  <div style={{ flex: 1, background: "rgba(201,168,76,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.8rem" }}>😍</span>
                    <span style={{ fontSize: "0.6rem", color: "rgba(201,168,76,0.9)", letterSpacing: "0.1em" }}>AFTER</span>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px", background: "linear-gradient(transparent, rgba(0,0,0,0.9))" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", fontWeight: 600 }}>{g.tag}</span>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontWeight: 600, marginTop: 4 }}>{g.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
          <button className="btn-ghost" style={{ fontSize: "0.8rem", padding: "10px 18px" }} onClick={() => galleryRef.current?.scrollBy({ left: -300, behavior: "smooth" })}>← Prev</button>
          <button className="btn-ghost" style={{ fontSize: "0.8rem", padding: "10px 18px" }} onClick={() => galleryRef.current?.scrollBy({ left: 300, behavior: "smooth" })}>Next →</button>
        </div>
      </section>

      <div className="divider" />

      {/* ── WHY CHOOSE US ── */}
      <section id="about" className="section" style={{ background: "var(--black)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <SectionLabel>Why Green Trends</SectionLabel>
            <h2 className="section-title display">The Standard of <span className="gold-text">Excellence</span></h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>
              We don't just style hair — we craft confidence. Every visit is a premium experience designed to leave you looking and feeling your absolute best.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {WHY.map((w, i) => (
              <div key={i} className="glass" style={{ padding: "22px 20px", borderRadius: "var(--r)", transition: "all 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div className="feature-icon">{w.icon}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontWeight: 600, marginBottom: 6 }}>{w.title}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.8rem", lineHeight: 1.6 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── REVIEWS ── */}
      <section id="reviews" className="section" style={{ background: "var(--surface)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>Client Love</SectionLabel>
          <h2 className="section-title display">What Our <span className="gold-text">Clients Say</span></h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>Rated 4.9 ★ on Google by 300+ happy customers</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} className="glass" style={{ padding: "26px", borderRadius: "var(--r)", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `hsl(${i * 45},60%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.1rem" }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{r.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.72rem" }}>{r.time}</div>
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem" }}>🅶</div>
              </div>
              <StarRating n={r.rating} />
              <p style={{ color: "rgba(245,240,232,0.75)", fontSize: "0.87rem", lineHeight: 1.7, marginTop: 10 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── BOOKING ── */}
      <section id="booking" className="section" style={{ background: "var(--black)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <div>
            <SectionLabel>Book Your Visit</SectionLabel>
            <h2 className="section-title display">Reserve Your <span className="gold-text">Slot Today</span></h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>Instant confirmation. No waiting. Just pure salon luxury awaiting you.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[["📍","Location","123 Main Street, Near City Mall, Your Area – 110001"],
                ["📞","Phone","(+91) 99999-99999"],
                ["🕐","Hours","Mon–Sat: 9AM – 9PM  |  Sun: 10AM – 7PM"],
                ["📧","Email","hello@greentrendssalon.com"]].map(([ico, label, val]) => (
                <div key={label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.2rem" }}>{ico}</span>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
                    <div style={{ color: "rgba(245,240,232,0.7)", fontSize: "0.9rem" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://wa.me/919999999999?text=Hi!%20I'd%20like%20to%20book%20an%20appointment%20at%20Green%20Trends%20Salon."
                 target="_blank" rel="noreferrer" className="btn-green">
                💬 Book via WhatsApp
              </a>
              <a href="tel:+919999999999" className="btn-ghost">📞 Call to Book</a>
            </div>
          </div>

          <div className="glass" style={{ padding: "36px", borderRadius: 20 }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "3.5rem", animation: "checkPop 0.5s ease forwards" }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", marginTop: 20, marginBottom: 10 }}>Booking Confirmed!</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 24 }}>We'll call you to confirm your appointment. See you at Green Trends!</p>
                <button className="btn-ghost" onClick={() => setSubmitted(false)}>Book Another</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", marginBottom: 24 }}>Book an Appointment</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input className="field" placeholder="Your Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input className="field" placeholder="Phone Number" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <select className="field" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                    <option value="">Select Service</option>
                    {SERVICES.flatMap(s => s.items.map(item => <option key={item.name} value={item.name}>{s.category}: {item.name}</option>))}
                  </select>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <input className="field" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    <select className="field" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                      <option value="">Select Time</option>
                      {["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: "16px" }} onClick={handleBook}>
                    📅 Confirm Appointment
                  </button>
                  <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--muted)" }}>
                    🔒 Instant confirmation via SMS & WhatsApp
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── MEMBERSHIPS ── */}
      <section id="offers" className="section" style={{ background: "var(--surface)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>Membership Plans</SectionLabel>
          <h2 className="section-title display">Exclusive <span className="gold-text">Membership</span> Benefits</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>Become a member and unlock premium privileges every time you visit.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22, maxWidth: 900, margin: "0 auto" }}>
          {MEMBERSHIPS.map((m, i) => (
            <div key={i} className={`membership-card ${m.highlight ? "" : "glass"}`} style={m.highlight ? { background: "linear-gradient(135deg,#1a1200,#2a1e00)", border: "1px solid rgba(201,168,76,0.5)", position: "relative", overflow: "hidden", borderRadius: 20, padding: 36 } : {}}>
              {m.highlight && <div style={{ position: "absolute", top: 16, right: 16, background: "var(--gold)", color: "#000", fontSize: "0.65rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.1em" }}>POPULAR</div>}
              <div style={{ fontSize: "0.75rem", color: m.highlight ? "var(--gold2)" : "var(--gold)", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 10 }}>{m.name}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.2rem", fontWeight: 700, lineHeight: 1 }} className={m.highlight ? "gold-text" : ""}>{m.price}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 24 }}>{m.per}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {m.perks.map(p => (
                  <div key={p} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: "0.87rem" }}>
                    <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span>
                    <span style={{ color: "rgba(245,240,232,0.8)" }}>{p}</span>
                  </div>
                ))}
              </div>
              <a href="#booking" className={m.highlight ? "btn-gold" : "btn-ghost"} style={{ display: "block", textAlign: "center" }}>
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── MAP ── */}
      <section id="contact" className="section" style={{ background: "var(--black)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionLabel>Find Us</SectionLabel>
          <h2 className="section-title display">We're <span className="gold-text">Right Here</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=salon+near+me&output=embed&z=15"
              width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Green Trends Salon Location"
            />
          </div>
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div className="glass" style={{ padding: "22px", borderRadius: "var(--r)" }}>
                <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>📍</div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Address</div>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>123 Main Street, Near City Mall<br/>Your Area – 110001</div>
              </div>
              <div className="glass" style={{ padding: "22px", borderRadius: "var(--r)" }}>
                <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>🕐</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Opening Hours</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[["Mon – Fri", "9AM – 9PM"], ["Saturday", "9AM – 9PM"], ["Sunday", "10AM – 7PM"], ["Holidays", "10AM – 6PM"]].map(([d, h]) => (
                    <div key={d} style={{ fontSize: "0.83rem" }}>
                      <div style={{ color: "var(--muted)" }}>{d}</div>
                      <div style={{ color: "var(--gold)", fontWeight: 500 }}>{h}</div>
                    </div>
                  ))}
                </div>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn-ghost" style={{ textAlign: "center", justifyContent: "center" }}>
                🗺️ Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#030305", borderTop: "1px solid var(--border)", padding: "52px 5% 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center" }}>✂</div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.1rem" }}>
                Green <span className="gold-text">Trends</span>
              </span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.87rem", lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              Your local premium unisex salon. Transforming looks, building confidence — one client at a time.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["📘", "📸", "📺", "🐦"].map((icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: "1rem", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Services", links: ["Haircut & Styling", "Hair Coloring", "Keratin Treatment", "Bridal Makeup", "Beard Grooming"] },
            { title: "Company", links: ["About Us", "Gallery", "Careers", "Reviews", "Blog"] },
            { title: "Contact", links: ["(+91) 99999-99999", "hello@greentrendssalon.com", "123 Main Street", "Your Area – 110001"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontWeight: 600, marginBottom: 16, fontSize: "0.85rem", color: "var(--gold)", letterSpacing: "0.08em" }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => <span key={l} style={{ color: "var(--muted)", fontSize: "0.85rem", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--white)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>{l}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>© 2025 Green Trends Unisex Salon. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service"].map(l => (
              <a key={l} href="#" style={{ color: "var(--muted)", fontSize: "0.8rem", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
