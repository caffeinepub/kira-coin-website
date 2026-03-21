import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Menu,
  Rocket,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiDiscord, SiTelegram, SiX } from "react-icons/si";

// ─── Live Ticker Hook ─────────────────────────────────────────────────────
function useLiveTicker(basePrice = 1.0) {
  const [price, setPrice] = useState(basePrice);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const prevRef = useRef(basePrice);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => {
        const delta = prev * 0.005 * (Math.random() * 2 - 1);
        const next = Math.max(0.001, prev + delta);
        setDirection(next >= prevRef.current ? "up" : "down");
        prevRef.current = next;
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return { price, direction };
}

// ─── Particle Background ───────────────────────────────────────────────────
function ParticleBackground() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    delay: `${(i * 0.4) % 4}s`,
    size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1,
    color:
      i % 3 === 0
        ? "oklch(0.87 0.15 200)"
        : i % 3 === 1
          ? "oklch(0.6 0.2 265)"
          : "oklch(0.6 0.22 300)",
  }));

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, oklch(0.87 0.15 200 / 0.4) 0%, transparent 70%)",
          top: "10%",
          left: "60%",
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.22 300 / 0.5) 0%, transparent 70%)",
          top: "70%",
          left: "20%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
          animationDelay: "1.5s",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.2 265 / 0.6) 0%, transparent 70%)",
          top: "40%",
          left: "10%",
          transform: "translate(-50%, -50%)",
          filter: "blur(50px)",
        }}
      />
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size * 2}px`,
            height: `${p.size * 2}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `particle-drift ${3 + (p.id % 3)}s ease-in-out ${p.delay} infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ─── Coin Visual ──────────────────────────────────────────────────────────
function CoinVisual() {
  return (
    <div className="relative flex items-center justify-center w-full h-[420px] animate-float">
      {/* Outer ring */}
      <div
        className="absolute w-72 h-72 rounded-full border-2 animate-spin-slow"
        style={{
          borderColor: "oklch(0.87 0.15 200 / 0.4)",
          boxShadow: "0 0 30px oklch(0.87 0.15 200 / 0.2)",
        }}
      >
        {/* Ring dots */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: "oklch(0.87 0.15 200)",
              boxShadow: "0 0 8px oklch(0.87 0.15 200)",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-144px)`,
            }}
          />
        ))}
      </div>
      {/* Middle ring */}
      <div
        className="absolute w-52 h-52 rounded-full border animate-spin-reverse"
        style={{
          borderColor: "oklch(0.6 0.22 300 / 0.5)",
          boxShadow: "0 0 20px oklch(0.6 0.22 300 / 0.2)",
          borderStyle: "dashed",
        }}
      />
      {/* Coin body */}
      <div
        className="absolute w-36 h-36 rounded-full flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.15 0.06 265), oklch(0.2 0.08 285))",
          boxShadow:
            "0 0 40px oklch(0.87 0.15 200 / 0.3), 0 0 80px oklch(0.6 0.22 300 / 0.15), inset 0 1px 0 oklch(0.87 0.15 200 / 0.3)",
          border: "2px solid oklch(0.87 0.15 200 / 0.4)",
        }}
      >
        <span
          className="font-display font-black text-4xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.87 0.15 200), oklch(0.6 0.2 265), oklch(0.6 0.22 300))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          K
        </span>
      </div>
      {/* Holographic panels */}
      <div
        className="absolute top-6 right-6 w-24 h-16 rounded-lg glass flex flex-col gap-1.5 p-2"
        style={{ border: "1px solid oklch(0.87 0.15 200 / 0.2)" }}
      >
        <div
          className="h-1.5 rounded-full w-full"
          style={{ background: "oklch(0.87 0.15 200 / 0.5)" }}
        />
        <div
          className="h-1.5 rounded-full w-3/4"
          style={{ background: "oklch(0.6 0.2 265 / 0.5)" }}
        />
        <div
          className="h-1.5 rounded-full w-1/2"
          style={{ background: "oklch(0.6 0.22 300 / 0.5)" }}
        />
        <div
          className="h-1.5 rounded-full w-5/6"
          style={{ background: "oklch(0.87 0.15 200 / 0.3)" }}
        />
      </div>
      <div
        className="absolute bottom-10 left-4 w-20 h-14 rounded-lg glass flex flex-col gap-1.5 p-2"
        style={{ border: "1px solid oklch(0.6 0.22 300 / 0.2)" }}
      >
        <div
          className="text-xs font-mono"
          style={{ color: "oklch(0.87 0.15 200)" }}
        >
          KRC
        </div>
        <div
          className="h-1.5 rounded-full w-full"
          style={{ background: "oklch(0.6 0.22 300 / 0.5)" }}
        />
        <div
          className="h-1.5 rounded-full w-4/5"
          style={{ background: "oklch(0.87 0.15 200 / 0.4)" }}
        />
      </div>
      {/* Neon circuit lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line
          x1="60"
          y1="200"
          x2="130"
          y2="200"
          stroke="oklch(0.87 0.15 200 / 0.3)"
          strokeWidth="1"
        />
        <line
          x1="60"
          y1="200"
          x2="60"
          y2="160"
          stroke="oklch(0.87 0.15 200 / 0.3)"
          strokeWidth="1"
        />
        <circle cx="60" cy="160" r="3" fill="oklch(0.87 0.15 200)" />
        <line
          x1="360"
          y1="200"
          x2="290"
          y2="200"
          stroke="oklch(0.6 0.22 300 / 0.3)"
          strokeWidth="1"
        />
        <line
          x1="360"
          y1="200"
          x2="360"
          y2="240"
          stroke="oklch(0.6 0.22 300 / 0.3)"
          strokeWidth="1"
        />
        <circle cx="360" cy="240" r="3" fill="oklch(0.6 0.22 300)" />
        <line
          x1="210"
          y1="60"
          x2="210"
          y2="130"
          stroke="oklch(0.6 0.2 265 / 0.3)"
          strokeWidth="1"
        />
        <line
          x1="210"
          y1="60"
          x2="240"
          y2="60"
          stroke="oklch(0.6 0.2 265 / 0.3)"
          strokeWidth="1"
        />
        <circle cx="240" cy="60" r="3" fill="oklch(0.6 0.2 265)" />
      </svg>
    </div>
  );
}

// ─── Mock Chart ──────────────────────────────────────────────────────────
function MockChart({ livePrice }: { livePrice: number }) {
  const points = [
    [0, 80],
    [40, 65],
    [80, 75],
    [120, 50],
    [160, 60],
    [200, 35],
    [240, 45],
    [280, 20],
    [320, 30],
    [360, 10],
  ];
  const pathD = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
  const areaD = `${pathD} L 360 100 L 0 100 Z`;

  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{
        background: "oklch(0.1 0.04 265)",
        border: "1px solid oklch(0.97 0.015 265 / 0.1)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            className="text-sm font-body"
            style={{ color: "oklch(0.72 0.03 265)" }}
          >
            KIRA / USDT
          </div>
          <div className="flex items-center gap-2">
            <div
              className="text-2xl font-display font-bold"
              style={{ color: "oklch(0.87 0.15 200)" }}
            >
              ${livePrice.toFixed(4)}
            </div>
            <LiveDot />
          </div>
        </div>
        <div
          className="flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full"
          style={{
            color: "oklch(0.75 0.18 160)",
            background: "oklch(0.75 0.18 160 / 0.1)",
          }}
        >
          <TrendingUp size={14} />
          +12.4%
        </div>
      </div>
      <div className="flex-1 relative">
        <svg
          role="img"
          aria-label="Price chart"
          viewBox="0 0 360 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="oklch(0.87 0.15 200)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="oklch(0.87 0.15 200)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#chart-grad)" />
          <path
            d={pathD}
            fill="none"
            stroke="oklch(0.87 0.15 200)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-chart-draw"
          />
          {points.map(([x, y], i) =>
            i % 3 === 0 ? (
              <circle
                key={x}
                cx={x}
                cy={y}
                r="3"
                fill="oklch(0.87 0.15 200)"
                style={{ filter: "drop-shadow(0 0 4px oklch(0.87 0.15 200))" }}
              />
            ) : null,
          )}
        </svg>
      </div>
      <div
        className="flex justify-between mt-3 text-xs"
        style={{ color: "oklch(0.72 0.03 265 / 0.6)" }}
      >
        {["7D", "14D", "1M", "3M", "ALL"].map((t) => (
          <button
            type="button"
            key={t}
            className="px-2 py-1 rounded hover:text-foreground transition-colors"
            style={t === "1M" ? { color: "oklch(0.87 0.15 200)" } : {}}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Live Dot Indicator ────────────────────────────────────────────────────
function LiveDot({ direction = "up" }: { direction?: "up" | "down" }) {
  const color =
    direction === "up" ? "oklch(0.75 0.18 160)" : "oklch(0.68 0.25 325)";
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold"
      style={{ color }}
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      LIVE
    </span>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tradeTab, setTradeTab] = useState("buy");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("KRC");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const { price: livePrice, direction } = useLiveTicker(1.0);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleOrderSubmit = () => {
    if (!amount) return;
    setOrderSubmitted(true);
    setTimeout(() => setOrderSubmitted(false), 3000);
    setAmount("");
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Tokenomics", id: "tokenomics" },
    { label: "Buy/Sell", id: "buy-sell" },
  ];

  const tokenomicsData = [
    {
      name: "Total Supply",
      value: "1,000,000,000 KRC",
      pct: 100,
      color: "oklch(0.87 0.15 200)",
      desc: "Fixed maximum supply",
    },
    {
      name: "Community Rewards",
      value: "300,000,000 KRC",
      pct: 30,
      color: "oklch(0.6 0.2 265)",
      desc: "30% allocation for community",
    },
    {
      name: "Staking Rewards",
      value: "200,000,000 KRC",
      pct: 20,
      color: "oklch(0.6 0.22 300)",
      desc: "20% APY staking pool",
    },
    {
      name: "Team & Dev",
      value: "150,000,000 KRC",
      pct: 15,
      color: "oklch(0.68 0.25 325)",
      desc: "2-year vesting schedule",
    },
    {
      name: "Burn Rate",
      value: "2% per tx",
      pct: 35,
      color: "oklch(0.75 0.18 160)",
      desc: "Deflationary burn mechanism",
    },
  ];

  const featureCards = [
    {
      icon: <Zap size={24} />,
      title: "Ultra Low Fees",
      desc: "Execute trades and transfers for a fraction of a cent. Kira Coin's optimized protocol eliminates gas wars and keeps your earnings where they belong — with you.",
      color: "oklch(0.87 0.15 200)",
    },
    {
      icon: <Rocket size={24} />,
      title: "Blazing Speed",
      desc: "Sub-second transaction finality powered by next-gen consensus. Process thousands of transactions per second with zero compromises on security or decentralization.",
      color: "oklch(0.6 0.22 300)",
    },
    {
      icon: <Users size={24} />,
      title: "Community Driven",
      desc: "True decentralized governance where every KRC holder shapes the future. Vote on proposals, fund ecosystem projects, and co-own the protocol's destiny.",
      color: "oklch(0.6 0.2 265)",
    },
  ];

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "oklch(0.08 0.025 265)" }}
    >
      {/* ── HEADER ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 glass"
        style={{ borderBottom: "1px solid oklch(0.97 0.015 265 / 0.08)" }}
        data-ocid="header.panel"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              type="button"
              onClick={() => scrollTo("home")}
              className="flex items-center gap-2"
              data-ocid="nav.home.link"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-black"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.87 0.15 200), oklch(0.6 0.22 300))",
                  boxShadow: "0 0 12px oklch(0.87 0.15 200 / 0.4)",
                  color: "oklch(0.08 0.025 265)",
                }}
              >
                K
              </div>
              <span
                className="font-display font-bold text-lg tracking-wide"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.87 0.15 200), oklch(0.6 0.2 265))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                KIRA COIN
              </span>
            </button>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm font-medium transition-colors hover:text-foreground"
                  style={{ color: "oklch(0.72 0.03 265)" }}
                  data-ocid={`nav.${link.id}.link`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollTo("buy-sell")}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: "transparent",
                  border: "1px solid oklch(0.87 0.15 200 / 0.5)",
                  color: "oklch(0.87 0.15 200)",
                  boxShadow: "0 0 12px oklch(0.87 0.15 200 / 0.15)",
                }}
                data-ocid="header.buy_now.button"
              >
                Buy KRC
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg glass"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              data-ocid="nav.menu.toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div
              className="md:hidden pb-4 flex flex-col gap-2"
              style={{ borderTop: "1px solid oklch(0.97 0.015 265 / 0.08)" }}
            >
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-left px-2 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                  style={{ color: "oklch(0.72 0.03 265)" }}
                  data-ocid={`nav.mobile.${link.id}.link`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        data-ocid="hero.section"
      >
        <ParticleBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left */}
            <div className="space-y-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.87 0.15 200 / 0.1)",
                  border: "1px solid oklch(0.87 0.15 200 / 0.3)",
                  color: "oklch(0.87 0.15 200)",
                }}
              >
                <LiveDot direction={direction} />
                Live on Mainnet • KRC Price: ${livePrice.toFixed(4)}
              </div>

              <h1 className="font-display font-black text-5xl lg:text-6xl xl:text-7xl leading-[1.05]">
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.87 0.15 200), oklch(0.6 0.2 265), oklch(0.6 0.22 300))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px oklch(0.87 0.15 200 / 0.4))",
                  }}
                >
                  Kira Coin
                </span>
                <br />
                <span style={{ color: "oklch(0.97 0.015 265)" }}>
                  The Future of
                </span>
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.97 0.015 265), oklch(0.72 0.03 265))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Decentralized
                  <br />
                  Currency
                </span>
              </h1>

              <p
                className="text-lg leading-relaxed max-w-lg"
                style={{ color: "oklch(0.72 0.03 265)" }}
              >
                Join millions of users in the next evolution of digital finance.
                Kira Coin delivers lightning-fast transactions, near-zero fees,
                and true decentralized governance — all secured by cutting-edge
                cryptography.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo("buy-sell")}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.87 0.15 200), oklch(0.6 0.2 265))",
                    color: "oklch(0.08 0.025 265)",
                    boxShadow: "0 0 24px oklch(0.87 0.15 200 / 0.3)",
                  }}
                  data-ocid="hero.buy_now.button"
                >
                  Buy Now
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all hover:scale-105"
                  style={{
                    background: "transparent",
                    border: "1px solid oklch(0.97 0.015 265 / 0.2)",
                    color: "oklch(0.97 0.015 265)",
                  }}
                  data-ocid="hero.whitepaper.button"
                >
                  Whitepaper
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { val: "$24M+", label: "Market Cap" },
                  { val: "180K+", label: "Holders" },
                  { val: "2.1M+", label: "Transactions" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-3 text-center glass"
                    style={{ border: "1px solid oklch(0.97 0.015 265 / 0.08)" }}
                  >
                    <div
                      className="font-display font-bold text-xl"
                      style={{ color: "oklch(0.87 0.15 200)" }}
                    >
                      {stat.val}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.72 0.03 265)" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Coin Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <CoinVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY KIRA COIN (ABOUT) ── */}
      <section id="about" className="py-24 relative" data-ocid="about.section">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.12 0.04 265 / 0.5) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{
                background: "oklch(0.6 0.22 300 / 0.1)",
                border: "1px solid oklch(0.6 0.22 300 / 0.3)",
                color: "oklch(0.6 0.22 300)",
              }}
            >
              ECOSYSTEM
            </div>
            <h2
              className="font-display font-black text-4xl lg:text-5xl mb-4"
              style={{ color: "oklch(0.97 0.015 265)" }}
            >
              Key Ecosystem Features
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "oklch(0.72 0.03 265)" }}
            >
              Built for the next billion users — Kira Coin combines performance,
              security, and community ownership in one unified protocol.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6" data-ocid="features.list">
            {featureCards.map((card, i) => (
              <div
                key={card.title}
                className="group relative rounded-2xl p-7 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(oklch(0.12 0.04 265), oklch(0.12 0.04 265)) padding-box, linear-gradient(135deg, oklch(0.87 0.15 200 / 0.3), oklch(0.6 0.2 265 / 0.3), oklch(0.6 0.22 300 / 0.3)) border-box",
                  border: "1px solid transparent",
                }}
                data-ocid={`features.item.${i + 1}`}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `0 0 40px ${card.color} / 0.15` }}
                />
                {/* Icon badge */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background:
                      `${card.color.replace(")", " / 0.15)")}`.replace(
                        "oklch(",
                        "oklch(",
                      ),
                    border: `1px solid ${card.color.replace(")", " / 0.4)")}`,
                    color: card.color,
                    boxShadow: `0 0 16px ${card.color.replace(")", " / 0.2)")}`,
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  className="font-display font-bold text-xl mb-3"
                  style={{ color: "oklch(0.97 0.015 265)" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.72 0.03 265)" }}
                >
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUY / SELL ── */}
      <section
        id="buy-sell"
        className="py-24 relative"
        data-ocid="trade.section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 60%, oklch(0.6 0.22 300 / 0.08) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{
                background: "oklch(0.87 0.15 200 / 0.1)",
                border: "1px solid oklch(0.87 0.15 200 / 0.3)",
                color: "oklch(0.87 0.15 200)",
              }}
            >
              TRADING
            </div>
            <h2
              className="font-display font-black text-4xl lg:text-5xl mb-4"
              style={{ color: "oklch(0.97 0.015 265)" }}
            >
              Trade Kira Coin
            </h2>
            <p className="text-lg" style={{ color: "oklch(0.72 0.03 265)" }}>
              Buy and sell KRC with institutional-grade tools and near-zero
              fees.
            </p>
          </div>

          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "oklch(0.1 0.04 265)",
              border: "1px solid oklch(0.97 0.015 265 / 0.1)",
              boxShadow: "0 0 60px oklch(0.87 0.15 200 / 0.08)",
            }}
          >
            <div className="grid lg:grid-cols-2 min-h-[480px]">
              {/* Chart */}
              <div
                className="p-6"
                style={{
                  borderRight: "1px solid oklch(0.97 0.015 265 / 0.08)",
                }}
              >
                <MockChart livePrice={livePrice} />
              </div>

              {/* Trade Form */}
              <div className="p-8 flex flex-col justify-center">
                <Tabs
                  value={tradeTab}
                  onValueChange={setTradeTab}
                  className="w-full"
                  data-ocid="trade.tab"
                >
                  <TabsList
                    className="w-full mb-6 p-1 rounded-xl"
                    style={{
                      background: "oklch(0.08 0.025 265)",
                      border: "1px solid oklch(0.97 0.015 265 / 0.1)",
                    }}
                  >
                    <TabsTrigger
                      value="buy"
                      className="flex-1 rounded-lg font-semibold transition-all data-[state=active]:text-background"
                      style={{
                        color:
                          tradeTab === "buy"
                            ? "oklch(0.08 0.025 265)"
                            : "oklch(0.72 0.03 265)",
                      }}
                      data-ocid="trade.buy.tab"
                    >
                      Buy KRC
                    </TabsTrigger>
                    <TabsTrigger
                      value="sell"
                      className="flex-1 rounded-lg font-semibold transition-all data-[state=active]:text-background"
                      style={{
                        color:
                          tradeTab === "sell"
                            ? "oklch(0.08 0.025 265)"
                            : "oklch(0.72 0.03 265)",
                      }}
                      data-ocid="trade.sell.tab"
                    >
                      Sell KRC
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-5 mt-0">
                    <TradeForm
                      type="buy"
                      amount={amount}
                      setAmount={setAmount}
                      currency={currency}
                      setCurrency={setCurrency}
                      onSubmit={handleOrderSubmit}
                      submitted={orderSubmitted}
                      livePrice={livePrice}
                      direction={direction}
                    />
                  </TabsContent>
                  <TabsContent value="sell" className="space-y-5 mt-0">
                    <TradeForm
                      type="sell"
                      amount={amount}
                      setAmount={setAmount}
                      currency={currency}
                      setCurrency={setCurrency}
                      onSubmit={handleOrderSubmit}
                      submitted={orderSubmitted}
                      livePrice={livePrice}
                      direction={direction}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOKENOMICS ── */}
      <section
        id="tokenomics"
        className="py-24 relative"
        data-ocid="tokenomics.section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 40%, oklch(0.6 0.2 265 / 0.08) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{
                background: "oklch(0.6 0.2 265 / 0.1)",
                border: "1px solid oklch(0.6 0.2 265 / 0.3)",
                color: "oklch(0.6 0.2 265)",
              }}
            >
              TOKENOMICS
            </div>
            <h2
              className="font-display font-black text-4xl lg:text-5xl mb-4"
              style={{ color: "oklch(0.97 0.015 265)" }}
            >
              Token Distribution
            </h2>
            <p className="text-lg" style={{ color: "oklch(0.72 0.03 265)" }}>
              Transparent, community-first allocation designed for long-term
              sustainability.
            </p>
          </div>

          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "oklch(0.1 0.04 265)",
              border: "1px solid oklch(0.97 0.015 265 / 0.1)",
            }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-4 px-8 py-4 text-xs font-semibold tracking-wider uppercase"
              style={{
                background: "oklch(0.08 0.025 265)",
                borderBottom: "1px solid oklch(0.97 0.015 265 / 0.08)",
                color: "oklch(0.72 0.03 265)",
              }}
            >
              <div className="col-span-3">Allocation</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-3">Distribution</div>
            </div>

            {/* Rows */}
            <div
              className="divide-y"
              style={{ borderColor: "oklch(0.97 0.015 265 / 0.06)" }}
            >
              {tokenomicsData.map((row, i) => (
                <div
                  key={row.name}
                  className="grid grid-cols-12 gap-4 px-8 py-5 items-center group hover:bg-white/[0.02] transition-colors"
                  data-ocid={`tokenomics.item.${i + 1}`}
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        background: row.color,
                        boxShadow: `0 0 8px ${row.color}`,
                      }}
                    />
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "oklch(0.97 0.015 265)" }}
                    >
                      {row.name}
                    </span>
                  </div>
                  <div
                    className="col-span-4 text-sm"
                    style={{ color: "oklch(0.72 0.03 265)" }}
                  >
                    {row.desc}
                  </div>
                  <div
                    className="col-span-2 text-right font-mono text-sm font-semibold"
                    style={{ color: row.color }}
                  >
                    {row.value}
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ background: "oklch(0.97 0.015 265 / 0.08)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${row.pct}%`,
                          background: `linear-gradient(90deg, ${row.color}, ${row.color.replace(")", " / 0.5)")}`,
                          boxShadow: `0 0 8px ${row.color.replace(")", " / 0.5)")}`,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold w-8 text-right"
                      style={{ color: "oklch(0.72 0.03 265)" }}
                    >
                      {row.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8" data-ocid="footer.section">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl p-10 mb-8"
            style={{
              background: "oklch(0.1 0.04 265)",
              border: "1px solid oklch(0.97 0.015 265 / 0.1)",
            }}
          >
            <div className="grid md:grid-cols-4 gap-10">
              {/* Brand */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-base"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.87 0.15 200), oklch(0.6 0.22 300))",
                      color: "oklch(0.08 0.025 265)",
                    }}
                  >
                    K
                  </div>
                  <span
                    className="font-display font-bold text-xl"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.87 0.15 200), oklch(0.6 0.2 265))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    KIRA COIN
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed max-w-xs"
                  style={{ color: "oklch(0.72 0.03 265)" }}
                >
                  The next generation of decentralized currency — fast, fair,
                  and community-owned. Join the financial revolution today.
                </p>
                {/* Social icons */}
                <div className="flex items-center gap-3 pt-2">
                  {[
                    {
                      icon: <SiX size={16} />,
                      label: "Twitter",
                      ocid: "footer.twitter.link",
                    },
                    {
                      icon: <SiTelegram size={16} />,
                      label: "Telegram",
                      ocid: "footer.telegram.link",
                    },
                    {
                      icon: <SiDiscord size={16} />,
                      label: "Discord",
                      ocid: "footer.discord.link",
                    },
                  ].map(({ icon, label, ocid }) => (
                    <a
                      key={label}
                      href="/"
                      aria-label={label}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: "oklch(0.97 0.015 265 / 0.06)",
                        border: "1px solid oklch(0.97 0.015 265 / 0.1)",
                        color: "oklch(0.72 0.03 265)",
                      }}
                      data-ocid={ocid}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h4
                  className="font-display font-semibold text-sm"
                  style={{ color: "oklch(0.97 0.015 265)" }}
                >
                  Protocol
                </h4>
                <ul className="space-y-2.5">
                  {[
                    "Whitepaper",
                    "Documentation",
                    "Audit Reports",
                    "GitHub",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="/"
                        className="text-sm transition-colors hover:text-foreground"
                        style={{ color: "oklch(0.72 0.03 265)" }}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4
                  className="font-display font-semibold text-sm"
                  style={{ color: "oklch(0.97 0.015 265)" }}
                >
                  Community
                </h4>
                <ul className="space-y-2.5">
                  {["Governance", "Staking", "Bug Bounty", "Newsletter"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="/"
                          className="text-sm transition-colors hover:text-foreground"
                          style={{ color: "oklch(0.72 0.03 265)" }}
                        >
                          {item}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm"
            style={{ color: "oklch(0.72 0.03 265 / 0.6)" }}
          >
            <span>
              © {new Date().getFullYear()} Kira Coin. All rights reserved.
            </span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Trade Form Component ─────────────────────────────────────────────────
interface TradeFormProps {
  type: "buy" | "sell";
  amount: string;
  setAmount: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  onSubmit: () => void;
  submitted: boolean;
  livePrice: number;
  direction: "up" | "down";
}

function TradeForm({
  type,
  amount,
  setAmount,
  currency,
  setCurrency,
  onSubmit,
  submitted,
  livePrice,
  direction,
}: TradeFormProps) {
  const isBuy = type === "buy";
  const accentColor = isBuy ? "oklch(0.87 0.15 200)" : "oklch(0.68 0.25 325)";
  // KRC = livePrice (in USD), USDT = 1 USD
  const price = currency === "KRC" ? livePrice : 1;
  const estimated = amount
    ? (Number.parseFloat(amount) * price).toFixed(4)
    : "0.0000";

  return (
    <div className="space-y-5">
      {/* Price display */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "oklch(0.08 0.025 265)",
          border: "1px solid oklch(0.97 0.015 265 / 0.08)",
        }}
      >
        <div className="text-xs mb-1" style={{ color: "oklch(0.72 0.03 265)" }}>
          Current Price
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="font-display font-bold text-2xl"
            style={{ color: accentColor }}
          >
            ${livePrice.toFixed(4)}
          </span>
          <LiveDot direction={direction} />
          <span className="text-xs" style={{ color: "oklch(0.75 0.18 160)" }}>
            +12.4% 24h
          </span>
        </div>
      </div>

      {/* Amount input */}
      <div className="space-y-1.5">
        <label
          htmlFor="trade-amount"
          className="text-xs font-medium"
          style={{ color: "oklch(0.72 0.03 265)" }}
        >
          {isBuy ? "Amount to Buy" : "Amount to Sell"}
        </label>
        <Input
          id="trade-amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-12 text-lg font-semibold rounded-xl"
          style={{
            background: "oklch(0.08 0.025 265)",
            border: `1px solid ${accentColor.replace(")", " / 0.3)")}`,
            color: "oklch(0.97 0.015 265)",
          }}
          data-ocid="trade.amount.input"
        />
      </div>

      {/* Currency selector */}
      <div className="space-y-1.5">
        <label
          htmlFor="trade-currency"
          className="text-xs font-medium"
          style={{ color: "oklch(0.72 0.03 265)" }}
        >
          Currency
        </label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger
            id="trade-currency"
            className="h-12 rounded-xl"
            style={{
              background: "oklch(0.08 0.025 265)",
              border: "1px solid oklch(0.97 0.015 265 / 0.15)",
              color: "oklch(0.97 0.015 265)",
            }}
            data-ocid="trade.currency.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "oklch(0.12 0.04 265)",
              border: "1px solid oklch(0.97 0.015 265 / 0.15)",
            }}
          >
            <SelectItem value="KRC">KRC — Kira Coin</SelectItem>
            <SelectItem value="USDT">USDT — Tether</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estimated */}
      {amount && (
        <div
          className="rounded-xl p-3 flex items-center justify-between text-sm"
          style={{
            background: `${accentColor.replace(")", " / 0.07)")}`,
            border: `1px solid ${accentColor.replace(")", " / 0.2)")}`,
          }}
        >
          <span style={{ color: "oklch(0.72 0.03 265)" }}>
            Estimated {isBuy ? "cost" : "proceeds"}
          </span>
          <span
            className="font-semibold font-mono"
            style={{ color: accentColor }}
          >
            ~${estimated} USD
          </span>
        </div>
      )}

      {/* Submit */}
      {submitted ? (
        <div
          className="w-full h-12 rounded-xl flex items-center justify-center text-sm font-semibold"
          style={{
            background: "oklch(0.75 0.18 160 / 0.15)",
            color: "oklch(0.75 0.18 160)",
            border: "1px solid oklch(0.75 0.18 160 / 0.3)",
          }}
          data-ocid="trade.success_state"
        >
          ✓ Order placed successfully!
        </div>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!amount}
          className="w-full h-12 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: isBuy
              ? "linear-gradient(135deg, oklch(0.87 0.15 200), oklch(0.6 0.2 265))"
              : "linear-gradient(135deg, oklch(0.68 0.25 325), oklch(0.6 0.22 300))",
            color: "oklch(0.08 0.025 265)",
            boxShadow: `0 0 20px ${accentColor.replace(")", " / 0.25)")}`,
          }}
          data-ocid={`trade.${type}.submit_button`}
        >
          {isBuy ? "Buy KRC Now" : "Sell KRC Now"}
        </button>
      )}
    </div>
  );
}

// Keep Button import used for potential future use (suppress unused warning)
export { Button };
