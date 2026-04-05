import { cn } from "@/lib/utils";
import { BlurFade, GlassButton, GradientBackground } from "@/components/ui/sign-up";
import { useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  Gem,
  Globe,
  LineChart,
  MessageCircle,
  Play,
  Shield,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

const SECTION_SCROLL_MARGIN = "scroll-mt-24";

function useAnimatedNumber(target: number, active: boolean, durationMs = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);
  return value;
}

function StatCounter({
  value,
  suffix,
  plus,
  label,
  className,
}: {
  value: number;
  suffix: string;
  plus?: boolean;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { once: true, amount: 0.6 });
  const n = useAnimatedNumber(value, active);
  return (
    <div ref={ref} className={cn("text-center", className)}>
      <p className="text-primary text-4xl font-semibold tracking-tight sm:text-5xl">
        {n.toLocaleString()}
        {plus ? "+" : ""}
        <span className="text-foreground text-2xl font-medium sm:text-3xl">{suffix}</span>
      </p>
      <p className="text-muted-foreground mt-2 text-sm font-medium">{label}</p>
    </div>
  );
}

function OpenClawMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="OpenClaw logo"
      className={cn("h-8 w-8 object-contain", className)}
    />
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
    >
      {children}
    </a>
  );
}

const painPoints = [
  {
    title: "Language & Cultural Barriers",
    desc: "Listings and support break when every market needs native nuance.",
    icon: Globe,
  },
  {
    title: "24/7 Timezone Gaps",
    desc: "Buyers expect instant answers while your team is off the clock.",
    icon: Clock,
  },
  {
    title: "Skyrocketing Labor Costs",
    desc: "Scaling people-first ops across regions erodes margin fast.",
    icon: DollarSign,
  },
];

const features: {
  title: string;
  desc: ReactNode;
  icon: LucideIcon;
}[] = [
  {
    title: "Content Engine",
    desc: "Multilingual listings, social media, and ad creatives in minutes.",
    icon: Sparkles,
  },
  {
    title: "Customer Ops",
    desc: (
      <>
        100+ languages, 83% auto-resolution rate, {'<'}30s response time.
      </>
    ),
    icon: MessageCircle,
  },
  {
    title: "Market Intelligence",
    desc: "Real-time competitor tracking, price monitoring, trend alerts.",
    icon: LineChart,
  },
  {
    title: "Secure Deployment",
    desc: "100% on-premise option. Your data never leaves your server.",
    icon: Shield,
  },
];

const comparisonRows: {
  task: string;
  traditional: ReactNode;
  openclaw: ReactNode;
}[] = [
  { task: "Multilingual TikTok Scripts", traditional: "2 hours", openclaw: "10 minutes" },
  { task: "Multi-market Listing Launch", traditional: "3 weeks", openclaw: "1–2 days" },
  {
    task: "Customer Response Time",
    traditional: "Hours",
    openclaw: (
      <>
        {'<'}30 seconds
      </>
    ),
  },
  { task: "Annual Ops Cost (10 markets)", traditional: "$150K–$250K", openclaw: "From $6,000" },
];

function FragmentationVisual() {
  const tools = ["ERP", "CRM", "Ads", "Chat", "Sheets", "BI", "Email", "Tickets"];
  return (
    <div className="relative mx-auto flex h-72 max-w-md flex-wrap items-center justify-center gap-2 p-4 sm:h-80">
      {tools.map((t, i) => (
        <div
          key={t}
          className="border-border/80 bg-card/80 text-muted-foreground rounded-full border px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm"
          style={{
            transform: `translate(${(i % 3) * 6 - 6}px, ${(i % 2) * 4 - 4}px) rotate(${(i % 5) - 2}deg)`,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}

function UnifiedVisual() {
  const modules = [
    { label: "Content Engine", className: "left-1/2 top-2 -translate-x-1/2" },
    { label: "Customer Ops", className: "right-2 top-1/2 -translate-y-1/2" },
    { label: "Market Intel", className: "bottom-2 left-1/2 -translate-x-1/2" },
    { label: "Secure Deploy", className: "left-2 top-1/2 -translate-y-1/2" },
  ];
  return (
    <div className="relative mx-auto flex h-72 max-w-md items-center justify-center sm:h-80">
      <svg className="text-primary/35 pointer-events-none absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)]" viewBox="0 0 320 320" aria-hidden>
        <line x1="160" y1="160" x2="160" y2="48" stroke="currentColor" strokeWidth="2" strokeDasharray="5 8" />
        <line x1="160" y1="160" x2="272" y2="160" stroke="currentColor" strokeWidth="2" strokeDasharray="5 8" />
        <line x1="160" y1="160" x2="160" y2="272" stroke="currentColor" strokeWidth="2" strokeDasharray="5 8" />
        <line x1="160" y1="160" x2="48" y2="160" stroke="currentColor" strokeWidth="2" strokeDasharray="5 8" />
      </svg>
      <div className="border-primary/40 bg-background/90 relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl border-2 shadow-[0_0_40px_-12px_var(--color-primary)] sm:h-28 sm:w-28">
        <Gem className="text-primary h-9 w-9 sm:h-10 sm:w-10" />
      </div>
      {modules.map((m) => (
        <div
          key={m.label}
          className={cn(
            "border-border bg-card/95 text-foreground absolute max-w-[120px] rounded-xl border px-2 py-1.5 text-center text-[10px] font-semibold leading-tight shadow-md sm:text-xs",
            m.className,
          )}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
}

export function EnterpriseOpenClawLanding() {
  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaStatus, setCtaStatus] = useState<string | null>(null);

  const submitEarlyAccess = (e: FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(ctaEmail)) {
      setCtaStatus("Please enter a valid email.");
      return;
    }
    setCtaStatus("Thanks — we'll be in touch shortly.");
    setCtaEmail("");
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-border/60 bg-background/75 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 py-3">
            <a href="#hero" className="flex items-center gap-2">
              <OpenClawMark />
              <span className="text-lg font-semibold tracking-tight">OpenClaw</span>
            </a>
            <nav className="text-muted-foreground hidden items-center gap-5 md:flex lg:gap-6">
              <NavLink href="#problem">Problem</NavLink>
              <NavLink href="#solution">Solution</NavLink>
              <NavLink href="#comparison">Compare</NavLink>
            <NavLink href="#traction">Traction</NavLink>
            <NavLink href="#market">Market</NavLink>
            <NavLink href="#cta">Contact</NavLink>
            </nav>
            <GlassButton
              type="button"
              size="sm"
              className="shrink-0"
              contentClassName="flex items-center gap-1"
              onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Early Access
            </GlassButton>
          </div>
          <nav className="border-border/60 flex gap-4 overflow-x-auto border-t px-1 py-2 md:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <NavLink href="#problem">Problem</NavLink>
            <NavLink href="#solution">Solution</NavLink>
            <NavLink href="#comparison">Compare</NavLink>
            <NavLink href="#cta">Access</NavLink>
          </nav>
        </div>
      </header>

      <section
        id="hero"
        className={cn("relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28", SECTION_SCROLL_MARGIN)}
      >
        <div className="absolute inset-0 z-0">
          <GradientBackground />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-14 text-center sm:px-10">
          <BlurFade delay={0.05}>
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.2em] uppercase">
              Enterprise OpenClaw
            </p>
          </BlurFade>
          <BlurFade delay={0.12}>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
              AI Operations for Global Cross-Border E-Commerce
            </h1>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
              One platform that runs multilingual content, customer ops, and market intelligence like an embedded
              team—so you expand markets without expanding headcount.
            </p>
          </BlurFade>
          <BlurFade delay={0.28} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <GlassButton
              type="button"
              contentClassName="flex items-center gap-2"
              onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
            >
              Request Early Access <ArrowRight className="h-4 w-4" />
            </GlassButton>
            <GlassButton
              type="button"
              size="sm"
              contentClassName="flex items-center gap-2"
              onClick={() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play className="h-4 w-4" /> Watch Demo
            </GlassButton>
          </BlurFade>
          <BlurFade delay={0.36} className="mt-10">
            <p className="text-muted-foreground text-sm font-medium">
              8 Beta Partners · 45,000+ AI Interactions · 12,000+ Listings Managed
            </p>
          </BlurFade>
        </div>
      </section>

      <section id="problem" className={cn("px-4 py-20 sm:px-6", SECTION_SCROLL_MARGIN)}>
        <div className="mx-auto max-w-6xl">
          <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">The Problem</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            74% of Cross-Border Sellers Stall at 3–5 Markets
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl text-lg">
            You already proved product-market fit—then complexity compounds: languages, time zones, tools, and headcount
            quietly cap your expansion.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {painPoints.map((p) => (
              <div
                key={p.title}
                className="border-border bg-card/40 rounded-2xl border p-6 shadow-sm backdrop-blur-sm"
              >
                <p.icon className="text-primary mb-3 h-8 w-8" />
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="border-primary/25 from-primary/15 mt-14 rounded-2xl border bg-gradient-to-br to-transparent px-8 py-10 text-center">
            <p className="text-2xl font-semibold sm:text-3xl">$551B global cross-border e-commerce market (2025)</p>
            <p className="text-muted-foreground mt-2 text-sm">The runway is enormous—the constraint is operational bandwidth.</p>
          </div>
        </div>
      </section>

      <section id="solution" className={cn("bg-card/25 px-4 py-20 sm:px-6", SECTION_SCROLL_MARGIN)}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Not Another Tool. A Complete AI Operations Team.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl">
            Replace brittle stacks with one command layer: standardized workflows, multilingual execution, and secure
            deployment options enterprises require.
          </p>

          <div className="mt-14 grid items-stretch gap-10 lg:grid-cols-2">
            <div className="border-border rounded-2xl border bg-background/60 p-6 backdrop-blur-sm">
              <p className="text-primary text-xs font-semibold tracking-wide uppercase">Fragmentation</p>
              <h3 className="mt-2 text-xl font-semibold">The Fragmentation Trap</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                A patchwork of disconnected tools slows every launch and blurs accountability.
              </p>
              <FragmentationVisual />
            </div>
            <div className="border-primary/30 rounded-2xl border bg-background/60 p-6 shadow-none backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_60px_-10px_var(--color-primary)]">
              <p className="text-primary text-xs font-semibold tracking-wide uppercase">Unified</p>
              <h3 className="mt-2 text-xl font-semibold">The Unified Solution</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                OpenClaw orchestrates modules from a single control plane with enterprise-grade guardrails.
              </p>
              <UnifiedVisual />
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="border-border bg-background/70 rounded-2xl border p-6">
                <f.icon className="text-primary mb-3 h-8 w-8" />
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="comparison" className={cn("px-4 py-20 sm:px-6", SECTION_SCROLL_MARGIN)}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What Used to Take Weeks Now Takes Hours
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            The same workflows—compressed timelines, lower cost, broader coverage.
          </p>
          <div className="border-border mt-10 overflow-hidden rounded-2xl border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-foreground border-border border-b px-4 py-3 font-semibold">Task</th>
                  <th className="text-foreground border-border border-b px-4 py-3 font-semibold">Traditional</th>
                  <th className="text-foreground border-border border-b px-4 py-3 font-semibold">With OpenClaw</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.task} className="odd:bg-background/40 even:bg-card/20">
                    <td className="border-border/60 border-b px-4 py-3 font-medium">{row.task}</td>
                    <td className="text-muted-foreground border-border/60 border-b px-4 py-3">
                      {row.traditional}
                    </td>
                    <td className="border-border/60 text-primary border-b px-4 py-3 font-semibold">
                      {row.openclaw}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-primary/25 from-primary/10 mt-8 rounded-2xl border bg-gradient-to-r to-transparent px-6 py-5 text-center text-base font-semibold">
            97% Cost Reduction · 24/7 Coverage Across 100+ Languages
          </div>
        </div>
      </section>

      <section id="traction" className={cn("bg-card/20 px-4 py-20 sm:px-6", SECTION_SCROLL_MARGIN)}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Early Traction — Proof It Works</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Real workloads, real catalogs, real response improvements across beta partners.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            <StatCounter value={8} suffix=" Beta Partners" label="Design partners shaping the roadmap" />
            <StatCounter value={12000} suffix=" Listings Managed" plus label="Across categories & channels" />
            <StatCounter value={45000} suffix=" AI Interactions" plus label="Automated customer & ops tasks" />
          </div>
          <div className="border-primary/25 from-primary/15 mt-14 rounded-2xl border bg-gradient-to-br to-transparent p-8 sm:p-10">
            <p className="text-primary text-xs font-semibold tracking-wide uppercase">Case Spotlight: Shenzhen 3C Electronics Seller</p>
            <h3 className="mt-2 text-2xl font-semibold">Operations that scaled with demand—not overtime.</h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { label: "Markets expanded", value: "3→8" },
                { label: "Ops cost reduction", value: "62%" },
                { label: "Faster response", value: "85%" },
              ].map((m) => (
                <div key={m.label} className="border-border/60 bg-background/50 rounded-xl border p-4">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">{m.label}</p>
                  <p className="mt-2 text-xl font-semibold">{m.value}</p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-6 text-center text-sm">
              3→8 Markets Expanded · 62% Ops Cost Reduction · 85% Faster Response
            </p>
          </div>
        </div>
      </section>


      <section id="market" className={cn("bg-card/15 px-4 py-20 sm:px-6", SECTION_SCROLL_MARGIN)}>
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            $7.6B AI Agent Market Today → $182.9B by 2033
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="border-border bg-background/60 rounded-2xl border p-8">
              <BarChart3 className="text-primary mx-auto h-10 w-10" />
              <p className="mt-4 text-4xl font-bold">49.6% CAGR</p>
              <p className="text-muted-foreground mt-2 text-sm">Agents moving from experiments to production budgets.</p>
            </div>
            <div className="border-border bg-background/60 rounded-2xl border p-8">
              <TrendingUp className="text-primary mx-auto h-10 w-10" />
              <p className="mt-4 text-4xl font-bold">84%</p>
              <p className="text-muted-foreground mt-2 text-sm">of enterprises see AI as core competitive advantage.</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-10 text-sm sm:text-base">
            OpenClaw targets the $551B+ global trade sector where execution speed is the real moat.
          </p>
        </div>
      </section>


      <section
        id="cta"
        className={cn("relative overflow-hidden px-4 py-24 sm:px-6", SECTION_SCROLL_MARGIN)}
      >
        <div className="absolute inset-0 z-0 opacity-55">
          <GradientBackground />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Built in Hong Kong. Scaling Globally.</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Join the beta and put an AI operations layer to work across your next markets.
          </p>
          <form onSubmit={submitEarlyAccess} className="mx-auto mt-10 max-w-xl">
            <div className="glass-input-wrap w-full">
              <div className="glass-input">
                <span className="glass-input-text-area"></span>
                <div className="relative z-10 flex w-full items-center gap-2 px-3 py-1">
                  <input
                    type="email"
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="text-foreground placeholder:text-foreground/50 h-11 flex-1 bg-transparent text-sm focus:outline-none"
                    aria-label="Email for early access"
                  />
                  <GlassButton type="submit" size="sm">
                    Get Early Access
                  </GlassButton>
                </div>
              </div>
            </div>
            {ctaStatus && <p className="text-muted-foreground mt-3 text-sm">{ctaStatus}</p>}
          </form>
          <p className="text-muted-foreground mt-8 text-sm">
            Or email directly:{" "}
            <a className="text-primary font-medium underline-offset-4 hover:underline" href="mailto:gongyingli@acuispire.com">
              gongyingli@acuispire.com
            </a>
          </p>
        </div>
      </section>

      <footer className="border-border border-t px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <OpenClawMark />
              <span className="text-lg font-semibold">OpenClaw</span>
            </div>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">
              Enterprise AI operations for brands that sell everywhere.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold">Product</p>
              <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                <li>
                  <a className="hover:text-foreground transition-colors" href="#solution">
                    Platform
                  </a>
                </li>
                <li>
                  <a className="hover:text-foreground transition-colors" href="#comparison">
                    Outcomes
                  </a>
                </li>
                <li>
                  <a className="hover:text-foreground transition-colors" href="#market">
                    Market
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Company</p>
              <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                <li>
                  <a className="hover:text-foreground transition-colors" href="#traction">
                    Traction
                  </a>
                </li>
                <li>
                  <a className="hover:text-foreground transition-colors" href="#cta">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Legal</p>
              <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                <li>
                  <span className="cursor-default">Privacy (coming soon)</span>
                </li>
                <li>
                  <span className="cursor-default">Terms (coming soon)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mx-auto mt-12 max-w-6xl border-t border-white/5 pt-8 text-center text-xs">
          © 2026 Acuispire Technology Limited, Hong Kong
        </p>
      </footer>
    </div>
  );
}
