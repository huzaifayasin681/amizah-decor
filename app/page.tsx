"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Star,
  Truck,
  Shield,
  Headphones,
  Minus,
  Plus,
  Trash2,
  ChevronRight,
  ArrowRight,
  Mail,
  Globe,
  Building2,
  Phone,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — Products & Categories
   ═══════════════════════════════════════════════════════════════════════════ */

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const CATEGORIES = ["All", "Wall Art", "Lighting", "Furniture", "Decor"];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Golden Antler Centerpiece",
    price: 49,
    category: "Decor",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&q=80",
    rating: 4.8,
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Nordic Ceramic Vase Set",
    price: 35,
    category: "Decor",
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&h=600&fit=crop&q=80",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Crystal Chandelier Lamp",
    price: 99,
    category: "Lighting",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&h=600&fit=crop&q=80",
    rating: 4.9,
    badge: "Premium",
  },
  {
    id: 4,
    name: "Velvet Lounge Chair",
    price: 169,
    category: "Furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&q=80",
    rating: 4.7,
    badge: "New",
  },
  {
    id: 5,
    name: "Geometric Wall Mirror",
    price: 65,
    category: "Wall Art",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=600&fit=crop&q=80",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Marble Table Lamp",
    price: 59,
    category: "Lighting",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop&q=80",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Abstract Canvas Trio",
    price: 79,
    category: "Wall Art",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop&q=80",
    rating: 4.8,
    badge: "Trending",
  },
  {
    id: 8,
    name: "Rattan Accent Chair",
    price: 139,
    category: "Furniture",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop&q=80",
    rating: 4.6,
  },
  {
    id: 9,
    name: "Brass Pendant Light",
    price: 52,
    category: "Lighting",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop&q=80",
    rating: 4.3,
  },
  {
    id: 10,
    name: "Woven Macramé Wall Hanging",
    price: 32,
    category: "Wall Art",
    image:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&h=600&fit=crop&q=80",
    rating: 4.7,
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Ayesha Malik",
    location: "Lahore",
    rating: 5,
    text: "The quality is absolutely exceptional. The Golden Antler Centerpiece became the crown jewel of my living room. Truly luxurious.",
    avatar: "A",
  },
  {
    id: 2,
    name: "Faizan Ahmed",
    location: "Karachi",
    rating: 5,
    text: "Impeccable packaging and fast delivery. The Crystal Chandelier Lamp transformed the entire ambiance of our dining space.",
    avatar: "F",
  },
  {
    id: 3,
    name: "Sara Khan",
    location: "Islamabad",
    rating: 4,
    text: "Amizah Group understands luxury. Every piece feels curated and premium. The Velvet Lounge Chair is incredibly comfortable.",
    avatar: "S",
  },
];

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Shop", href: "#shop" },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
              : "text-[var(--color-stone-light)]/30"
          }
        />
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  /* ── State ── */
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  /* ── Scroll listener ── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Lock body scroll when drawer/menu open ── */
  useEffect(() => {
    document.body.style.overflow =
      isCartOpen || isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isMobileMenuOpen]);

  /* ── Cart helpers ── */
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1200);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ── Filtered products ── */
  const filteredProducts =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* ───────────── TOP BAR ───────────── */}
      <div className="bg-[var(--color-charcoal)] text-[var(--color-cream)] text-center text-xs sm:text-sm tracking-widest py-2.5 font-[var(--font-body)]">
        ✦ Free Shipping on Orders Above $50 — Delivering to USA & UK ✦
      </div>

      {/* ───────────── NAVBAR ───────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.06)] py-3"
          : "bg-transparent py-5"
          }`}
        style={{ marginTop: isScrolled ? 0 : "2.375rem" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 group"
          >
            <span
              className={`font-[var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-[var(--color-charcoal)]" : "text-white"
                }`}
            >
              Amizah
            </span>
            <span
              className={`font-[var(--font-heading)] text-2xl sm:text-3xl font-light tracking-tight transition-colors duration-300 ${isScrolled ? "text-[var(--color-gold)]" : "text-[var(--color-gold-light)]"
                }`}
            >
              Group
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-[var(--color-gold)] ${isScrolled
                  ? "text-[var(--color-stone)]"
                  : "text-white/90"
                  }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side: Cart + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-all duration-300 hover:bg-[var(--color-gold)]/10 ${isScrolled ? "text-[var(--color-charcoal)]" : "text-white"
                }`}
              aria-label="Open cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--color-gold)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-all duration-300 hover:bg-[var(--color-gold)]/10 ${isScrolled ? "text-[var(--color-charcoal)]" : "text-white"
                }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ───────────── MOBILE MENU ───────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl animate-slide-in-right flex flex-col pt-24 px-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 text-lg font-medium text-[var(--color-stone)] border-b border-[var(--color-cream-dark)] hover:text-[var(--color-gold)] transition-colors font-[var(--font-heading)]"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-auto pb-8">
              <p className="text-xs text-[var(--color-stone-light)] tracking-wide">
                © 2026 Amizah Group
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ───────────── HERO SECTION ───────────── */}
      <section
        id="home"
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop&q=80')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-[var(--color-gold-light)] text-sm sm:text-base tracking-[0.35em] uppercase mb-6 animate-fade-in-up font-[var(--font-body)]">
            Luxury Home Decor Collection
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6 animate-fade-in-up anim-delay-100 font-[var(--font-heading)]">
            Redefine Your
            <br />
            <span className="text-[var(--color-gold-light)]">Space</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 animate-fade-in-up anim-delay-200 font-[var(--font-body)] leading-relaxed">
            Discover artisan-crafted furniture, designer lighting, and curated
            décor pieces that transform your home into a masterpiece.
          </p>
          <a
            href="#shop"
            className="inline-flex items-center gap-3 bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-white px-10 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgba(184,134,11,0.35)] animate-fade-in-up anim-delay-300 font-[var(--font-body)]"
          >
            Shop Now
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up anim-delay-400">
          <span className="text-white/40 text-xs tracking-widest uppercase font-[var(--font-body)]">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ───────────── SHOP SECTION ───────────── */}
      <section id="shop" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-14">
            <p className="text-[var(--color-gold)] text-sm tracking-[0.3em] uppercase mb-3 font-[var(--font-body)]">
              Curated Collection
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal)] font-[var(--font-heading)]">
              Our Finest Pieces
            </h2>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 font-[var(--font-body)] ${activeCategory === cat
                  ? "bg-[var(--color-charcoal)] text-white shadow-lg"
                  : "bg-white text-[var(--color-stone)] hover:bg-[var(--color-charcoal)] hover:text-white border border-[var(--color-cream-dark)]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--color-cream-dark)]"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[var(--color-cream)]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-[var(--color-gold)] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {/* Quick add overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => addToCart(product)}
                      className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 translate-y-4 group-hover:translate-y-0 font-[var(--font-body)] ${addedProductId === product.id
                        ? "bg-green-600 text-white"
                        : "bg-white text-[var(--color-charcoal)] hover:bg-[var(--color-gold)] hover:text-white"
                        }`}
                    >
                      {addedProductId === product.id
                        ? "✓ Added"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-[10px] text-[var(--color-gold)] tracking-[0.2em] uppercase mb-1 font-[var(--font-body)]">
                    {product.category}
                  </p>
                  <h3 className="text-base font-semibold text-[var(--color-charcoal)] mb-2 font-[var(--font-heading)] leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--color-charcoal)] font-[var(--font-body)]">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center gap-1">
                      <StarRating rating={product.rating} size={12} />
                      <span className="text-xs text-[var(--color-stone-light)] ml-1">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FEATURES SECTION ───────────── */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {[
            {
              Icon: Truck,
              title: "Free Shipping",
              desc: "Complimentary delivery on all orders above $50 across the USA & UK.",
            },
            {
              Icon: Shield,
              title: "Premium Quality",
              desc: "Every piece is handpicked and quality-checked for lasting elegance.",
            },
            {
              Icon: Headphones,
              title: "24/7 Support",
              desc: "Our dedicated team is always available to assist you with any query.",
            },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-cream)] text-[var(--color-gold)] mb-5 group-hover:bg-[var(--color-gold)] group-hover:text-white transition-all duration-300">
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2 font-[var(--font-heading)]">
                {title}
              </h3>
              <p className="text-sm text-[var(--color-stone-light)] leading-relaxed font-[var(--font-body)]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── TESTIMONIALS ───────────── */}
      <section
        id="reviews"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[var(--color-cream)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--color-gold)] text-sm tracking-[0.3em] uppercase mb-3 font-[var(--font-body)]">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal)] font-[var(--font-heading)]">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-[var(--color-cream-dark)]"
              >
                <StarRating rating={t.rating} size={16} />
                <p className="mt-5 text-[var(--color-stone)] leading-relaxed text-[15px] font-[var(--font-body)] italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-charcoal)] text-white flex items-center justify-center text-sm font-bold font-[var(--font-heading)]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-charcoal)] font-[var(--font-heading)]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[var(--color-stone-light)]">
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── ABOUT / CTA BANNER ───────────── */}
      <section
        id="about"
        className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&h=800&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[var(--color-charcoal)]/85" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-[var(--color-gold-light)] text-sm tracking-[0.3em] uppercase mb-4 font-[var(--font-body)]">
            About Amizah Group
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 font-[var(--font-heading)] leading-tight">
            International Luxury,
            <br />
            Delivered Worldwide
          </h2>
          <p className="text-white/70 leading-relaxed mb-8 font-[var(--font-body)] max-w-2xl mx-auto">
            Amizah Group is an international e-commerce and decor brand focused
            on modern luxury interiors. The company operates through registered
            entities in the USA and UK.
          </p>

          {/* Entity cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Building2 size={18} className="text-[var(--color-gold-light)]" />
                <h3 className="text-white font-semibold font-[var(--font-heading)] text-lg">Amizah LLC</h3>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                <Globe size={14} />
                <span>United States</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Building2 size={18} className="text-[var(--color-gold-light)]" />
                <h3 className="text-white font-semibold font-[var(--font-heading)] text-lg">Amizah Ltd</h3>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                <Globe size={14} />
                <span>United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/60 text-sm mb-8 font-[var(--font-body)]">
            <a href="mailto:jawad@amizahgroup.com" className="inline-flex items-center gap-2 hover:text-[var(--color-gold-light)] transition-colors">
              <Mail size={15} className="text-[var(--color-gold-light)]" />
              jawad@amizahgroup.com
            </a>
            <a href="tel:+971544770758" className="inline-flex items-center gap-2 hover:text-[var(--color-gold-light)] transition-colors">
              <Phone size={15} className="text-[var(--color-gold-light)]" />
              +971 544 770 758
            </a>
          </div>

          <a
            href="#shop"
            className="inline-flex items-center gap-3 border-2 border-[var(--color-gold-light)] text-[var(--color-gold-light)] hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] hover:text-white px-10 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 font-[var(--font-body)]"
          >
            Explore Collection
            <ChevronRight size={18} />
          </a>
        </div>
      </section>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="bg-[var(--color-charcoal)] text-white/80 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            {/* Brand */}
            <div>
              <span className="font-[var(--font-heading)] text-2xl text-white font-bold tracking-tight">
                Amizah{" "}
                <span className="font-light text-[var(--color-gold-light)]">
                  Group
                </span>
              </span>
              <p className="mt-4 text-sm leading-relaxed text-white/50 font-[var(--font-body)]">
                International e-commerce and decor brand focused on modern
                luxury interiors. Operating in the USA & UK.
              </p>
              <a
                href="mailto:jawad@amizahgroup.com"
                className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--color-gold-light)] hover:text-white transition-colors font-[var(--font-body)]"
              >
                <Mail size={14} />
                jawad@amizahgroup.com
              </a>
              <a
                href="tel:+971544770758"
                className="inline-flex items-center gap-2 mt-2 text-sm text-[var(--color-gold-light)] hover:text-white transition-colors font-[var(--font-body)]"
              >
                <Phone size={14} />
                +971 544 770 758
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white tracking-widest uppercase mb-5 font-[var(--font-heading)]">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-[var(--color-gold-light)] transition-colors duration-300 font-[var(--font-body)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold text-white tracking-widest uppercase mb-5 font-[var(--font-heading)]">
                Categories
              </h4>
              <ul className="space-y-3">
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <li key={cat}>
                    <a
                      href="#shop"
                      onClick={() => setActiveCategory(cat)}
                      className="text-sm text-white/50 hover:text-[var(--color-gold-light)] transition-colors duration-300 font-[var(--font-body)]"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Info */}
            <div>
              <h4 className="text-sm font-semibold text-white tracking-widest uppercase mb-5 font-[var(--font-heading)]">
                Company Info
              </h4>
              <ul className="space-y-4">
                <li>
                  <p className="text-sm text-white/70 font-semibold font-[var(--font-heading)]">Amizah LLC</p>
                  <p className="text-xs text-white/40 font-[var(--font-body)]">United States</p>
                </li>
                <li>
                  <p className="text-sm text-white/70 font-semibold font-[var(--font-heading)]">Amizah Ltd</p>
                  <p className="text-xs text-white/40 font-[var(--font-body)]">United Kingdom</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider + copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40 tracking-wide font-[var(--font-body)]">
              © 2026 Amizah Group. All rights reserved.
            </p>
            <p className="text-xs text-white/40 tracking-wide font-[var(--font-body)]">
              Operational in USA & UK
            </p>
          </div>
        </div>
      </footer>

      {/* ───────────── CART DRAWER ───────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setIsCartOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-cream-dark)]">
              <h2 className="text-xl font-bold text-[var(--color-charcoal)] font-[var(--font-heading)]">
                Your Cart
                <span className="text-sm font-normal text-[var(--color-stone-light)] ml-2">
                  ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--color-cream)] transition-colors"
                aria-label="Close cart"
              >
                <X size={20} className="text-[var(--color-stone)]" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart
                    size={48}
                    className="text-[var(--color-cream-dark)] mb-4"
                  />
                  <p className="text-[var(--color-stone-light)] font-[var(--font-body)]">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-sm text-[var(--color-gold)] hover:underline font-[var(--font-body)]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-[var(--color-cream)] rounded-xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[var(--color-charcoal)] truncate font-[var(--font-heading)]">
                          {item.name}
                        </h4>
                        <p className="text-sm text-[var(--color-gold)] font-semibold mt-0.5 font-[var(--font-body)]">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-full border border-[var(--color-cream-dark)] flex items-center justify-center hover:border-[var(--color-gold)] transition-colors bg-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center font-[var(--font-body)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-full border border-[var(--color-cream-dark)] flex items-center justify-center hover:border-[var(--color-gold)] transition-colors bg-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="self-start p-1.5 rounded-full hover:bg-red-50 text-[var(--color-stone-light)] hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-[var(--color-cream-dark)] px-6 py-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[var(--color-stone-light)] font-[var(--font-body)]">
                    Subtotal
                  </span>
                  <span className="text-xl font-bold text-[var(--color-charcoal)] font-[var(--font-heading)]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                {cartTotal >= 50 && (
                  <p className="text-xs text-green-600 text-center mb-3 font-[var(--font-body)]">
                    ✦ You qualify for free shipping!
                  </p>
                )}
                <button className="w-full bg-[var(--color-charcoal)] hover:bg-[var(--color-gold)] text-white py-3.5 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 font-[var(--font-body)]">
                  Checkout
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center mt-3 text-sm text-[var(--color-stone-light)] hover:text-[var(--color-gold)] transition-colors font-[var(--font-body)]"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
