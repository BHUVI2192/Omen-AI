import { Bell, ChevronDown, Command, Compass, FileText, Gauge, Globe, GraduationCap, LayoutDashboard, LineChart, LogOut, Menu, MessageCircle, Network, PanelLeft, Search, Sparkles, Target, UserRound, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

import { useAuth } from "@/_core/hooks/useAuth";

const studentNav = [
  { label: "Overview", href: "/app", icon: LayoutDashboard },
  { label: "Career DNA", href: "/app/profile", icon: Network },
  { label: "Market score", href: "/app/score", icon: Gauge },
  { label: "Skill gaps", href: "/app/gaps", icon: Target },
  { label: "Learning", href: "/app/learning", icon: GraduationCap },
  { label: "Bootcamps & Polls", href: "/app/bootcamps", icon: Compass },
  { label: "AI Mock Interview", href: "/app/interview", icon: MessageCircle },
  { label: "Projects", href: "/app/projects", icon: Sparkles },
  { label: "Opportunities", href: "/app/opportunities", icon: LineChart },
  { label: "External Jobs", href: "/app/external-jobs", icon: Globe },
  { label: "Applications", href: "/app/applications", icon: FileText },
];

const tpoNav = [
  { label: "Command center", href: "/tpo", icon: LayoutDashboard },
  { label: "Students", href: "/tpo/students", icon: UserRound },
  { label: "Cohorts", href: "/tpo/cohorts", icon: Network },
  { label: "Skill heatmap", href: "/tpo/skill-heatmap", icon: Target },
  { label: "Opportunities", href: "/tpo/opportunities", icon: LineChart },
  { label: "Application funnel", href: "/tpo/application-funnel", icon: FileText },
  { label: "Outcome intelligence", href: "/tpo/outcome-intelligence", icon: Gauge },
  { label: "Bootcamps & polls", href: "/tpo/bootcamps-polls", icon: GraduationCap },
];

export function OmenLogo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#d7fb61] text-[#12201b] font-display text-lg font-bold">O</div>{!compact && <span className="font-display text-lg font-bold tracking-[-.04em]">OMEN</span>}</div>;
}

export function OmenShell({ children, mode = "student" }: { children: React.ReactNode; mode?: "student" | "tpo" }) {
  const { user: authUser, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const nav = mode === "student" ? studentNav : tpoNav;
  const notifications = trpc.omen.notifications.useQuery(undefined, { staleTime: 30_000 });
  const unread = notifications.data?.filter((item) => item.unread).length ?? 2;
  const title = mode === "student" ? "Student workspace" : "TPO command center";
  const user = authUser?.name || (mode === "student" ? "Aarav Mehta" : "Dr. Rajesh Sharma");

  return <div className="min-h-screen bg-[#f5f5f1] text-[#12201b]">
    <aside className={`${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[#dce2da] bg-[#12201b] px-4 py-5 text-[#f5f5f1] transition-transform duration-200`}>
      <div className="flex items-center justify-between px-2"><OmenLogo /><button className="rounded-lg p-2 text-[#b7c1b8] hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-3"><div className="flex items-center justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.2em] text-[#9daaa1]">Workspace</div><div className="mt-1 text-sm font-semibold">{title}</div></div><ChevronDown size={15} className="text-[#9daaa1]" /></div></div>
      <nav className="mt-7 flex-1 space-y-1">{nav.map((item) => { const Icon = item.icon; const active = location === item.href || (item.href !== "/app" && location.startsWith(item.href)); return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-[#d7fb61] font-semibold text-[#12201b]" : "text-[#aab6ab] hover:bg-white/10 hover:text-white"}`}><Icon size={16} strokeWidth={active ? 2.4 : 1.8} />{item.label}</Link>; })}</nav>
      <div className="space-y-3 border-t border-white/10 pt-4"><Link href="/app/notifications" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#aab6ab] hover:bg-white/10 hover:text-white"><Bell size={16} />Notifications {unread > 0 && <span className="ml-auto rounded-full bg-[#f7b267] px-1.5 py-0.5 text-[10px] font-bold text-[#12201b]">{unread}</span>}</Link><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#aab6ab] hover:bg-white/10 hover:text-white"><LogOut size={16} />Sign out</button></div>
    </aside>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-[#12201b]/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
    <div className="lg:pl-[260px]"><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#dce2da] bg-[#f5f5f1]/90 px-4 backdrop-blur-md sm:px-7"><div className="flex items-center gap-3"><button className="rounded-xl border border-[#dce2da] bg-white p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={18} /></button><div className="hidden items-center gap-2 text-sm text-[#6b756e] sm:flex"><PanelLeft size={15} />{mode === "student" ? "My path" : "Institutional intelligence"}<span className="text-[#c0c8c0]">/</span><span className="font-medium text-[#12201b]">{pageLabel(location)}</span></div><div className="sm:hidden"><OmenLogo compact /></div></div><div className="flex items-center gap-2 sm:gap-4"><button onClick={() => setCommandOpen(!commandOpen)} className="hidden items-center gap-2 rounded-xl border border-[#dce2da] bg-white px-3 py-2 text-xs text-[#6b756e] sm:flex"><Command size={14} />Quick find <kbd className="rounded bg-[#eef1ec] px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd></button><Link href="/app/notifications" className="relative rounded-xl border border-[#dce2da] bg-white p-2.5 text-[#6b756e] hover:text-[#12201b]"><Bell size={17} />{unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#f7b267] ring-2 ring-white" />}</Link><div className="hidden h-8 w-px bg-[#dce2da] sm:block" /><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#6b78f7] font-display text-xs font-bold text-white">{user.split(" ").map((part) => part[0]).join("")}</div><div className="hidden text-left sm:block"><div className="text-xs font-semibold">{user}</div><div className="font-mono text-[10px] uppercase tracking-wide text-[#89948c]">{mode === "student" ? "Student" : "TPO admin"}</div></div></div></div></header>{commandOpen && <div className="absolute right-6 top-[64px] z-30 w-[320px] rounded-2xl border border-[#dce2da] bg-white p-3 soft-shadow"><div className="flex items-center gap-2 rounded-xl bg-[#f5f5f1] px-3 py-2 text-sm text-[#6b756e]"><Search size={15} />Search OMEN</div><div className="mt-2 space-y-1 text-sm"><Link href="/app/gaps" onClick={() => setCommandOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#f5f5f1]">Review my skill gaps</Link><Link href="/app/learning" onClick={() => setCommandOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#f5f5f1]">Start learning roadmap</Link><Link href="/app/opportunities" onClick={() => setCommandOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#f5f5f1]">Find matching opportunities</Link></div></div>}<main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 lg:px-10">{children}</main></div>
  </div>;
}

function pageLabel(location: string) { if (location === "/app" || location === "/tpo") return "Overview"; const last = location.split("/").filter(Boolean).pop() ?? "overview"; return last.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
