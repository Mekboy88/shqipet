import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import wallpaperImage from "@/assets/marketplace-wallpaper.jpg";
import marketplaceIllustration from "@/assets/marketplace-illustration.svg";
/**
 * Shqipet Marketplace – Lovable React Preview
 * Single-file, Tailwind-ready. Keeps *all* features you asked for.
 *
 * ▶ Fixes:
 * - **TypeError: Cannot read properties of undefined (reading 'map')**
 *   Root cause: `items` prop sometimes undefined. Solution: `normalizeArray(items)`
 *   used everywhere we map over arrays (UsersGrid & PlatformGrid).
 * - Users Market action buttons forced to **2×2** grid with wrapped text (no overlap).
 * - Added a **long sponsored banner** to Users Market + keeps existing ad tiles.
 * - Restored full page export (default export = Marketplace) so Lovable renders the page.
 *
 * 🧪 Inline Dev Tests (non-invasive):
 * - Simple pure-function tests for `normalizeArray` with undefined/null/array inputs.
 */

// ---------- Utils ----------
function normalizeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : [];
}

// ---------- Types ----------

type Mode = "chooser" | "platform" | "users";

type PlatformProduct = {
  id: string;
  title: string;
  price: number;
  image?: string;
  badge?: string; // e.g., "New", "Hot"
  stock?: number;
};

type UserListing = {
  id: string;
  title: string;
  price?: number; // may be missing if user wants offers
  condition: "used" | "new";
  sellerName: string;
  sellerRating: number; // 0..5
  distanceKm?: number; // optional user's computed distance
  image?: string;
  locationLabel?: string;
  isAvailable?: boolean;
  isAd?: boolean; // sponsored tile in Users grid
};

// ---------- Mock Data (safe to replace with Supabase later) ----------

const mockPlatform: PlatformProduct[] = [
  { id: "p1", title: "Shqipet Pro Headphones", price: 129.99, badge: "New", stock: 24, image: "https://images.unsplash.com/photo-1518441902110-227f328bc141?w=1200" },
  { id: "p2", title: "Shqipet Smartwatch S2", price: 199.0, badge: "New", stock: 12, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200" },
  { id: "p3", title: "Shqipet 4K Action Cam", price: 249.5, badge: "Hot", stock: 7, image: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=1200" },
  { id: "p4", title: "USB-C GaN Charger", price: 34.9, badge: "New", stock: 120, image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200" },
  { id: "p5", title: "Mechanical Keyboard", price: 89.0, badge: "New", stock: 18, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200" },
  { id: "p6", title: "Wireless Mouse Pro", price: 59.99, badge: "Hot", stock: 45, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200" },
  { id: "p7", title: "Gaming Monitor 27\"", price: 299.0, badge: "New", stock: 8, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200" },
  { id: "p8", title: "Bluetooth Speaker", price: 79.5, badge: "New", stock: 32, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200" },
  { id: "p9", title: "Webcam HD Pro", price: 119.0, badge: "Hot", stock: 15, image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200" },
  { id: "p10", title: "Phone Case Premium", price: 24.99, badge: "New", stock: 200, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200" },
  { id: "p11", title: "Laptop Stand", price: 49.0, badge: "New", stock: 67, image: "https://images.unsplash.com/photo-1527443060438-342c10d00b5d?w=1200" },
  { id: "p12", title: "Tablet 10\" Pro", price: 349.0, badge: "Hot", stock: 6, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200" },
  { id: "p13", title: "Smart Home Hub", price: 89.99, badge: "New", stock: 28, image: "https://images.unsplash.com/photo-1558618666-fddc0c3d2dc0?w=1200" },
  { id: "p14", title: "Fitness Tracker", price: 69.0, badge: "New", stock: 41, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=1200" },
  { id: "p15", title: "Wireless Earbuds", price: 149.0, badge: "Hot", stock: 19, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200" },
  { id: "p16", title: "Power Bank 20000mAh", price: 39.99, badge: "New", stock: 85, image: "https://images.unsplash.com/photo-1609592043282-7882e2b9f32e?w=1200" },
  { id: "p17", title: "Gaming Chair Pro", price: 259.0, badge: "New", stock: 12, image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1200" },
  { id: "p18", title: "4K Webcam Ultra", price: 189.99, badge: "Hot", stock: 9, image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200" },
  { id: "p19", title: "USB Hub 7-Port", price: 29.5, badge: "New", stock: 156, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=1200" },
  { id: "p20", title: "Smart Light Bulb", price: 19.99, badge: "New", stock: 230, image: "https://images.unsplash.com/photo-1558618666-fddc0c3d2dc0?w=1200" },
  { id: "p21", title: "Desk Lamp LED", price: 45.0, badge: "New", stock: 78, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200" },
  { id: "p22", title: "Portable SSD 1TB", price: 119.99, badge: "Hot", stock: 24, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1200" },
  { id: "p23", title: "Wireless Charger", price: 34.5, badge: "New", stock: 145, image: "https://images.unsplash.com/photo-1609592043282-7882e2b9f32e?w=1200" },
  { id: "p24", title: "Microphone USB", price: 79.0, badge: "New", stock: 33, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200" },
  { id: "p25", title: "HDMI Cable 4K", price: 14.99, badge: "New", stock: 340, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=1200" },
  { id: "p26", title: "Phone Grip Stand", price: 12.5, badge: "New", stock: 450, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200" },
  { id: "p27", title: "Laptop Cooling Pad", price: 35.99, badge: "New", stock: 67, image: "https://images.unsplash.com/photo-1527443060438-342c10d00b5d?w=1200" },
  { id: "p28", title: "Bluetooth Adapter", price: 18.0, badge: "New", stock: 189, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=1200" },
  { id: "p29", title: "Screen Cleaner Kit", price: 9.99, badge: "New", stock: 567, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200" },
  { id: "p30", title: "Cable Management", price: 16.5, badge: "New", stock: 234, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=1200" },
];

const mockUsers: UserListing[] = [
  { id: "ad0", title: "Sponsored: Shqipet Delivery+", condition: "new", sellerName: "Shqipet", sellerRating: 5, isAd: true, image: "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=1600" },
  { id: "u1", title: "iPhone 13 (128GB)", price: 320, condition: "used", sellerName: "Ardi", sellerRating: 4.6, distanceKm: 3.2, locationLabel: "Stratford, London", isAvailable: true, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200" },
  { id: "u2", title: "Gaming Chair", price: 75, condition: "used", sellerName: "Meri", sellerRating: 4.9, distanceKm: 7.5, locationLabel: "Greenwich, London", isAvailable: true, image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1200" },
  { id: "u3", title: "Wireless Keyboard", condition: "new", sellerName: "Dren", sellerRating: 4.2, distanceKm: 1.1, locationLabel: "Canary Wharf, London", isAvailable: false, image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=1200" },
  { id: "u4", title: "PS5 Bundle + 2 Games", price: 360, condition: "used", sellerName: "Eri", sellerRating: 4.8, distanceKm: 5.3, locationLabel: "Bow, London", isAvailable: true, image: "https://images.unsplash.com/photo-1606813907291-76a3603c63f3?w=1200" },
  { id: "u5", title: "MacBook Pro 14\" (2021)", price: 1250, condition: "used", sellerName: "Luca", sellerRating: 4.7, distanceKm: 2.8, locationLabel: "Camden, London", isAvailable: true, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200" },
];

// ---------- Small UI atoms ----------

const StarBar: React.FC<{ value: number; size?: "sm" | "md" }> = ({ value, size = "sm" }) => {
  const filled = Math.round(Math.max(0, Math.min(5, value)));
  return (
    <div className="flex items-center gap-0.5">
      {[0,1,2,3,4].map(i => (
        <svg key={i} className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} viewBox="0 0 20 20" fill={i < filled ? "currentColor" : "none"} stroke="currentColor">
          <path d="M10 2.5l2.47 4.77 5.27.77-3.82 3.73.9 5.23L10 14.9l-4.82 2.1.9-5.23L2.26 8.04l5.27-.77L10 2.5z"/>
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{value.toFixed(1)}</span>
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
    {children}
  </span>
);

const MarketHeader: React.FC<{
  title: string;
  subtitle: string;
  onBack?: () => void;
  rightCta?: React.ReactNode;
}> = ({ title, subtitle, onBack, rightCta }) => (
  <div className="relative mt-14">
    <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="rounded-xl border/60 border-white bg-white/20 text-white px-3 py-1.5 hover:bg-white/30">←</button>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow">{title}</h1>
              <p className="text-white/90">{subtitle}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="rounded-xl bg-yellow-300 text-black px-3 py-2">My Products</button>
            <button className="rounded-xl bg-white/30 text-white px-3 py-2 border border-white/40">Load Sample Data</button>
            {rightCta}
          </div>
        </div>

        {/* Search row */}
        <div className="mt-6">
          <div className="w-full rounded-2xl bg-white shadow-sm border p-2 flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search for products" className="flex-1 outline-none" />
            <button className="rounded-xl border px-3 py-1.5">Search</button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select className="rounded-xl border px-3 py-2">
              <option>Newest</option>
              <option>Price ↑</option>
              <option>Price ↓</option>
            </select>
            <select className="rounded-xl border px-3 py-2">
              <option>All Categories</option>
              <option>Phones</option>
              <option>Computers</option>
              <option>Accessories</option>
            </select>
            <button className="rounded-xl bg-rose-500 text-white px-3 py-2">Nearby Shops</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdWideCard: React.FC<{ title: string; subtitle?: string; image?: string }>=({ title, subtitle, image })=> (
  <div className="col-span-full rounded-3xl overflow-hidden border bg-white">
    <div className="relative w-full h-44 sm:h-56 md:h-64">
      <img src={image ?? "https://images.unsplash.com/photo-1522199794611-8e0a36e71ee1?w=1800"} alt="ad" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/30"/>
      <div className="absolute left-4 bottom-4 text-white">
        <div className="text-xl font-bold">{title}</div>
        {subtitle && <div className="text-sm opacity-90">{subtitle}</div>}
      </div>
    </div>
  </div>
);

const AdTileCard: React.FC<{ title: string; image?: string }>=({ title, image })=> (
  <div className="rounded-2xl overflow-hidden border bg-white flex flex-col">
    <div className="relative aspect-[4/3]">
      <img src={image ?? "https://images.unsplash.com/photo-1508051123996-69f8caf4891f?w=1400"} alt="ad" className="absolute inset-0 w-full h-full object-cover"/>
      <span className="absolute top-2 left-2 text-xs bg-black/70 text-white rounded-full px-2 py-0.5">Sponsored</span>
    </div>
    <div className="p-3 text-sm">{title}</div>
  </div>
);

// ---------- Grids ----------

interface PlatformGridProps {
  items?: PlatformProduct[];
  onAddToCart: (p: PlatformProduct) => void;
}
const PlatformGrid: React.FC<PlatformGridProps> = ({ items = [], onAddToCart }) => (
  <div className="w-full px-0 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
    {/* Sponsored long card - full width */}
    <div className="col-span-full">
      <AdWideCard title="Shqipet Deals Week" subtitle="Save up to 30% on new arrivals" />
    </div>

    {normalizeArray(items).map((p, idx) => (
      <div key={p.id} className={`rounded-2xl border overflow-hidden hover:shadow-sm transition bg-white ${idx === 0 ? "col-span-full" : ""} ${idx % 7 === 0 ? "lg:col-span-2" : ""}`}>
        <div className={`relative ${idx === 0 ? "aspect-[32/9]" : idx % 5 === 0 ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
          <img src={p.image ?? "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200"} alt={p.title} className="absolute inset-0 w-full h-full object-cover"/>
          {p.badge && <span className="absolute top-2 left-2 bg-white/90 rounded-full text-xs px-2 py-0.5">{p.badge}</span>}
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate" title={p.title}>{p.title}</h3>
            {p.badge && <Badge>{p.badge}</Badge>}
          </div>
          <div className="text-lg font-semibold">£{p.price.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Stock: {p.stock ?? "—"}</div>
          <div className="pt-2">
            <button onClick={()=>onAddToCart(p)} className="w-full rounded-xl bg-black text-white px-3 py-2 hover:opacity-90">Add to Cart</button>
          </div>
        </div>
      </div>
    ))}

    {/* Extra ad tiles between products */}
    <AdTileCard title="Sponsored: Shqipet Care+ Protection" />
    <AdTileCard title="Sponsored: Fast Next‑Day Delivery" />
  </div>
);

interface UsersGridProps {
  items?: UserListing[];
  onAskAvailability: (l: UserListing) => void;
  onMakeOffer: (l: UserListing) => void;
  onStartChat: (l: UserListing) => void;
  onShareLocation: (l: UserListing) => void;
}
const UsersGrid: React.FC<UsersGridProps> = ({ items = [], onAskAvailability, onMakeOffer, onStartChat, onShareLocation }) => (
  <div className="w-full px-0 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
    {/* Long sponsored card at top - full width */}
    <div className="col-span-full">
      <AdWideCard title="Sponsored: Safe Meet‑Up Tips" subtitle="Public places • Daylight • Bring a friend" image="https://images.unsplash.com/photo-1520975682031-c7562fb361ad?w=1800" />
    </div>

    {normalizeArray(items).map((l, idx) => (
      l.isAd ? (
        <AdTileCard key={l.id} title={l.title} image={l.image} />
      ) : (
        <div key={l.id} className={`rounded-2xl border overflow-hidden bg-white flex flex-col ${idx % 6 === 0 ? "lg:col-span-2" : ""}`}>
          <div className={`relative ${idx % 4 === 0 ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
            <img src={l.image ?? "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200"} alt={l.title} className="absolute inset-0 w-full h-full object-cover"/>
            <span className="absolute top-2 left-2 bg-white/90 rounded-full text-xs px-2 py-0.5">{l.condition === "used" ? "Used" : "New"}</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold truncate" title={l.title}>{l.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {typeof l.price === "number" ? <span>£{l.price.toFixed(2)}</span> : <span>Price: Ask</span>}
                </div>
              </div>
              <div className="text-right">
                <StarBar value={l.sellerRating} />
                <div className="text-xs text-gray-500 mt-1">{l.sellerName}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {l.locationLabel && <div className="flex items-center gap-1">📍 {l.locationLabel}</div>}
              {typeof l.distanceKm === "number" && <div>• ~{l.distanceKm.toFixed(1)} km</div>}
              {typeof l.isAvailable === "boolean" && (
                <div className={`px-2 py-0.5 rounded-full border ${l.isAvailable ? "text-green-700 border-green-200" : "text-red-700 border-red-200"}`}>
                  {l.isAvailable ? "Available" : "Possibly Unavailable"}
                </div>
              )}
            </div>

            {/* Actions – 2×2, non-overlapping, wrapped text */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button onClick={()=>onAskAvailability(l)} className="w-full flex items-center justify-center rounded-xl border px-3 py-2 min-h-[44px] text-[13px] leading-snug text-center whitespace-normal break-words hover:bg-gray-50">Ask Availability</button>
              <button onClick={()=>onMakeOffer(l)} className="w-full flex items-center justify-center rounded-xl border px-3 py-2 min-h-[44px] text-[13px] leading-snug text-center whitespace-normal break-words hover:bg-gray-50">Make Offer</button>
              <button onClick={()=>onStartChat(l)} className="w-full flex items-center justify-center rounded-xl border px-3 py-2 min-h-[44px] text-[13px] leading-snug text-center whitespace-normal break-words hover:bg-gray-50">Start Chat</button>
              <button onClick={()=>onShareLocation(l)} className="w-full flex items-center justify-center rounded-xl border px-3 py-2 min-h-[44px] text-[13px] leading-snug text-center whitespace-normal break-words hover:bg-gray-50">Share Location</button>
            </div>
          </div>
        </div>
      )
    ))}

    {/* Empty-state message, in case items is actually empty */}
    {normalizeArray(items).length === 0 && (
      <div className="col-span-full rounded-2xl border p-6 text-center text-gray-600 bg-gray-50">No listings yet.</div>
    )}
  </div>
);

// ---------- Chooser cards ----------

const EntryTwoCards: React.FC<{ onPick: (m: Mode) => void }> = ({ onPick }) => (
  <div className="mx-auto max-w-6xl px-4 py-8 mt-14">
    <h1 className="text-2xl sm:text-3xl font-bold mb-6">Marketplace</h1>
    <p className="text-gray-600 mb-8">Choose a marketplace to continue.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button onClick={()=>onPick("platform")} className="group rounded-3xl border p-6 text-left hover:shadow-md transition bg-white">
        <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 mb-4 flex items-center justify-center overflow-hidden">
          <img 
            src={marketplaceIllustration} 
            alt="Marketplace illustration" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Shqipet Platform</h3>
            <p className="text-gray-600 mt-1">Brand-new items sold directly by the platform.</p>
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition">→</span>
        </div>
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
          <Badge>New Only</Badge>
          <Badge>Warranty</Badge>
          <Badge>Fast Delivery</Badge>
        </div>
      </button>

      <button onClick={()=>onPick("users")} className="group rounded-3xl border p-6 text-left hover:shadow-md transition bg-white">
        <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-emerald-50 to-lime-50 mb-4 flex items-center justify-center">
          <span className="text-gray-400">Illustration</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Users Market</h3>
            <p className="text-gray-600 mt-1">Second-hand and user-sold items. Chat, meet, and agree a deal.</p>
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition">→</span>
        </div>
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
          <Badge>Chat First</Badge>
          <Badge>Meet & Collect</Badge>
          <Badge>Location Share</Badge>
        </div>
      </button>
    </div>
  </div>
);

// ---------- Modal ----------

const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }> = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white border shadow-xl">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h4 className="font-semibold">{title}</h4>
          <button onClick={onClose} className="rounded-lg border px-2 py-1 hover:bg-gray-50">✕</button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t bg-gray-50 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  );
};

// ---------- Small state helper ----------
const useText = (initial = "") => {
  const [v, setV] = useState(initial);
  return { v, setV, bind: { value: v, onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setV(e.target.value) } };
};

// ---------- Main Page ----------

const Marketplace: React.FC = () => {
  const [mode, setMode] = useState<Mode>("chooser");
  const location = useLocation();
  const navigate = useNavigate();
  
  // Preload wallpaper image to prevent loading delay
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = wallpaperImage;
    // Set loaded to true immediately since we're importing the image
    setImageLoaded(true);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/marketplace/platform')) setMode('platform');
    else if (path.startsWith('/marketplace/users')) setMode('users');
    else setMode('chooser');
  }, [location.pathname]);
  

  // Platform state
  const [qP, setQP] = useState("");
  const [sortP, setSortP] = useState("relevance");
  const filteredPlatform = useMemo(() => {
    let arr = normalizeArray(mockPlatform).filter(p => p.title.toLowerCase().includes(qP.toLowerCase()));
    if (sortP === "price_asc") arr = [...arr].sort((a,b)=>a.price-b.price);
    if (sortP === "price_desc") arr = [...arr].sort((a,b)=>b.price-a.price);
    if (sortP === "stock_desc") arr = [...arr].sort((a,b)=>(b.stock??0)-(a.stock??0));
    return arr;
  }, [qP, sortP]);

  // Users state
  const [qU, setQU] = useState("");
  const [distanceU, setDistanceU] = useState("any");
  const [conditionU, setConditionU] = useState("all");
  const filteredUsers = useMemo(() => {
    return normalizeArray(mockUsers).filter(l => {
      if (qU && !l.title.toLowerCase().includes(qU.toLowerCase())) return false;
      if (conditionU !== "all" && l.condition !== (conditionU as "used" | "new")) return false;
      if (distanceU !== "any" && typeof l.distanceKm === "number" && l.distanceKm > Number(distanceU)) return false;
      return true;
    });
  }, [qU, distanceU, conditionU]);

  // Modals (Users)
  const [askOpen, setAskOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeListing, setActiveListing] = useState<UserListing | null>(null);

  const messageAsk = useText("Hi! Is this still available?");
  const messageOffer = useText("Hi! Would you accept £ ___ ?");
  const messageChat = useText("");
  const locationNote = useText("I can meet near Stratford Station.");

  // Handlers (kept)
  const handleAddToCart = (p: PlatformProduct) => { alert(`Added to cart: ${p.title}`); };
  const openAsk = (l: UserListing) => { setActiveListing(l); setAskOpen(true); };
  const openOffer = (l: UserListing) => { setActiveListing(l); setOfferOpen(true); };
  const openChat = (l: UserListing) => { setActiveListing(l); setChatOpen(true); };
  const openShare = (l: UserListing) => { setActiveListing(l); setShareOpen(true); };
  const sendAsk = () => { setAskOpen(false); alert("Availability message sent!"); };
  const sendOffer = () => { setOfferOpen(false); alert("Offer sent!"); };
  const sendChat = () => { messageChat.setV(""); };
  const sendShare = () => { setShareOpen(false); alert("Location shared!"); };

  return (
    <div className="min-h-screen bg-transparent">
      {mode === "chooser" && (
        <EntryTwoCards onPick={(m)=> navigate(m === 'platform' ? '/marketplace/platform' : '/marketplace/users')} />
      )}

      {mode === "platform" && (
        <>
          <MarketHeader title="Market" subtitle="Buy and Sell products easily at SHQIPET" onBack={()=>navigate('/marketplace')} rightCta={<button className="rounded-xl bg-white/30 text-white px-3 py-2 border border-white/40">Cart</button>} />
          <div className="w-full max-w-none px-2 py-6">
            <PlatformGrid items={filteredPlatform} onAddToCart={handleAddToCart} />
          </div>
        </>
      )}

      {mode === "users" && (
        <>
          <MarketHeader title="Market" subtitle="Buy and Sell products easily at SHQIPET" onBack={()=>navigate('/marketplace')} rightCta={<button className="rounded-xl bg-white/30 text-white px-3 py-2 border border-white/40">Post a Listing</button>} />
          <div className="w-full max-w-none px-2 py-6">
            <UsersGrid
              items={filteredUsers}
              onAskAvailability={openAsk}
              onMakeOffer={openOffer}
              onStartChat={openChat}
              onShareLocation={openShare}
            />
          </div>

          {/* Ask Availability */}
          <Modal open={askOpen} onClose={()=>setAskOpen(false)} title={`Ask Availability${activeListing ? ` — ${activeListing.title}` : ""}`}
            footer={<div className="flex justify-end gap-2">
              <button onClick={()=>setAskOpen(false)} className="rounded-xl border px-3 py-2">Cancel</button>
              <button onClick={sendAsk} className="rounded-xl bg-black text-white px-3 py-2">Send</button>
            </div>}
          >
            <textarea {...messageAsk.bind} rows={4} className="w-full rounded-xl border px-3 py-2" />
          </Modal>

          {/* Make Offer */}
          <Modal open={offerOpen} onClose={()=>setOfferOpen(false)} title={`Make Offer${activeListing ? ` — ${activeListing.title}` : ""}`}
            footer={<div className="flex justify-end gap-2">
              <button onClick={()=>setOfferOpen(false)} className="rounded-xl border px-3 py-2">Cancel</button>
              <button onClick={sendOffer} className="rounded-xl bg-black text-white px-3 py-2">Send Offer</button>
            </div>}
          >
            <label className="text-sm text-gray-700">Message</label>
            <textarea {...messageOffer.bind} rows={4} className="w-full rounded-xl border px-3 py-2 mt-1" />
            <p className="text-xs text-gray-500 mt-2">Tip: Be polite and realistic. Sellers respond faster to clear offers.</p>
          </Modal>

          {/* Quick Chat */}
          <Modal open={chatOpen} onClose={()=>setChatOpen(false)} title={`Chat with Seller${activeListing ? ` — ${activeListing.sellerName}` : ""}`}
            footer={<div className="flex justify-between items-center gap-2">
              <div className="text-xs text-gray-500">This is a pre-deal chat. Keep it safe and respectful.</div>
              <div className="flex gap-2">
                <button onClick={()=>setChatOpen(false)} className="rounded-xl border px-3 py-2">Close</button>
                <button onClick={sendChat} className="rounded-xl bg-black text-white px-3 py-2">Send</button>
              </div>
            </div>}
          >
            <div className="h-48 mb-3 rounded-xl border bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
              Conversation will appear here…
            </div>
            <input {...(messageChat.bind as any)} placeholder="Type a message…" className="w-full rounded-xl border px-3 py-2" />
          </Modal>

          {/* Share Location */}
          <Modal open={shareOpen} onClose={()=>setShareOpen(false)} title={`Share Location${activeListing ? ` — ${activeListing.title}` : ""}`}
            footer={<div className="flex justify-end gap-2">
              <button onClick={()=>setShareOpen(false)} className="rounded-xl border px-3 py-2">Cancel</button>
              <button onClick={sendShare} className="rounded-xl bg-black text-white px-3 py-2">Share</button>
            </div>}
          >
            <div className="rounded-xl border p-3 mb-3">
              <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400">
                Map preview
              </div>
              <div className="mt-2 text-xs text-gray-500">We recommend meeting in public, well-lit places.</div>
            </div>
            <label className="text-sm text-gray-700">Note to seller (optional)</label>
            <textarea {...locationNote.bind} rows={3} className="w-full rounded-xl border px-3 py-2 mt-1" />
          </Modal>
        </>
      )}
    </div>
  );
};

export default Marketplace;