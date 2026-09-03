/**
 * Built-in product catalog — used as an instant fallback so the storefront is
 * fully functional (products, images, cart) even before a database is
 * configured. When DATABASE_URL is set, the same catalog is seeded into the
 * DB and Prisma becomes the source of truth.
 */

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Price in cents. */
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  /** ISO string — used for "newest" sorting. */
  createdAt: string;
}

type CatalogSeed = {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const RAW_PRODUCTS: CatalogSeed[] = [
  {
    name: "Aurora Wireless Headphones",
    category: "Audio",
    price: 29999,
    stock: 24,
    description:
      "Immersive over-ear headphones with active noise cancellation, 40h battery life, and spatial audio tuned for crystal-clear highs. Wrapped in a midnight matte finish with an iridescent neon accent ring.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Nebula RGB Mechanical Keyboard",
    category: "Keyboards",
    price: 15999,
    stock: 40,
    description:
      "A gasket-mounted 75% mechanical keyboard with hot-swappable switches and per-key RGB. Anodized aluminum top plate, south-facing LEDs, and a neon underglow strip.",
    imageUrl:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Pulse Smartwatch Pro",
    category: "Wearables",
    price: 24900,
    stock: 32,
    description:
      "AMOLED always-on display, built-in GPS, ECG + SpO2 tracking, and 14-day battery life. Lightweight aerospace aluminum with a customizable neon watch face library.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Quantum VR Headset",
    category: "VR & Gaming",
    price: 49999,
    stock: 15,
    description:
      "Step into another dimension with 4K-per-eye micro OLED panels, inside-out tracking, and whisper-quiet haptic controllers. 120Hz refresh for butter-smooth virtual worlds.",
    imageUrl:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Plasma Bluetooth Speaker",
    category: "Audio",
    price: 12900,
    stock: 50,
    description:
      "360° room-filling sound with deep bass radiators and a synchronized pulsing RGB plasma ring. IPX7 waterproof and rugged enough for any adventure.",
    imageUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Neon Gaming Mouse",
    category: "Accessories",
    price: 7999,
    stock: 65,
    description:
      "26K DPI optical sensor, optical switches, and a featherlight 58g shell. Chroma RGB zones glow through a honeycomb exoskeleton for pure cyberpunk energy.",
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Hyperion 4K Gaming Monitor",
    category: "Displays",
    price: 64900,
    stock: 12,
    description:
      "27-inch 4K 160Hz IPS panel with 1ms response, HDR600, and factory-calibrated color. Slim bezels and an ambient backlight that reacts to on-screen colors.",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Zenith TKL Mechanical Keyboard",
    category: "Keyboards",
    price: 13999,
    stock: 38,
    description:
      "A minimal tenkeyless layout with silent tactile switches, PBT keycaps, and tri-mode connectivity. CNC-machined aluminum frame with a cyan underglow.",
    imageUrl:
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Echo Noise-Cancelling Earbuds",
    category: "Audio",
    price: 19999,
    stock: 55,
    description:
      "True wireless earbuds with adaptive ANC, wireless charging case, and a six-mic array for studio-grade calls. Neon-accented, sweat-resistant, and featherlight.",
    imageUrl:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Titan Smartwatch",
    category: "Wearables",
    price: 21999,
    stock: 28,
    description:
      "Military-grade titanium case, sapphire glass, and dual-band GPS. Tracks 50+ workout modes with real-time performance coaching and neon data visualizations.",
    imageUrl:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Vortex Wireless Controller",
    category: "VR & Gaming",
    price: 8999,
    stock: 44,
    description:
      "Pro-level gamepad with hall-effect sticks, trigger stops, and remappable back paddles. A glowing neon lightbar and 25h of battery keep you in the zone.",
    imageUrl:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Chroma Extended Desk Mat",
    category: "Accessories",
    price: 3999,
    stock: 90,
    description:
      "A 900×400mm stitched desk mat with a micro-textured surface for pinpoint mouse control and reactive edge-lit RGB that syncs across your whole setup.",
    imageUrl:
      "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Ion USB-C Docking Hub",
    category: "Accessories",
    price: 5999,
    stock: 60,
    description:
      "Expand your workspace with 8-in-1 connectivity: dual 4K HDMI, 100W PD pass-through, Gigabit Ethernet, and high-speed USB 3.2 ports in a sleek alloy body.",
    imageUrl:
      "https://images.unsplash.com/photo-1625723044792-44de0ccb4b79?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Lumina RGB LED Strip",
    category: "Accessories",
    price: 2999,
    stock: 120,
    description:
      "16.4 ft of individually addressable LEDs with music-reactive mode, 16M colors, and app control. Peel-and-stick backing makes any battlestation glow.",
    imageUrl:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Stellar Studio Microphone",
    category: "Audio",
    price: 14999,
    stock: 25,
    description:
      "A broadcast-grade USB/XLR condenser mic with a built-in pop filter and real-time RGB metering. Crisp 24-bit/96kHz capture for streams, pods, and vocals.",
    imageUrl:
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Phantom Wireless Earbuds",
    category: "Audio",
    price: 17999,
    stock: 48,
    description:
      "Ultra-low latency gaming earbuds with a 2.4GHz dongle plus Bluetooth, spatial 7.1 surround, and a transparent shell showing off the neon internals.",
    imageUrl:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Orbit Magnetic Charging Stand",
    category: "Accessories",
    price: 4999,
    stock: 70,
    description:
      "A precision-aligned magnetic stand that wires your phone into place and charges at 15W. 360° rotation, weighted base, and an understated neon power ring.",
    imageUrl:
      "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Falcon Ultrabook 14",
    category: "Laptops",
    price: 119900,
    stock: 9,
    description:
      "A 2.8K OLED ultrabook powered by the latest flagship silicon. 32GB RAM, 1TB NVMe, and a backlit keyboard with a signature cyan glow — 1.1kg of pure speed.",
    imageUrl:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Nova 240Hz Gaming Display",
    category: "Displays",
    price: 49999,
    stock: 14,
    description:
      "24.5-inch 1080p esports-grade panel with a blistering 240Hz refresh, 0.5ms response, and a retractable headphone hanger. Your competitive edge, electrified.",
    imageUrl:
      "https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Cyber Stream Cam 4K",
    category: "Accessories",
    price: 13999,
    stock: 33,
    description:
      "Ultra-sharp 4K webcam with Sony sensors, AI auto-framing, and dual noise-cancelling mics. A magnetic privacy shutter and a halo LED ring keep you looking lit.",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=900&auto=format&fit=crop",
  },
];

// Fixed seed so ordering/"newest" behaves deterministically.
const BASE_TIME = Date.parse("2026-08-01T00:00:00Z");

export const PRODUCT_CATALOG: CatalogProduct[] = RAW_PRODUCTS.map((p, i) => {
  const slug = slugify(p.name);
  return {
    id: slug,
    slug,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    imageUrl: p.imageUrl,
    stock: p.stock,
    createdAt: new Date(BASE_TIME + i * 3600_000).toISOString(),
  };
});
