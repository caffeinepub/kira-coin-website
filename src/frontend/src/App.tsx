import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  History,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { type Transaction, TransactionType } from "./backend.d";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useDeposit,
  useGetBalance,
  useGetTransactionHistory,
  useWithdraw,
} from "./hooks/useQueries";

function truncatePrincipal(p: string) {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}...${p.slice(-6)}`;
}

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleString();
}

// ─── Shared Price Types ───────────────────────────────────────────────────────
type PricePoint = {
  time: string;
  price: number;
  volume: number;
};

const BASE_PRICE = 0.5;
const MAX_POINTS = 30;

function generateInitialData(): PricePoint[] {
  const points: PricePoint[] = [];
  let price = BASE_PRICE;
  const now = Date.now();
  for (let i = MAX_POINTS - 1; i >= 0; i--) {
    const change = price * (Math.random() * 0.06 - 0.03);
    price = Math.max(0.01, price + change);
    const t = new Date(now - i * 2000);
    points.push({
      time: t.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      price: Math.round(price * 100000) / 100000,
      volume: Math.round(Math.random() * 9000 + 1000),
    });
  }
  return points;
}

// ─── Market Trend ─────────────────────────────────────────────────────────────
function MarketTrend({ data }: { data: PricePoint[] }) {
  const currentPrice = data[data.length - 1]?.price ?? BASE_PRICE;
  const openPrice = data[0]?.price ?? BASE_PRICE;
  const changeAbs = currentPrice - openPrice;
  const changePct = (changeAbs / openPrice) * 100;
  const isUp = changePct >= 0;

  const visibleTicks = data.filter((_, i) => i % 5 === 0).map((d) => d.time);
  const priceMin = Math.min(...data.map((d) => d.price));
  const priceMax = Math.max(...data.map((d) => d.price));
  const pricePad = (priceMax - priceMin) * 0.15 || 0.005;
  const areaColor = isUp ? "#10b981" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      data-ocid="market.chart_point"
    >
      <Card className="border-border/40 bg-gradient-to-br from-card to-card/60 overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: isUp
              ? "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(16,185,129,0.12), transparent)"
              : "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(239,68,68,0.12), transparent)",
          }}
        />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle className="font-display text-foreground text-base font-semibold">
                KC / USD Market Trend
              </CardTitle>
              <span className="relative flex h-5 items-center">
                <span
                  className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75"
                  style={{ backgroundColor: areaColor }}
                />
                <Badge
                  className="relative pl-3 text-[10px] font-bold tracking-widest uppercase"
                  style={{
                    backgroundColor: `${areaColor}22`,
                    color: areaColor,
                    borderColor: `${areaColor}44`,
                  }}
                >
                  <span
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: areaColor }}
                  />
                  LIVE
                </Badge>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <motion.span
                key={currentPrice}
                initial={{ scale: 1.08, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="font-display text-2xl font-bold text-foreground"
              >
                ${currentPrice.toFixed(5)}
              </motion.span>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${areaColor}22`,
                  color: areaColor,
                  border: `1px solid ${areaColor}44`,
                }}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isUp ? "+" : ""}
                {changePct.toFixed(2)}%
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-4 px-2 sm:px-4">
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart
              data={data}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={areaColor} stopOpacity={0.35} />
                  <stop
                    offset="100%"
                    stopColor={areaColor}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                ticks={visibleTicks}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="price"
                domain={[priceMin - pricePad, priceMax + pricePad]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v.toFixed(4)}`}
                width={58}
              />
              <RechartsTooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number, name: string) => [
                  name === "price"
                    ? `$${value.toFixed(5)}`
                    : value.toLocaleString(),
                  name === "price" ? "KC Price" : "Volume",
                ]}
                labelStyle={{
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: 4,
                }}
              />
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke={areaColor}
                strokeWidth={2}
                fill="url(#areaGradient)"
                dot={false}
                activeDot={{ r: 4, fill: areaColor, strokeWidth: 0 }}
                isAnimationActive={false}
                style={{ filter: `drop-shadow(0 0 4px ${areaColor}88)` }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={48}>
            <ComposedChart
              data={data}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <YAxis yAxisId="vol" hide domain={[0, "auto"]} />
              <Bar
                yAxisId="vol"
                dataKey="volume"
                fill={`${areaColor}55`}
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
                maxBarSize={8}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-4 gap-2 mt-2">
            {[
              { label: "Open", value: `$${openPrice.toFixed(5)}` },
              { label: "Current", value: `$${currentPrice.toFixed(5)}` },
              {
                label: "High",
                value: `$${Math.max(...data.map((d) => d.price)).toFixed(5)}`,
              },
              {
                label: "Low",
                value: `$${Math.min(...data.map((d) => d.price)).toFixed(5)}`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center py-1.5 px-2 rounded-lg bg-muted/20 border border-border/20"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-xs font-mono font-semibold text-foreground mt-0.5">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Trading Panel ────────────────────────────────────────────────────────────
type TradeDirection = "up" | "down";
type TradeResult = {
  id: number;
  direction: TradeDirection;
  bet: number;
  startPrice: number;
  endPrice: number;
  profit: number;
  won: boolean;
  time: string;
};

type TradingState = "idle" | "waiting" | "result";

function TradingPanel({
  currentPrice,
  localBalance,
  setLocalBalance,
}: {
  currentPrice: number;
  localBalance: number;
  setLocalBalance: (v: number | ((prev: number) => number)) => void;
}) {
  const [betAmount, setBetAmount] = useState("");
  const [tradingState, setTradingState] = useState<TradingState>("idle");
  const [countdown, setCountdown] = useState(5);
  const [direction, setDirection] = useState<TradeDirection | null>(null);
  const [startPrice, setStartPrice] = useState(0);
  const [lastResult, setLastResult] = useState<TradeResult | null>(null);
  const [trades, setTrades] = useState<TradeResult[]>([]);
  const tradeIdRef = useRef(0);
  const currentPriceRef = useRef(currentPrice);

  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);

  const placeTrade = (dir: TradeDirection) => {
    const bet = Number.parseInt(betAmount, 10);
    if (!bet || bet <= 0 || bet > localBalance) return;
    setDirection(dir);
    setStartPrice(currentPriceRef.current);
    setTradingState("waiting");
    setCountdown(5);
    setLastResult(null);
  };

  useEffect(() => {
    if (tradingState !== "waiting") return;
    if (countdown <= 0) {
      // Resolve
      const endPrice = currentPriceRef.current;
      const bet = Number.parseInt(betAmount, 10);
      const priceWentUp = endPrice > startPrice;
      const won =
        (direction === "up" && priceWentUp) ||
        (direction === "down" && !priceWentUp);
      const profit = won ? Math.floor(bet * 0.9) : -bet;
      const result: TradeResult = {
        id: ++tradeIdRef.current,
        direction: direction!,
        bet,
        startPrice,
        endPrice,
        profit,
        won,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      setLastResult(result);
      setTrades((prev) => [result, ...prev].slice(0, 5));
      setLocalBalance((prev) => Math.max(0, prev + profit));
      setTradingState("result");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [
    tradingState,
    countdown,
    betAmount,
    direction,
    startPrice,
    setLocalBalance,
  ]);

  const bet = Number.parseInt(betAmount, 10);
  const canTrade = bet > 0 && bet <= localBalance && tradingState === "idle";
  const areaColor = currentPrice >= BASE_PRICE ? "#10b981" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-ocid="trade.panel"
    >
      <Card className="border-border/40 bg-gradient-to-br from-card to-card/60 relative overflow-hidden">
        {/* Terminal scan-line effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }}
        />
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle, ${areaColor}44, transparent 70%)`,
          }}
        />

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2 font-display text-foreground">
              <Zap className="w-5 h-5 text-yellow-400" />
              Trade & Earn
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                KC PRICE
              </span>
              <motion.span
                key={currentPrice}
                initial={{ scale: 1.1, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="font-mono font-bold text-lg"
                style={{ color: areaColor }}
              >
                ${currentPrice.toFixed(5)}
              </motion.span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Predict whether KC price will go UP or DOWN in the next 5 seconds.
            Win 90% profit!
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Balance display */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/kira-coin-logo-transparent.dim_200x200.png"
                alt="KC"
                className="w-7 h-7 object-contain"
              />
              <span className="text-sm text-muted-foreground">
                Trading Balance
              </span>
            </div>
            <span className="font-display font-bold text-foreground">
              <motion.span
                key={localBalance}
                initial={{ scale: 1.1, color: "#10b981" }}
                animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                transition={{ duration: 0.4 }}
              >
                {localBalance.toLocaleString()}
              </motion.span>{" "}
              <span className="text-muted-foreground text-sm">KC</span>
            </span>
          </div>

          {/* Bet input */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Bet Amount (KC)
            </p>
            <Input
              data-ocid="trade.input"
              type="number"
              min="1"
              max={localBalance}
              placeholder="Enter KC to trade..."
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={tradingState !== "idle"}
              className="bg-muted/30 border-border/50 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50 font-mono"
            />
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(preset.toString())}
                  disabled={tradingState !== "idle" || preset > localBalance}
                  className="border-border/50 hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary text-xs"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>

          {/* Countdown state */}
          <AnimatePresence mode="wait">
            {tradingState === "waiting" && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-6"
                data-ocid="trade.loading_state"
              >
                <div className="relative inline-flex items-center justify-center">
                  <svg
                    className="w-24 h-24 -rotate-90"
                    viewBox="0 0 96 96"
                    aria-label="Countdown timer"
                    role="img"
                  >
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke={direction === "up" ? "#10b981" : "#ef4444"}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - countdown / 5)}
                      transition={{ duration: 0.8, ease: "linear" }}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="font-display text-4xl font-bold text-foreground">
                      {countdown}
                    </p>
                    <p className="text-xs text-muted-foreground">secs</p>
                  </div>
                </div>
                <p
                  className="mt-3 text-sm font-medium"
                  style={{ color: direction === "up" ? "#10b981" : "#ef4444" }}
                >
                  {direction === "up"
                    ? "▲ WAITING FOR UP"
                    : "▼ WAITING FOR DOWN"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Entry:{" "}
                  <span className="font-mono">${startPrice.toFixed(5)}</span>{" "}
                  &nbsp;|&nbsp; Bet:{" "}
                  <span className="font-mono">{betAmount} KC</span>
                </p>
              </motion.div>
            )}

            {tradingState === "result" && lastResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-5 rounded-xl border"
                style={{
                  borderColor: lastResult.won ? "#10b98144" : "#ef444444",
                  background: lastResult.won
                    ? "rgba(16,185,129,0.08)"
                    : "rgba(239,68,68,0.08)",
                }}
                data-ocid={
                  lastResult.won ? "trade.success_state" : "trade.error_state"
                }
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="text-5xl mb-2"
                >
                  {lastResult.won ? "🏆" : "💸"}
                </motion.div>
                <p
                  className="font-display text-2xl font-bold"
                  style={{ color: lastResult.won ? "#10b981" : "#ef4444" }}
                >
                  {lastResult.won ? "YOU WIN!" : "YOU LOSE"}
                </p>
                <motion.p
                  className="font-mono text-lg font-bold mt-1"
                  style={{ color: lastResult.won ? "#10b981" : "#ef4444" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {lastResult.won
                    ? `PROFIT +${lastResult.profit} KC`
                    : `LOSS ${lastResult.profit} KC`}
                </motion.p>
                <p className="text-xs text-muted-foreground mt-2">
                  {lastResult.startPrice.toFixed(5)} →{" "}
                  {lastResult.endPrice.toFixed(5)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* UP / DOWN buttons */}
          {tradingState !== "waiting" && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                data-ocid="trade.primary_button"
                size="lg"
                disabled={!canTrade}
                onClick={() => placeTrade("up")}
                className="h-16 text-base font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <TrendingUp className="w-6 h-6" />
                  <span>BUY / UP</span>
                </div>
              </Button>
              <Button
                data-ocid="trade.secondary_button"
                size="lg"
                disabled={!canTrade}
                onClick={() => placeTrade("down")}
                className="h-16 text-base font-bold bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:border-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <TrendingDown className="w-6 h-6" />
                  <span>SELL / DOWN</span>
                </div>
              </Button>
            </div>
          )}

          {tradingState === "result" && (
            <Button
              data-ocid="trade.save_button"
              variant="outline"
              className="w-full border-border/50 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setTradingState("idle");
                setLastResult(null);
                setBetAmount("");
              }}
            >
              Trade Again
            </Button>
          )}

          {/* Recent trades log */}
          {trades.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-semibold">
                Recent Trades
              </p>
              <div className="space-y-1.5" data-ocid="trade.table">
                {trades.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    data-ocid={`trade.item.${i + 1}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/20 border border-border/20 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background:
                            t.direction === "up"
                              ? "rgba(16,185,129,0.2)"
                              : "rgba(239,68,68,0.2)",
                          color: t.direction === "up" ? "#10b981" : "#ef4444",
                        }}
                      >
                        {t.direction === "up" ? "▲" : "▼"}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        {t.bet} KC
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono font-bold"
                        style={{ color: t.won ? "#10b981" : "#ef4444" }}
                      >
                        {t.won ? `+${t.profit}` : `${t.profit}`} KC
                      </span>
                      <span className="text-muted-foreground/50">{t.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {trades.length === 0 && tradingState === "idle" && (
            <div
              data-ocid="trade.empty_state"
              className="text-center py-4 text-xs text-muted-foreground/50"
            >
              No trades yet — place your first bet above!
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Buy & Sell Panel ─────────────────────────────────────────────────────────
function BuySellPanel({
  currentPrice,
  localBalance,
  setLocalBalance,
}: {
  currentPrice: number;
  localBalance: number;
  setLocalBalance: (v: number | ((prev: number) => number)) => void;
}) {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [buyUsd, setBuyUsd] = useState("");
  const [sellKc, setSellKc] = useState("");
  const [localTxns, setLocalTxns] = useState<
    {
      id: number;
      type: "buy" | "sell";
      amount: number;
      usd: number;
      time: string;
    }[]
  >([]);
  const txIdRef = useRef(1000);

  const kcFromUsd = buyUsd ? Number(buyUsd) / currentPrice : 0;
  const usdFromKc = sellKc ? Number(sellKc) * currentPrice : 0;

  function handleBuy() {
    const usd = Number(buyUsd);
    if (!usd || usd <= 0) {
      toast.error("Enter a valid USD amount");
      return;
    }
    const kc = usd / currentPrice;
    setLocalBalance((prev) => prev + kc);
    setLocalTxns((prev) => [
      {
        id: txIdRef.current++,
        type: "buy",
        amount: kc,
        usd,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    toast.success(`Bought ${kc.toFixed(4)} KC for $${usd.toFixed(2)}`);
    setBuyUsd("");
  }

  function handleSell() {
    const kc = Number(sellKc);
    if (!kc || kc <= 0) {
      toast.error("Enter a valid KC amount");
      return;
    }
    if (kc > localBalance) {
      toast.error("Insufficient KC balance");
      return;
    }
    const usd = kc * currentPrice;
    setLocalBalance((prev) => prev - kc);
    setLocalTxns((prev) => [
      {
        id: txIdRef.current++,
        type: "sell",
        amount: kc,
        usd,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    toast.success(`Sold ${kc.toFixed(4)} KC for $${usd.toFixed(2)}`);
    setSellKc("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Price Banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">
              KiRa Coin (KC)
            </span>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold font-mono text-primary">
              ${currentPrice.toFixed(5)}
            </p>
            <p className="text-xs text-muted-foreground">Current Price</p>
          </div>
        </CardContent>
      </Card>

      {/* Mode Toggle */}
      <div className="flex rounded-xl overflow-hidden border border-border/40">
        <button
          type="button"
          data-ocid="buysell.buy.tab"
          onClick={() => setMode("buy")}
          className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
            mode === "buy"
              ? "bg-emerald-500/20 text-emerald-400 border-r border-emerald-500/30"
              : "bg-muted/20 text-muted-foreground hover:text-foreground border-r border-border/30"
          }`}
        >
          📈 BUY KC
        </button>
        <button
          type="button"
          data-ocid="buysell.sell.tab"
          onClick={() => setMode("sell")}
          className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
            mode === "sell"
              ? "bg-red-500/20 text-red-400"
              : "bg-muted/20 text-muted-foreground hover:text-foreground"
          }`}
        >
          📉 SELL KC
        </button>
      </div>

      {/* Buy Form */}
      {mode === "buy" && (
        <motion.div
          key="buy"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-emerald-500/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-emerald-400 text-lg">
                Buy KiRa Coin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Amount (USD)
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    $
                  </span>
                  <Input
                    data-ocid="buysell.buy.input"
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={buyUsd}
                    onChange={(e) => setBuyUsd(e.target.value)}
                    className="pl-7 bg-background/50 border-border/40 focus:border-emerald-500/50"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[10, 25, 50, 100].map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setBuyUsd(String(v))}
                      className="flex-1 py-1.5 text-xs rounded-lg bg-muted/30 border border-border/30 text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                    >
                      ${v}
                    </button>
                  ))}
                </div>
              </div>
              {kcFromUsd > 0 && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    You will receive
                  </p>
                  <p className="text-2xl font-bold font-mono text-emerald-400">
                    {kcFromUsd.toFixed(4)}{" "}
                    <span className="text-base font-medium">KC</span>
                  </p>
                </div>
              )}
              <Button
                data-ocid="buysell.buy.submit_button"
                onClick={handleBuy}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                Buy KC
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sell Form */}
      {mode === "sell" && (
        <motion.div
          key="sell"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-red-500/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-red-400 text-lg">
                Sell KiRa Coin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Available Balance</span>
                <span className="text-foreground font-medium font-mono">
                  {localBalance.toFixed(4)} KC
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Amount (KC)
                </p>
                <Input
                  data-ocid="buysell.sell.input"
                  type="number"
                  min="0"
                  max={localBalance}
                  placeholder="0.0000"
                  value={sellKc}
                  onChange={(e) => setSellKc(e.target.value)}
                  className="bg-background/50 border-border/40 focus:border-red-500/50"
                />
                <div className="flex gap-2 mt-2">
                  {[10, 50, 100, 500].map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setSellKc(String(v))}
                      className="flex-1 py-1.5 text-xs rounded-lg bg-muted/30 border border-border/30 text-muted-foreground hover:border-red-500/40 hover:text-red-400 transition-all"
                    >
                      {v} KC
                    </button>
                  ))}
                </div>
              </div>
              {usdFromKc > 0 && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    You will receive
                  </p>
                  <p className="text-2xl font-bold font-mono text-red-400">
                    ${usdFromKc.toFixed(4)}{" "}
                    <span className="text-base font-medium">USD</span>
                  </p>
                </div>
              )}
              <Button
                data-ocid="buysell.sell.submit_button"
                onClick={handleSell}
                disabled={Number(sellKc) > localBalance}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-50"
              >
                Sell KC
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Local trade history */}
      {localTxns.length > 0 && (
        <Card className="border-border/40 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-base text-foreground">
              Recent Buy/Sell
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2" data-ocid="buysell.history.table">
              {localTxns.slice(0, 8).map((tx, idx) => (
                <div
                  key={tx.id}
                  data-ocid={`buysell.history.item.${idx + 1}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === "buy"
                          ? "bg-emerald-500/15"
                          : "bg-red-500/15"
                      }`}
                    >
                      {tx.type === "buy" ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {tx.type}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        tx.type === "buy" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {tx.type === "buy" ? "+" : "-"}
                      {tx.amount.toFixed(4)} KC
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${tx.usd.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

// ─── Referral Panel ───────────────────────────────────────────────────────────
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function ReferralPanel({ principal }: { principal: string | null }) {
  const [copied, setCopied] = useState(false);

  const shortId = principal
    ? Math.abs(hashCode(principal)).toString(36).slice(0, 8)
    : null;
  const referralLink = shortId
    ? `${window.location.origin}?ref=${shortId}`
    : null;
  const totalReferrals = principal
    ? Math.floor(Math.abs(hashCode(principal)) % 50)
    : 0;

  function copyLink() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareWhatsApp() {
    if (!referralLink) return;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Join KiRa Company! Use my referral link: ${referralLink}`)}`,
      "_blank",
    );
  }

  function shareTelegram() {
    if (!referralLink) return;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join KiRa Company with my referral link!")}`,

      "_blank",
    );
  }

  if (!principal) {
    return (
      <Card
        className="border-primary/30 bg-primary/5"
        data-ocid="referral.panel"
      >
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <Gift className="w-12 h-12 text-primary/50" />
          <p className="font-display text-xl font-bold text-foreground">
            Login to Get Your Referral Link
          </p>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            Sign in to generate your unique referral link and start inviting
            friends.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-ocid="referral.panel">
      <Card className="border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Gift className="w-5 h-5 text-primary" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/60">
            <span className="text-sm font-mono text-primary flex-1 break-all">
              {referralLink}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-ocid="referral.copy.button"
              onClick={copyLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                copied
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : "bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
              }`}
            >
              {copied ? "✓ Copied!" : "📋 Copy Link"}
            </button>
            <button
              type="button"
              data-ocid="referral.whatsapp.button"
              onClick={shareWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 transition-all duration-200"
            >
              📱 Share on WhatsApp
            </button>
            <button
              type="button"
              data-ocid="referral.telegram.button"
              onClick={shareTelegram}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-all duration-200"
            >
              ✈️ Share on Telegram
            </button>
          </div>
        </CardContent>
      </Card>

      <Card
        className="border-border/40 bg-card"
        data-ocid="referral.stats.card"
      >
        <CardHeader>
          <CardTitle className="text-foreground text-lg">
            Referral Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-muted/20 border border-border/40">
              <p className="text-3xl font-bold text-primary font-display">
                {totalReferrals}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Total Referrals
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <p className="text-lg font-bold text-green-400 font-display mt-2">
                ✓ Active
              </p>
              <p className="text-xs text-muted-foreground mt-1">Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="border-border/40 bg-card"
        data-ocid="referral.howto.card"
      >
        <CardHeader>
          <CardTitle className="text-foreground text-lg">
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                step: "1",
                text: "Share your unique referral link with friends",
              },
              { step: "2", text: "Friends sign up and deposit KiRa Coin (KC)" },
              {
                step: "3",
                text: "Friends join the KiRa community",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm">
                  {item.step}
                </span>
                <p className="text-sm text-foreground/80 leading-relaxed mt-0.5">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Header({
  activeTab,
  setActiveTab,
  principal,
  onLogin,
  onLogout,
  isLoggingIn,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  principal: string | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    { id: "trade", label: "Trade", icon: <TrendingUp className="w-4 h-4" /> },
    {
      id: "buysell",
      label: "Buy / Sell",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    {
      id: "deposit",
      label: "Deposit",
      icon: <ArrowDownCircle className="w-4 h-4" />,
    },
    {
      id: "withdraw",
      label: "Withdraw",
      icon: <ArrowUpCircle className="w-4 h-4" />,
    },
    { id: "history", label: "History", icon: <History className="w-4 h-4" /> },
    { id: "referral", label: "Referral", icon: <Gift className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/generated/kira-coin-logo-transparent.dim_200x200.png"
            alt="KiRa Coin"
            className="w-9 h-9 rounded-xl object-contain"
          />
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            KiRa Company
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User / Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {principal && (
            <Badge
              variant="outline"
              className="hidden sm:flex font-mono text-xs border-border/60 text-muted-foreground"
            >
              {truncatePrincipal(principal)}
            </Badge>
          )}
          {principal ? (
            <Button
              data-ocid="auth.logout.button"
              size="sm"
              variant="outline"
              className="border-border/60 hover:border-destructive/60 hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          ) : (
            <Button
              data-ocid="auth.login.button"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-1" />
              )}
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            data-ocid={`mobile.nav.${item.id}.link`}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === item.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}

// ─── Balance Card ─────────────────────────────────────────────────────────────
function BalanceCard({
  balance,
  isLoading,
  onDeposit,
  onWithdraw,
}: {
  balance: bigint | undefined;
  isLoading: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-border/40 bg-gradient-to-br from-card to-card/60">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <CardTitle className="text-muted-foreground font-body text-sm font-medium tracking-wide uppercase">
                Total Balance
              </CardTitle>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              KiRa Coin
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src="/assets/generated/kira-coin-logo-transparent.dim_200x200.png"
              alt="KiRa Coin"
              className="w-12 h-12 object-contain shrink-0"
            />
            <div>
              {isLoading ? (
                <div
                  data-ocid="balance.loading_state"
                  className="flex items-center gap-3"
                >
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-muted-foreground">
                    Loading balance...
                  </span>
                </div>
              ) : (
                <motion.div
                  key={balance?.toString()}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="font-display text-5xl font-bold text-foreground tracking-tight">
                    {balance !== undefined ? balance.toString() : "0"}
                    <span className="text-xl text-muted-foreground ml-2 font-medium">
                      KC
                    </span>
                  </div>
                </motion.div>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Available in your KiRa Company wallet
              </p>
            </div>
          </div>

          {/* Founder badge */}
          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-muted/30 border border-border/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">
                RB
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                Ravina Bhatti
              </p>
              <p className="text-xs text-muted-foreground">
                Founder &amp; CEO, KiRa Company
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              data-ocid="dashboard.deposit.primary_button"
              className="flex-1 bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 font-medium"
              variant="outline"
              onClick={onDeposit}
            >
              <ArrowDownCircle className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button
              data-ocid="dashboard.withdraw.primary_button"
              className="flex-1 bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30 font-medium"
              variant="outline"
              onClick={onWithdraw}
            >
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Deposit Form ─────────────────────────────────────────────────────────────
function DepositForm() {
  const [amount, setAmount] = useState("");
  const deposit = useDeposit();

  const handleDeposit = () => {
    const num = Number.parseInt(amount, 10);
    if (!num || num <= 0) return;
    deposit.mutate(BigInt(num));
    setAmount("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/40 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground font-display">
            <img
              src="/assets/generated/kira-coin-logo-transparent.dim_200x200.png"
              className="w-6 h-6"
              alt="KC"
            />
            Deposit KiRa Coin (KC)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              KiRa Coin Amount
            </p>
            <p className="text-xs text-primary/70">
              Only KiRa Coin (KC) is accepted for deposits.
            </p>
            <Input
              data-ocid="deposit.amount.input"
              type="number"
              min="1"
              placeholder="Enter KC amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-muted/30 border-border/50 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                data-ocid="deposit.preset.button"
                onClick={() => setAmount(preset.toString())}
                className="border-border/50 hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary text-xs"
              >
                +{preset}
              </Button>
            ))}
          </div>
          {amount && Number.parseInt(amount) > 0 && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary">
              You are depositing <strong>{amount} KC (KiRa Coin)</strong> into
              your wallet.
            </div>
          )}
          <Button
            data-ocid="deposit.submit.button"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            onClick={handleDeposit}
            disabled={
              deposit.isPending || !amount || Number.parseInt(amount) <= 0
            }
          >
            {deposit.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowDownCircle className="w-4 h-4 mr-2" />
                Deposit KC
              </>
            )}
          </Button>
          {deposit.isPending && (
            <div
              data-ocid="deposit.loading_state"
              className="text-center text-sm text-muted-foreground animate-pulse"
            >
              Confirming transaction on chain...
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Withdraw Form ────────────────────────────────────────────────────────────
function WithdrawForm({ balance }: { balance: bigint | undefined }) {
  const [amount, setAmount] = useState("");
  const withdraw = useWithdraw();

  const num = Number.parseInt(amount, 10);
  const insufficient =
    balance !== undefined && num > 0 && BigInt(num) > balance;

  const handleWithdraw = () => {
    if (!num || num <= 0 || insufficient) return;
    withdraw.mutate(BigInt(num));
    setAmount("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/40 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground font-display">
            <img
              src="/assets/generated/kira-coin-logo-transparent.dim_200x200.png"
              className="w-6 h-6"
              alt="KC"
            />
            Withdraw KiRa Coin (KC)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30 flex justify-between text-sm">
            <span className="text-muted-foreground">Available Balance</span>
            <span className="font-semibold text-foreground">
              {balance !== undefined ? balance.toString() : "—"} KC
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              KiRa Coin Amount
            </p>
            <p className="text-xs text-accent/70">
              Only KiRa Coin (KC) can be withdrawn.
            </p>
            <Input
              data-ocid="withdraw.amount.input"
              type="number"
              min="1"
              placeholder="Enter KC amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`bg-muted/30 border-border/50 focus:border-accent/60 text-foreground placeholder:text-muted-foreground/50 ${
                insufficient
                  ? "border-destructive/60 focus:border-destructive"
                  : ""
              }`}
            />
            {insufficient && (
              <p
                data-ocid="withdraw.amount.error_state"
                className="text-xs text-destructive flex items-center gap-1"
              >
                <TrendingDown className="w-3 h-3" />
                Insufficient balance
              </p>
            )}
          </div>
          {amount && num > 0 && !insufficient && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent">
              You are withdrawing <strong>{amount} KC (KiRa Coin)</strong> from
              your wallet.
            </div>
          )}
          <Button
            data-ocid="withdraw.submit.button"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            onClick={handleWithdraw}
            disabled={withdraw.isPending || !amount || num <= 0 || insufficient}
          >
            {withdraw.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Withdraw KC
              </>
            )}
          </Button>
          {withdraw.isPending && (
            <div
              data-ocid="withdraw.loading_state"
              className="text-center text-sm text-muted-foreground animate-pulse"
            >
              Confirming transaction on chain...
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Transaction History ──────────────────────────────────────────────────────
function TransactionHistory() {
  const { data: transactions, isLoading } = useGetTransactionHistory();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/40 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground font-display">
            <History className="w-5 h-5 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              data-ocid="history.loading_state"
              className="flex items-center justify-center py-12 gap-3 text-muted-foreground"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading transactions...
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div data-ocid="history.empty_state" className="text-center py-12">
              <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Make your first deposit to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2" data-ocid="history.table">
              {[...transactions]
                .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
                .map((tx: Transaction, idx: number) => {
                  const isDeposit =
                    tx.transactionType === TransactionType.deposit;
                  return (
                    <motion.div
                      key={tx.id.toString()}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.25 }}
                      data-ocid={`history.item.${idx + 1}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            isDeposit ? "bg-emerald-500/15" : "bg-red-500/15"
                          }`}
                        >
                          {isDeposit ? (
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">
                            {tx.transactionType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(tx.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold text-sm ${
                            isDeposit ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {isDeposit ? "+" : "-"}
                          {tx.amount.toString()} KC
                        </p>
                        <p className="text-xs text-muted-foreground">
                          #{tx.id.toString()}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────
function StatsRow({
  transactions,
}: { transactions: Transaction[] | undefined }) {
  const totalDeposits = (transactions ?? [])
    .filter((t) => t.transactionType === TransactionType.deposit)
    .reduce((acc, t) => acc + t.amount, BigInt(0));
  const totalWithdrawals = (transactions ?? [])
    .filter((t) => t.transactionType === TransactionType.withdrawal)
    .reduce((acc, t) => acc + t.amount, BigInt(0));
  const count = (transactions ?? []).length;

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        {
          label: "Total Deposited",
          value: `${totalDeposits.toString()} KC`,
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
        },
        {
          label: "Total Withdrawn",
          value: `${totalWithdrawals.toString()} KC`,
          icon: <TrendingDown className="w-4 h-4 text-red-400" />,
        },
        {
          label: "Transactions",
          value: count.toString(),
          icon: <History className="w-4 h-4 text-primary" />,
        },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
        >
          <Card className="border-border/30 bg-card/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                {stat.icon}
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="font-display font-bold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? null;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: balance, isLoading: balanceLoading } = useGetBalance();
  const { data: transactions } = useGetTransactionHistory();

  // ── Shared live price state ──
  const [priceData, setPriceData] = useState<PricePoint[]>(generateInitialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData((prev) => {
        const last = prev[prev.length - 1];
        const change = last.price * (Math.random() * 0.06 - 0.03);
        const newPrice = Math.max(0.001, last.price + change);
        const newPoint: PricePoint = {
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          price: Math.round(newPrice * 100000) / 100000,
          volume: Math.round(Math.random() * 9000 + 1000),
        };
        return [...prev.slice(-MAX_POINTS + 1), newPoint];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentPrice = priceData[priceData.length - 1]?.price ?? BASE_PRICE;

  // Local balance for trading simulation (seeded from real balance)
  const [localBalance, setLocalBalance] = useState<number>(0);
  useEffect(() => {
    if (balance !== undefined) {
      setLocalBalance(Number(balance));
    }
  }, [balance]);

  return (
    <div className="dark min-h-screen bg-background font-body">
      <Toaster richColors position="top-right" />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        principal={principal}
        onLogin={login}
        onLogout={clear}
        isLoggingIn={isLoggingIn}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    Welcome to{" "}
                    <span className="text-primary">KiRa Company</span>
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold tracking-wide">
                    👥 180,000+ Users
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">
                  Secure, fast, and reliable digital wallet platform
                </p>
              </motion.div>

              {!principal && !isInitializing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-foreground">
                          Sign in to access your wallet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Login to deposit, withdraw, and view history
                        </p>
                      </div>
                      <Button
                        data-ocid="dashboard.login.button"
                        onClick={login}
                        disabled={isLoggingIn}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isLoggingIn ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <LogIn className="w-4 h-4 mr-1" />
                        )}
                        Login
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <BalanceCard
                balance={balance}
                isLoading={balanceLoading}
                onDeposit={() => setActiveTab("deposit")}
                onWithdraw={() => setActiveTab("withdraw")}
              />

              <MarketTrend data={priceData} />
              <StatsRow transactions={transactions} />
            </motion.div>
          )}

          {/* Trade */}
          {activeTab === "trade" && (
            <motion.div
              key="trade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-display text-3xl font-bold text-foreground">
                  <span className="text-yellow-400">⚡</span> Trade &amp; Earn
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Real-time KC price simulation — bet UP or DOWN and earn
                  profit!
                </p>
              </motion.div>
              <MarketTrend data={priceData} />
              <TradingPanel
                currentPrice={currentPrice}
                localBalance={localBalance}
                setLocalBalance={setLocalBalance}
              />
            </motion.div>
          )}

          {/* Buy & Sell */}
          {activeTab === "buysell" && (
            <motion.div
              key="buysell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Buy &amp; Sell KC
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Instantly buy or sell KiRa Coin at live market price
                </p>
              </div>
              <BuySellPanel
                currentPrice={currentPrice}
                localBalance={localBalance}
                setLocalBalance={setLocalBalance}
              />
            </motion.div>
          )}

          {/* Deposit */}
          {activeTab === "deposit" && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Deposit KiRa Coin
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Add KiRa Coins (KC) to your wallet
                </p>
              </div>
              <DepositForm />
            </motion.div>
          )}

          {/* Withdraw */}
          {activeTab === "withdraw" && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Withdraw KiRa Coin
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Transfer KiRa Coins (KC) from your wallet
                </p>
              </div>
              <WithdrawForm balance={balance} />
            </motion.div>
          )}

          {/* History */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Transaction History
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  All your deposits and withdrawals
                </p>
              </div>
              <TransactionHistory />
            </motion.div>
          )}

          {activeTab === "referral" && (
            <motion.div
              key="referral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  <span className="text-primary">🎁</span> Referral Program
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Invite friends and grow the KiRa community
                </p>
              </div>
              <ReferralPanel principal={principal} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img
              src="/assets/generated/kira-coin-logo-transparent.dim_200x200.png"
              alt="KiRa Coin"
              className="w-6 h-6 object-contain"
            />
            <span className="font-display font-bold text-foreground">
              KiRa Company
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KiRa Company &nbsp;|&nbsp; Founder
            &amp; CEO:{" "}
            <span className="text-primary font-medium">Ravina Bhatti</span>
          </p>
          <Separator className="my-3 bg-border/30" />
          <p className="text-xs text-muted-foreground/50">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
