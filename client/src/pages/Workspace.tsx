import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Award, BookOpen, BriefcaseBusiness, Check, ChevronRight, CircleAlert, ClipboardCheck, Cloud, Code2, ExternalLink, Eye, FileText, Filter, Flame, FolderGit2, GraduationCap, Globe, Layers3, Lightbulb, LineChart, Lock, Mail, MapPin, MessageCircle, MoreHorizontal, Plus, RefreshCw, Search, Send, ShieldCheck, Sparkles, Target, Upload, Users, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { OmenShell } from "@/components/OmenShell";
import { trpc } from "@/lib/trpc";

const money = (value: string) => value.replace("LPA", "LPA");
const statusStyle: Record<string, string> = { SHORTLISTED: "bg-[#d7fb61] text-[#29422e]", APPLIED: "bg-[#eef1ec] text-[#647169]", UNDER_REVIEW: "bg-[#dfe5ff] text-[#4f5cc1]", INTERVIEW: "bg-[#f7b267] text-[#5a3414]", SELECTED: "bg-[#b9efd0] text-[#225138]", "Needs rework": "bg-[#fff0de] text-[#a75b18]", Verified: "bg-[#d7fb61] text-[#29422e]", Submitted: "bg-[#dfe5ff] text-[#4f5cc1]" };

export default function Workspace({ mode = "student" }: { mode?: "student" | "tpo" }) { return mode === "tpo" ? <OmenShell mode="tpo"><TpoRouter /></OmenShell> : <OmenShell><StudentRouter /></OmenShell>; }

function StudentRouter() {
  const [location] = useLocation();
  const path = location.split("?")[0];
  if (path.startsWith("/app/profile")) return <ProfilePage />;
  if (path.startsWith("/app/score")) return <ScorePage />;
  if (path.startsWith("/app/careers")) return <CareerPage />;
  if (path.startsWith("/app/gaps")) return <GapsPage />;
  if (path.startsWith("/app/learning")) return <LearningPage />;
  if (path.startsWith("/app/bootcamps")) return <StudentBootcampsPage />;
  if (path.startsWith("/app/interview")) return <MockInterviewPage />;
  if (path.startsWith("/app/projects")) return <ProjectsPage />;
  if (path.startsWith("/app/opportunities")) return <OpportunitiesPage />;
  if (path.startsWith("/app/external-jobs")) return <ExternalJobsPage />;
  if (path.startsWith("/app/applications")) return <ApplicationsPage />;
  if (path.startsWith("/app/notifications")) return <NotificationsPage />;
  return <StudentDashboard />;
}

function TpoRouter() {
  const [location] = useLocation();
  const path = location.split("?")[0];
  if (path.startsWith("/tpo/students")) return <TpoStudents />;
  if (path.startsWith("/tpo/cohorts")) return <TpoCohorts />;
  if (path.startsWith("/tpo/skill-heatmap") || path.startsWith("/tpo/skill-intelligence")) return <TpoSkillIntelligence />;
  if (path.startsWith("/tpo/opportunities")) return <TpoOpportunities />;
  if (path.startsWith("/tpo/application-funnel") || path.startsWith("/tpo/applications")) return <TpoApplications />;
  if (path.startsWith("/tpo/outcome-intelligence") || path.startsWith("/tpo/outcomes")) return <TpoOutcomes />;
  if (path.startsWith("/tpo/bootcamps-polls") || path.startsWith("/tpo/bootcamps")) return <TpoBootcamps />;
  return <TpoDashboard />;
}

function PageHeader({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: React.ReactNode }) { return <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><div className="font-mono text-[10px] uppercase tracking-[.2em] text-[#6b78f7]">{eyebrow}</div><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.06em] sm:text-5xl">{title}</h1><p className="mt-3 max-w-[620px] text-sm leading-6 text-[#6b756e]">{copy}</p></div>{action}</div>; }
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const bgClass = className.includes("bg-") ? "" : "bg-white";
  return <div className={`rounded-2xl border border-[#dce2da] ${bgClass} p-5 ${className}`}>{children}</div>;
}
function TinyLabel({ children }: { children: React.ReactNode }) { return <div className="font-mono text-[10px] uppercase tracking-[.18em] text-[#89948c]">{children}</div>; }
function Tag({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "lime" | "blue" | "orange" }) { const tones = { gray: "bg-[#eef1ec] text-[#5c6b61]", lime: "bg-[#d7fb61] text-[#29422e]", blue: "bg-[#dfe5ff] text-[#4f5cc1]", orange: "bg-[#fff0de] text-[#a75b18]" }; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>; }
function SectionLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="flex items-center gap-1 text-xs font-semibold text-[#627069] hover:text-[#12201b]">{children}<ArrowRight size={13} /></Link>; }
function Metric({ label, value, note, accent = "#d7fb61", delta }: { label: string; value: string; note: string; accent?: string; delta?: string }) { return <Card className="relative overflow-hidden"><div className="absolute right-0 top-0 h-1 w-20" style={{ background: accent }} /><TinyLabel>{label}</TinyLabel><div className="mt-3 flex items-end justify-between"><div className="font-display text-3xl font-bold tracking-[-.06em]">{value}</div>{delta && <span className="flex items-center gap-1 text-xs font-semibold text-[#4d7459]"><ArrowUpRight size={13} />{delta}</span>}</div><div className="mt-2 text-xs text-[#78847b]">{note}</div></Card>; }

function StudentDashboard() {
  const query = trpc.omen.dashboard.useQuery(undefined, { staleTime: 30_000 });
  const data = query.data;
  const applyMutation = trpc.omen.applyToJob.useMutation({ onSuccess: (result) => { if (result.ok) toast.success("Application recorded", { description: "Open the external portal when you are ready to submit." }); else toast.message(result.message); } });
  if (!data) return <LoadingState label="Loading your career signal" />;
  return <div><PageHeader eyebrow="Monday · September 11, 2026" title={`Good morning, ${data.student.name.split(" ")[0]}.`} copy="Your next move is clearer when the signal is visible. Here is what changed since your last check-in." action={<div className="flex items-center gap-2"><Tag tone="lime">DEVELOPMENT SNAPSHOT</Tag><button onClick={() => query.refetch()} className="rounded-xl border border-[#dce2da] bg-white p-2.5 text-[#6b756e] hover:text-[#12201b]" aria-label="Refresh"><RefreshCw size={16} /></button></div>} />
    <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr_1fr]"><Card className="relative overflow-hidden bg-[#12201b] text-white xl:row-span-2"><div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[#d7fb61]/20 blur-3xl" /><div className="relative flex items-start justify-between"><div><TinyLabel>Market employability score</TinyLabel><div className="mt-3 font-display text-7xl font-bold tracking-[-.09em]">{data.score.total}<span className="text-2xl text-[#aab8ad]">/100</span></div><div className="mt-2 flex items-center gap-2 text-xs text-[#b9c7bb]"><span className="rounded-full bg-[#d7fb61] px-2 py-1 font-semibold text-[#29422e]">+8 this month</span>Career Readiness Score · v2026.1</div></div><div className="relative grid h-20 w-20 place-items-center rounded-full score-ring"><span className="relative z-10 font-mono text-xs font-medium">72%</span></div></div><div className="relative mt-10 border-t border-white/10 pt-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold">What is moving the signal</span><Link href="/app/score" className="text-[#d7fb61]"><ArrowRight size={16} /></Link></div><div className="mt-4 space-y-3">{[["Verified project", "+14", "#d7fb61"], ["Python + Git coverage", "+11", "#d7fb61"], ["SQL market gap", "−08", "#f7b267"]].map(([label, value, color]) => <div key={label} className="flex items-center justify-between text-xs"><span className="text-[#b9c7bb]">{label}</span><span className="font-mono" style={{ color }}>{value}</span></div>)}</div></div><div className="relative mt-9 flex items-center gap-2 text-xs text-[#93a499]"><Lock size={13} /> Score uses explainable rules, not hiring probability.</div></Card><Metric label="Career role matches" value="12" note="3 strong matches this week" accent="#6b78f7" delta="+3" /><Metric label="Learning momentum" value="38%" note="SQL for Career Readiness" accent="#f7b267" delta="+12%" /><Card className="xl:col-span-2"><div className="flex items-center justify-between"><div><TinyLabel>Readiness over time</TinyLabel><div className="mt-1 text-sm font-semibold">Small steps, compounding signal</div></div><Tag tone="blue">Last 30 days</Tag></div><div className="mt-5 h-[150px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{ day: "Aug 12", score: 60 }, { day: "Aug 18", score: 63 }, { day: "Aug 24", score: 62 }, { day: "Aug 30", score: 67 }, { day: "Sep 05", score: 70 }, { day: "Sep 11", score: 72 }]}><defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6b78f7" stopOpacity={.28} /><stop offset="100%" stopColor="#6b78f7" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0ec" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a096" }} /><YAxis hide domain={[55, 80]} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dce2da", fontSize: 12 }} /><Area type="monotone" dataKey="score" stroke="#6b78f7" strokeWidth={3} fill="url(#scoreFill)" /></AreaChart></ResponsiveContainer></div></Card></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><Card><div className="flex items-center justify-between"><div><TinyLabel>Next best moves</TinyLabel><div className="mt-1 text-lg font-semibold">Make your signal more useful</div></div><SectionLink href="/app/gaps">See all gaps</SectionLink></div><div className="mt-5 space-y-3">{[{ icon: Code2, title: "Raise SQL from 43 → 75", copy: "The most repeated skill across your top matches.", tag: "High impact", tone: "orange" as const, href: "/app/gaps" }, { icon: Cloud, title: "Get cloud exposure", copy: "Complete the AWS deployment task in your roadmap.", tag: "Market signal", tone: "blue" as const, href: "/app/learning" }, { icon: BriefcaseBusiness, title: "Add project evidence", copy: "Submit your Peer Study Rooms rework for review.", tag: "Recommended", tone: "lime" as const, href: "/app/projects" }].map((item) => { const Icon = item.icon; return <Link href={item.href} key={item.title} className="group flex items-center gap-3 rounded-xl border border-[#edf0ec] p-3 hover:border-[#aab7aa]"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef1ec] group-hover:bg-[#d7fb61]"><Icon size={16} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-sm font-semibold">{item.title}<Tag tone={item.tone}>{item.tag}</Tag></div><div className="mt-1 text-xs text-[#78847b]">{item.copy}</div></div><ChevronRight className="text-[#a0aaa2]" size={16} /></Link>; })}</div></Card><Card><div className="flex items-center justify-between"><div><TinyLabel>Role matches</TinyLabel><div className="mt-1 text-lg font-semibold">Where your signal fits</div></div><SectionLink href="/app/careers">Explore</SectionLink></div><div className="mt-5 space-y-3">{data.topRoles.map((match) => <Link href={`/app/careers?role=${match.role.id}`} key={match.role.id} className="flex items-center gap-3 rounded-xl bg-[#f5f5f1] p-3 hover:bg-[#eef1ec]"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#12201b] font-display font-bold text-white shadow-sm">{match.score}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{match.role.title}</div><div className="mt-1 text-xs text-[#7d8980]">{match.missingSkills.length ? `${match.missingSkills.join(", ")} to strengthen` : "Strong coverage across required skills"}</div></div><ArrowRight size={15} className="text-[#9ba69d]" /></Link>)}</div></Card></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]"><Card><div className="flex items-center justify-between"><div><TinyLabel>Matched opportunity</TinyLabel><div className="mt-1 text-lg font-semibold">Worth a closer look</div></div><SectionLink href="/app/opportunities">All opportunities</SectionLink></div>{data.opportunities.slice(0, 1).map((job) => <div key={job.id} className="mt-5 rounded-xl border border-[#dce2da] p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-semibold text-[#6b78f7]">{job.company}</div><div className="mt-1 text-base font-semibold">{job.title}</div><div className="mt-2 flex flex-wrap gap-3 text-xs text-[#78847b]"><span className="flex items-center gap-1"><MapPin size={13} />{job.location}</span><span className="flex items-center gap-1"><Award size={13} />{money(job.ctc)}</span></div></div><Tag tone="lime">{job.score}% match</Tag></div><div className="mt-4 flex flex-wrap items-center gap-2">{job.requiredSkills.map((skill) => <span key={skill} className={`rounded-md px-2 py-1 text-[10px] font-mono ${job.matchedSkills.includes(skill) ? "bg-[#e7f5d0] text-[#4c6e3d]" : "bg-[#fff0de] text-[#a75b18]"}`}>{skill}</span>)}</div><div className="mt-4 flex items-center justify-between"><span className="text-xs text-[#78847b]">Apply by {new Date(job.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span><button onClick={() => applyMutation.mutate({ jobId: job.id })} className="rounded-lg bg-[#12201b] px-3 py-2 text-xs font-semibold text-white">{(job as typeof job & { applied?: boolean }).applied ? "Applied" : "Record application"}</button></div></div>)}</Card><Card><div className="flex items-center justify-between"><div><TinyLabel>Recent activity</TinyLabel><div className="mt-1 text-lg font-semibold">Your trail this week</div></div><SectionLink href="/app/notifications">See all</SectionLink></div><div className="mt-4 divide-y divide-[#edf0ec]">{data.recentActivity.map((item) => <div key={item.title} className="flex gap-3 py-3"><div className="mt-1 h-2 w-2 rounded-full bg-[#6b78f7]" /><div><div className="text-sm font-semibold">{item.title}</div><div className="mt-1 text-xs text-[#78847b]">{item.body}</div></div></div>)}</div></Card></div>
  </div>;
}

function ScorePage() {
  const dashboard = trpc.omen.dashboard.useQuery();
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [target, setTarget] = useState(75);
  const whatIf = trpc.omen.whatIf.useQuery({ skillName: "SQL", current: 43, target }, { enabled: whatIfOpen });
  if (!dashboard.data) return <LoadingState label="Calculating your signal" />;
  const score = dashboard.data.score;
  return <div><PageHeader eyebrow="Market score" title="See the signal. Use the signal." copy="Your score is a transparent readiness heuristic — not a hiring probability. It combines your evidence with the latest stored market snapshot." action={<Tag tone="blue">Score version 2026.1</Tag>} /><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><Card className="bg-[#12201b] text-white"><TinyLabel>Career readiness score</TinyLabel><div className="mt-4 flex items-center gap-7"><div className="relative grid h-40 w-40 shrink-0 place-items-center rounded-full score-ring"><div className="relative z-10 text-center"><div className="font-display text-5xl font-bold tracking-[-.08em]">{score.total}</div><div className="font-mono text-[10px] text-[#bdc9bf]">OUT OF 100</div></div></div><div><div className="text-sm font-semibold">A credible starting point</div><p className="mt-2 text-xs leading-5 text-[#aebcb0]">Your verified work and strong programming foundation are creating positive momentum.</p><div className="mt-4 flex items-center gap-2"><span className="rounded-full bg-[#d7fb61] px-2 py-1 text-[10px] font-bold text-[#29422e]">+8</span><span className="text-xs text-[#b2c0b4]">vs. previous snapshot</span></div></div></div><div className="mt-8 border-t border-white/10 pt-5"><div className="flex items-center gap-2 text-xs text-[#aebcb0]"><Lock size={13} /> We do not use this to predict hiring outcomes.</div></div></Card><Card><div className="flex items-center justify-between"><div><TinyLabel>Score composition</TinyLabel><div className="mt-1 text-lg font-semibold">What contributes to the number</div></div><CircleAlert size={18} className="text-[#89948c]" /></div><div className="mt-6 space-y-5">{[["Skill coverage", score.skillCoverage, "42% weight", "#6b78f7"], ["Assessment readiness", score.assessments, "18% weight", "#d7fb61"], ["Verified projects", score.verified, "16% weight", "#f7b267"], ["Experience evidence", score.experience, "14% weight", "#91a9ff"], ["Communication readiness", score.communication, "10% weight", "#c7d4c7"]].map(([label, value, weight, color]) => <div key={label as string}><div className="flex items-center justify-between text-sm"><span>{label}</span><span className="font-mono text-xs text-[#77847b]">{value}/100 · {weight}</span></div><div className="mt-2 h-2 rounded-full bg-[#e9ede8]"><div className="h-2 rounded-full" style={{ width: `${value}%`, background: color as string }} /></div></div>)}</div></Card></div><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.8fr]"><Card><TinyLabel>Explainability</TinyLabel><h2 className="mt-1 text-lg font-semibold">Context behind your score</h2><div className="mt-5 grid gap-4 sm:grid-cols-3"><div className="rounded-xl bg-[#eff6df] p-4"><div className="text-xs font-bold text-[#557143]">Positive factors</div><div className="mt-3 space-y-2 text-xs text-[#4d644c]"><div>✓ Verified project impact</div><div>✓ Python proficiency</div><div>✓ Git confidence</div><div>✓ 4 month internship</div></div></div><div className="rounded-xl bg-[#fff2e4] p-4"><div className="text-xs font-bold text-[#a75b18]">Improvement areas</div><div className="mt-3 space-y-2 text-xs text-[#855a2d]"><div>→ SQL proficiency</div><div>→ Cloud exposure</div><div>→ Communication readiness</div></div></div><div className="rounded-xl bg-[#eef1ff] p-4"><div className="text-xs font-bold text-[#5460bc]">Market factors</div><div className="mt-3 space-y-2 text-xs text-[#5962a1]"><div>↗ SQL demand: 91/100</div><div>↗ Full stack demand: 88/100</div><div>↗ Snapshot: Sep 09</div></div></div></div></Card><Card><div className="flex items-center justify-between"><div><TinyLabel>What-if simulator</TinyLabel><h2 className="mt-1 text-lg font-semibold">See projected impact</h2></div><Lightbulb className="text-[#f7b267]" size={20} /></div><p className="mt-3 text-xs leading-5 text-[#78847b]">What if you improve SQL from 43 to 75? Use this to plan, not to promise an outcome.</p><div className="mt-6 flex items-center justify-between text-sm"><span>SQL proficiency</span><span className="font-mono text-xs">43 → {target}</span></div><input type="range" min="43" max="95" value={target} onChange={(event) => { setTarget(Number(event.target.value)); setWhatIfOpen(true); }} className="mt-4 w-full accent-[#6b78f7]" /><div className="mt-6 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#f5f5f1] p-3"><TinyLabel>Score</TinyLabel><div className="mt-1 text-lg font-bold">{whatIf.data?.after ?? 77}<span className="ml-1 text-xs font-normal text-[#4d7459]">+{whatIf.data?.scoreDelta ?? 5}</span></div></div><div className="rounded-xl bg-[#f5f5f1] p-3"><TinyLabel>Role match</TinyLabel><div className="mt-1 text-lg font-bold">{whatIf.data?.roleMatchAfter ?? 78}%</div></div></div><div className="mt-4 text-[11px] text-[#89948c]">Projected impact · not a guaranteed outcome</div></Card></div></div>;
}

function CareerPage() {
  const roles = trpc.omen.roles.useQuery();
  const [search, setSearch] = useState("");
  const saveRole = trpc.omen.saveRole.useMutation({ onSuccess: () => toast.success("Role saved to your career DNA") });
  const filtered = roles.data?.filter((item) => item.role.title.toLowerCase().includes(search.toLowerCase())) ?? [];
  return <div><PageHeader eyebrow="Career explorer" title="Roles with a reason." copy="Explore the roles where your current signal is strongest, see what is missing, and choose a learning move that compounds." action={<div className="relative"><Search className="absolute left-3 top-2.5 text-[#89948c]" size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles" className="w-52 rounded-xl border border-[#dce2da] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#6b78f7]" /></div>} /><div className="grid gap-4 md:grid-cols-2">{filtered.map((match) => <Card key={match.role.id} className="card-lift"><div className="flex items-start justify-between gap-3"><div><div className="font-mono text-[10px] uppercase tracking-[.16em] text-[#6b78f7]">{match.role.demand}% current demand</div><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-.04em]">{match.role.title}</h2><p className="mt-2 text-sm leading-5 text-[#6d796f]">{match.role.description}</p></div><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#12201b] text-center text-white"><div className="font-display text-xl font-bold">{match.score}</div><div className="font-mono text-[8px] text-[#b5c2b7]">MATCH</div></div></div><div className="mt-5 flex flex-wrap gap-2">{match.role.requiredSkills.map((skill) => <span key={skill} className={`rounded-md px-2 py-1 text-[10px] font-mono ${match.missingSkills.includes(skill) ? "bg-[#fff0de] text-[#a75b18]" : "bg-[#e7f5d0] text-[#4c6e3d]"}`}>{skill}{match.missingSkills.includes(skill) ? " · gap" : " ✓"}</span>)}</div><div className="mt-6 flex items-center justify-between border-t border-[#edf0ec] pt-4"><div className="text-xs text-[#78847b]">Typical range · {match.role.salary}</div><div className="flex items-center gap-2"><button onClick={() => saveRole.mutate({ roleId: match.role.id })} className="rounded-lg border border-[#dce2da] px-3 py-2 text-xs font-semibold hover:bg-[#f5f5f1]">Save role</button><Link href={`/app/careers/${match.role.id}`} className="rounded-lg bg-[#12201b] px-3 py-2 text-xs font-semibold text-white">View role <ArrowRight className="ml-1 inline" size={13} /></Link></div></div></Card>)}</div></div>;
}

function GapsPage() {
  const gaps = trpc.omen.gaps.useQuery();
  return <div><PageHeader eyebrow="Skill gaps" title="Close the gaps that matter." copy="These are not deficits as identity. They are specific, measurable opportunities created by the roles you said you care about." action={<Tag tone="orange">3 priority moves</Tag>} /><div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]"><Card><div className="flex items-center justify-between"><div><TinyLabel>Market vs. current signal</TinyLabel><div className="mt-1 text-lg font-semibold">Your opportunity gap map</div></div><button className="rounded-lg border border-[#dce2da] p-2 text-[#6b756e]"><Filter size={15} /></button></div><div className="mt-6 space-y-5">{(gaps.data ?? []).map((gap, index) => <div key={gap.id}><div className="flex items-end justify-between"><div><div className="flex items-center gap-2 text-sm font-semibold">{gap.name} {gap.priority === "High" && <Tag tone="orange">High impact</Tag>}</div><div className="mt-1 text-xs text-[#78847b]">Demand {gap.marketDemand}/100 · target {gap.target}/100</div></div><div className="font-mono text-xs text-[#89948c]">{gap.proficiency} → {gap.target}</div></div><div className="relative mt-3 h-3 rounded-full bg-[#e7ece6]"><div className="absolute left-0 top-0 h-3 rounded-full bg-[#12201b]" style={{ width: `${gap.proficiency}%` }} /><div className="absolute top-[-3px] h-5 w-0.5 bg-[#f7b267]" style={{ left: `${gap.target}%` }} /><div className="absolute -top-1 h-5 w-1 rounded-full bg-[#6b78f7]" style={{ left: `${gap.marketDemand}%` }} /></div>{index < 3 && <div className="mt-2 flex items-center gap-4 text-[10px] text-[#89948c]"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#12201b]" /> Current</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f7b267]" /> Target</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#6b78f7]" /> Market demand</span></div>}</div>)}</div></Card><Card className="bg-[#eef1ff]"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#6b78f7] text-white"><Target size={18} /></div><h2 className="mt-5 font-display text-2xl font-semibold tracking-[-.04em]">Your highest-leverage move</h2><p className="mt-3 text-sm leading-6 text-[#5d659a]">SQL appears across 3 of your top 5 role matches. Raising it from 43 to 75 is projected to reduce your closest role gap by 28 points.</p><Link href="/app/learning" className="mt-6 inline-flex items-center rounded-xl bg-[#12201b] px-4 py-3 text-xs font-semibold text-white">Open SQL roadmap <ArrowRight className="ml-2" size={14} /></Link><div className="mt-8 border-t border-[#d4daf7] pt-4 text-[11px] text-[#6c74a7]">Based on development market snapshot · Sep 09, 2026</div></Card></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><Card><TinyLabel>Opportunity gap</TinyLabel><div className="mt-2 font-display text-3xl font-bold">43 pts</div><div className="mt-1 text-xs text-[#78847b]">SQL demand vs. coverage</div></Card><Card><TinyLabel>Market demand</TinyLabel><div className="mt-2 font-display text-3xl font-bold">91<span className="text-base text-[#89948c]">/100</span></div><div className="mt-1 text-xs text-[#78847b]">Across stored job snapshots</div></Card><Card><TinyLabel>Roles unlocked</TinyLabel><div className="mt-2 font-display text-3xl font-bold">+4</div><div className="mt-1 text-xs text-[#78847b]">with target proficiency</div></Card></div></div>;
}

function LearningPage() {
  const courses = trpc.omen.courses.useQuery();
  const submitProject = trpc.omen.submitCourseProject.useMutation({
    onSuccess: () => {
      toast.success("Capstone Project Submitted to TPO for Review!", {
        description: "TPO will evaluate your code and grant verified skill points upon approval.",
      });
      setProjectOpen(false);
    },
  });

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [projectOpen, setProjectOpen] = useState<boolean>(false);
  const [projectForm, setProjectForm] = useState({ title: "", githubUrl: "", liveUrl: "", notes: "" });
  const [customVideoUrl, setCustomVideoUrl] = useState<string>("");

  const activeCourse = (courses.data ?? []).find((c) => c.id === activeCourseId);

  if (courses.isLoading) return <LoadingState label="Loading learning roadmaps" />;

  // LEVEL 1: COURSE CATALOG GRID
  if (!activeCourseId || !activeCourse) {
    return (
      <div>
        <PageHeader
          eyebrow="Learning loop"
          title="Interactive Career Roadmaps."
          copy="Select a course module to start studying. Master production skills through 10-15 structured lessons, inline milestone quizzes, and TPO-verified capstone projects."
          action={<Tag tone="lime">4 Active Roadmaps</Tag>}
        />

        <div className="grid gap-5 md:grid-cols-2">
          {(courses.data ?? []).map((c) => (
            <Card key={c.id} className="flex flex-col justify-between hover:border-[#6b78f7] transition-all card-lift">
              <div>
                <div className="flex items-center justify-between">
                  <Tag tone={c.category === "Data" ? "lime" : c.category === "Cloud" ? "blue" : "orange"}>
                    {c.category} · {c.level}
                  </Tag>
                  <span className="font-mono text-xs font-bold text-[#4c6e3d] bg-[#eff6df] px-2.5 py-1 rounded-full">
                    {c.progress}% Completed
                  </span>
                </div>

                <h2 className="mt-4 font-display text-2xl font-bold text-[#12201b]">{c.title}</h2>
                <p className="mt-2 text-xs leading-5 text-[#5c6b61]">{c.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-[#edf0ec] text-[11px] font-semibold text-[#12201b]">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 py-3 border-y border-[#edf0ec] text-center text-xs">
                  <div>
                    <div className="font-bold text-[#12201b]">{c.hours} hrs</div>
                    <div className="text-[10px] text-[#78847b]">Duration</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#12201b]">{c.videos.length} Videos</div>
                    <div className="text-[10px] text-[#78847b]">10-15m each</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#12201b]">{c.quizzes.length} Quizzes</div>
                    <div className="text-[10px] text-[#78847b]">Milestones</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveCourseId(c.id);
                  setSelectedVideoIndex(0);
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-6 w-full py-3 bg-[#12201b] text-white text-xs font-bold rounded-xl hover:bg-[#20332b] flex items-center justify-center gap-2"
              >
                Start Studying / View Course <ArrowRight size={15} />
              </button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // LEVEL 2: COURSE CLASSROOM VIEW
  const currentVideo = activeCourse.videos[selectedVideoIndex] || activeCourse.videos[0];
  const activeQuiz = activeCourse.quizzes[0];

  const getEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/HXV3zeQKqGY?rel=0";
    let id = "";
    if (url.includes("watch?v=")) {
      id = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      id = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("embed/")) {
      id = url.split("embed/")[1]?.split("?")[0] || "";
    } else {
      id = url;
    }
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1`;
  };

  return (
    <div>
      <button
        onClick={() => setActiveCourseId(null)}
        className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[#12201b] hover:text-[#6b78f7] bg-white border border-[#dce2da] px-3.5 py-2 rounded-xl"
      >
        <ArrowLeft size={15} /> ← Back to All Courses
      </button>

      <PageHeader
        eyebrow={`Classroom · ${activeCourse.category}`}
        title={activeCourse.title}
        copy={activeCourse.description}
        action={<Tag tone="lime">{activeCourse.level} Level</Tag>}
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <div className="space-y-6">
          <Card className="bg-[#12201b] text-white">
            <div className="flex items-center justify-between">
              <TinyLabel>Lesson {selectedVideoIndex + 1} of {activeCourse.videos.length}</TinyLabel>
              <span className="font-mono text-xs text-[#d7fb61] bg-white/10 px-2.5 py-1 rounded-full font-bold">
                {currentVideo.duration} (Max 15m)
              </span>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold">{currentVideo.title}</h2>
            <p className="mt-1 text-xs text-[#aebcb0]">{currentVideo.description}</p>

            <div className="mt-5 relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10">
              <iframe
                src={getEmbedUrl(customVideoUrl || currentVideo.url)}
                title={currentVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#aebcb0]">
              <div className="flex-1 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-[#d7fb61] shrink-0">Test Video Link:</span>
                <input
                  type="text"
                  placeholder="Paste YouTube Video URL to test (e.g. https://www.youtube.com/watch?v=...)"
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  className="w-full rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#d7fb61] font-mono"
                />
              </div>
              <a
                href={customVideoUrl || currentVideo.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#d7fb61] font-bold hover:underline shrink-0 flex items-center gap-1"
              >
                Open Video in Tab <ExternalLink size={12} />
              </a>
            </div>
          </Card>

          {activeQuiz && (
            <Card className="border-2 border-[#6b78f7]/30 bg-[#f8f9ff]">
              <div className="flex items-center justify-between border-b border-[#dce2da] pb-3 mb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#6b78f7] font-bold">
                    Inline Milestone Assessment
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#12201b]">{activeQuiz.title}</h3>
                </div>
                <Tag tone="blue">{activeQuiz.questions.length} Questions</Tag>
              </div>

              <div className="space-y-5">
                {activeQuiz.questions.map((q: any, qIdx: number) => (
                  <div key={q.id} className="p-4 rounded-xl bg-white border border-[#dce2da]">
                    <div className="text-xs font-bold text-[#12201b] mb-3">
                      {qIdx + 1}. {q.question}
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt: string, optIdx: number) => {
                        const selected = quizAnswers[q.id] === optIdx;
                        const isCorrect = optIdx === q.answerIndex;
                        return (
                          <button
                            key={opt}
                            onClick={() => !quizSubmitted && setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                              quizSubmitted
                                ? isCorrect
                                  ? "bg-[#e7f5d0] border-[#4c6e3d] text-[#29422e] font-bold"
                                  : selected
                                  ? "bg-[#fff0de] border-[#a75b18] text-[#a75b18]"
                                  : "bg-white text-[#5c6b61] border-[#dce2da]"
                                : selected
                                ? "bg-[#12201b] text-white border-[#12201b]"
                                : "bg-white text-[#12201b] border-[#dce2da] hover:bg-[#edf0ec]"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div className="mt-3 p-3 rounded-lg bg-[#eff6df] text-[#29422e] text-xs leading-5 border border-[#c8e2a3]">
                        <span className="font-bold">Explanation:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    onClick={() => {
                      setQuizSubmitted(true);
                      toast.success("Milestone Quiz Completed!", { description: "Your answers have been evaluated." });
                    }}
                    className="w-full py-3 bg-[#12201b] text-white text-xs font-bold rounded-xl hover:bg-[#20332b]"
                  >
                    Submit Answers for Instant Evaluation
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="w-full py-3 border border-[#dce2da] bg-white text-[#12201b] text-xs font-bold rounded-xl hover:bg-[#f5f5f1]"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <TinyLabel>Curriculum Lessons ({activeCourse.videos.length} Videos · 10-15m each)</TinyLabel>
            <div className="mt-3 space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {activeCourse.videos.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => {
                    setSelectedVideoIndex(idx);
                    setCustomVideoUrl("");
                  }}
                  className={`w-full p-3 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                    selectedVideoIndex === idx
                      ? "bg-[#12201b] text-white border-[#12201b] font-bold"
                      : "bg-[#f5f5f1] text-[#12201b] border-[#dce2da] hover:bg-[#edf0ec]"
                  }`}
                >
                  <span className="truncate flex-1 pr-2">{vid.title}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/20 text-current">{vid.duration}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-[#eff6df] border-[#c8e2a3]">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#4c6e3d]" />
              <TinyLabel>Capstone Project Verification</TinyLabel>
            </div>
            <h3 className="mt-2 text-base font-bold text-[#29422e]">Earn Verified Skill Points</h3>
            <p className="mt-2 text-xs leading-5 text-[#4d644c]">{activeCourse.finalProjectPrompt}</p>
            <Link
              href={`/app/projects?upload=true&title=${encodeURIComponent(`${activeCourse.skills[0]} Capstone Project`)}`}
              className="mt-4 w-full py-2.5 bg-[#12201b] text-white text-xs font-bold rounded-xl hover:bg-[#20332b] flex items-center justify-center gap-2"
            >
              Submit Capstone to TPO <Upload size={14} />
            </Link>
          </Card>

          <Card>
            <TinyLabel>Curated Web Docs & Guides</TinyLabel>
            <div className="mt-3 space-y-2">
              {activeCourse.docs.map((doc) => (
                <a
                  key={doc.title}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f5f5f1] border border-[#dce2da] hover:bg-[#edf0ec] text-xs font-bold text-[#12201b]"
                >
                  <span>{doc.title}</span>
                  <Tag tone="blue">{doc.type}</Tag>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProjectsPage() {
  const projects = trpc.omen.projects.useQuery();
  const utils = trpc.useUtils();
  const [, setLocation] = useLocation();

  const searchParams = new URLSearchParams(window.location.search);
  const initialUpload = searchParams.get("upload") === "true";
  const initialTitle = searchParams.get("title") || "";

  const [isSubmittingPage, setIsSubmittingPage] = useState(initialUpload);
  const [form, setForm] = useState({
    title: initialTitle,
    description: "",
    githubUrl: "",
    liveUrl: "",
    skillsInput: "React, Python, SQL",
  });

  useEffect(() => {
    if (initialUpload) {
      setIsSubmittingPage(true);
      if (initialTitle) {
        setForm((prev) => ({ ...prev, title: initialTitle }));
      }
    }
  }, [initialUpload, initialTitle]);

  const submit = trpc.omen.submitProject.useMutation({
    onSuccess: () => {
      toast.success("Project evidence submitted directly to TPO Command Center!", {
        description: "TPO officers will review your GitHub repository and live demo to verify institutional skill points.",
      });
      projects.refetch();
      utils.omen.getPendingProjectSubmissions.invalidate();
      setIsSubmittingPage(false);
      setLocation("/app/projects");
      setForm({ title: "", description: "", githubUrl: "", liveUrl: "", skillsInput: "React, Python, SQL" });
    },
  });

  // FULL PAGE WORKSPACE VIEW FOR PROJECT EVIDENCE UPLOAD
  if (isSubmittingPage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSubmittingPage(false)}
            className="rounded-xl border border-[#dce2da] bg-white px-4 py-2 text-xs font-bold text-[#12201b] hover:bg-[#edf0ec] flex items-center gap-2"
          >
            ← Back to Project Evidence Studio
          </button>
          <Tag tone="lime">Full-Page Evidence Upload Studio</Tag>
        </div>

        <PageHeader
          eyebrow="Evidence Studio · Full-Page Workspace"
          title="Submit Project Evidence for TPO Verification"
          copy="Submit your project code repository, live demo URL, problem statement, and implementation notes directly to the TPO Command Center for institutional skill point verification."
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#12201b] mb-1.5">
                Project Title <span className="text-[#a75b18]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Campus Mobility & Commute Dashboard"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-4 py-3 text-sm text-[#12201b] font-semibold focus:bg-white focus:outline-none focus:border-[#6b78f7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12201b] mb-1.5">
                What Did You Build? (Problem Statement & Architectural Contribution) <span className="text-[#a75b18]">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe the problem, your technical contribution, frameworks used, and measurable impact..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-4 py-3 text-sm text-[#12201b] focus:bg-white focus:outline-none focus:border-[#6b78f7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12201b] mb-1.5 flex items-center justify-between">
                <span>Technologies & Skills Demonstrated</span>
                <span className="font-mono text-[10px] text-[#6b78f7]">Comma-separated tags</span>
              </label>
              <input
                type="text"
                placeholder="e.g. React, TypeScript, FastAPI, PostgreSQL, AWS"
                value={form.skillsInput}
                onChange={(e) => setForm({ ...form, skillsInput: e.target.value })}
                className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-4 py-3 text-sm font-mono text-[#12201b] focus:bg-white focus:outline-none focus:border-[#6b78f7]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#12201b] mb-1.5">
                  GitHub Code Repository URL <span className="text-[#a75b18]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/username/project"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-4 py-3 text-sm text-[#6b78f7] font-mono focus:bg-white focus:outline-none focus:border-[#6b78f7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12201b] mb-1.5">
                  Live Demo URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://my-project-demo.vercel.app"
                  value={form.liveUrl}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                  className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-4 py-3 text-sm text-[#12201b] font-mono focus:bg-white focus:outline-none focus:border-[#6b78f7]"
                />
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-[#12201b] text-white">
              <TinyLabel>TPO Verification Stream</TinyLabel>
              <h3 className="text-lg font-bold mt-2">Institutional Review Flow</h3>
              <p className="mt-2 text-xs leading-5 text-[#aebcb0]">
                Upon submission, all project information (code repo, live demo, and skills) is routed to the <strong>TPO Command Center</strong> queue where placement officers inspect artifacts and grant verified skill points.
              </p>
              <div className="mt-5 space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-[#d7fb61]">
                  <Check size={14} /> Instant notification sent to TPO Officer
                </div>
                <div className="flex items-center gap-2 text-[#b9c7bb]">
                  <Check size={14} /> Code repository linked to candidate DNA
                </div>
                <div className="flex items-center gap-2 text-[#b9c7bb]">
                  <Check size={14} /> Increases candidate-JD match scores
                </div>
              </div>

              <button
                disabled={form.title.trim().length < 2 || form.description.trim().length < 10 || submit.isPending}
                onClick={() => {
                  const skillsList = form.skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
                  submit.mutate({
                    title: form.title,
                    description: form.description,
                    githubUrl: form.githubUrl,
                    liveUrl: form.liveUrl,
                    skills: skillsList.length > 0 ? skillsList : ["React", "Python"],
                  });
                }}
                className="mt-6 w-full py-3.5 bg-[#d7fb61] text-[#12201b] text-xs font-bold rounded-xl hover:bg-[#c8ee4d] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submit.isPending ? "Submitting to TPO..." : "Submit Project Evidence to TPO"} <Send size={15} />
              </button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD PROJECTS LIST GRID VIEW
  return (
    <div>
      <PageHeader
        eyebrow="Evidence studio"
        title="Projects that prove the point."
        copy="A project becomes career evidence when it has a clear problem, a shipped artifact, and an institutional verification trail with TPO review."
        action={
          <button
            onClick={() => setIsSubmittingPage(true)}
            className="rounded-xl bg-[#12201b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#20332b] flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Submit New Project Evidence
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {(projects.data ?? []).map((project) => (
          <Card key={project.id} className="card-lift">
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef1ec]">
                <FolderGit2 size={18} />
              </div>
              <Tag tone={project.status === "Verified" ? "lime" : project.status === "Submitted" ? "blue" : "orange"}>
                {project.status}
              </Tag>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-.04em]">{project.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#6f7b72]">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span key={skill} className="rounded-md bg-[#f5f5f1] px-2 py-1 font-mono text-[10px]">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#edf0ec] pt-4 text-xs text-[#78847b]">
              <span>Updated {project.updated}</span>
              {project.status === "Needs rework" ? (
                <button onClick={() => setIsSubmittingPage(true)} className="font-semibold text-[#a75b18]">
                  Rework project <ArrowRight className="ml-1 inline" size={13} />
                </button>
              ) : (
                <span className="flex items-center gap-1 text-[#4d7459]">
                  <ShieldCheck size={13} /> {project.status === "Submitted" ? "Submitted to TPO Queue" : "Verified by TPO"}
                </span>
              )}
            </div>
          </Card>
        ))}

        <button
          onClick={() => setIsSubmittingPage(true)}
          className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#b9c4ba] bg-transparent text-center hover:bg-white transition-colors cursor-pointer"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-sm">
            <Plus size={18} />
          </div>
          <div className="mt-4 text-sm font-semibold">Add New Project Evidence</div>
          <div className="mt-1 text-xs text-[#78847b]">Open full-page workspace for GitHub & live demo submission</div>
        </button>
      </div>
    </div>
  );
}

function OpportunitiesPage() {
  const jobs = trpc.omen.jobs.useQuery();
  const apply = trpc.omen.applyToJob.useMutation({
    onSuccess: (result) => {
      if (result.ok) {
        toast.success("Application Submitted to TPO!", {
          description: "Your Resume-JD evaluation match score has been recorded for candidate review.",
        });
        jobs.refetch();
        setEvalModalJobId(null);
      } else {
        toast.message(result.message);
      }
    },
  });

  const [evalModalJobId, setEvalModalJobId] = useState<string | null>(null);
  const evalQuery = trpc.omen.evaluateJobApplication.useQuery(
    { jobId: evalModalJobId || "" },
    { enabled: Boolean(evalModalJobId) }
  );

  const [filter, setFilter] = useState("All");
  const filtered = jobs.data?.filter((job) => filter === "All" || (filter === "Eligible" ? job.eligible : job.missingSkills.length > 0)) ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Placement opportunities"
        title="Apply with Resume & JD Evaluation."
        copy="Every opportunity evaluates your candidate resume against the JD required skills to generate an explainable match score before application."
        action={
          <div className="flex items-center gap-2">
            <button onClick={() => setFilter("All")} className={`rounded-lg px-3 py-2 text-xs font-semibold ${filter === "All" ? "bg-[#12201b] text-white" : "border border-[#dce2da] bg-white"}`}>All Opportunities</button>
            <button onClick={() => setFilter("Eligible")} className={`rounded-lg px-3 py-2 text-xs font-semibold ${filter === "Eligible" ? "bg-[#12201b] text-white" : "border border-[#dce2da] bg-white"}`}>Eligible Only</button>
          </div>
        }
      />

      <div className="space-y-4">
        {filtered.map((job) => (
          <Card key={job.id} className="card-lift">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#12201b] font-display font-bold text-[#d7fb61]">
                  {job.company.slice(0, 1)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#6b78f7]">{job.company}</div>
                  <h2 className="mt-1 text-xl font-semibold">{job.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#78847b]">
                    <span className="flex items-center gap-1"><MapPin size={13} />{job.location}</span>
                    <span className="flex items-center gap-1"><Award size={13} />{job.ctc}</span>
                    <span className="flex items-center gap-1"><BriefcaseBusiness size={13} />Apply by {new Date(job.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-[#eef1ec] px-4 py-2 text-center">
                  <div className="font-display text-2xl font-bold">{job.score}%</div>
                  <div className="font-mono text-[9px] uppercase tracking-[.12em] text-[#78847b]">Resume Match</div>
                </div>
                {job.eligible ? <Tag tone="lime">Eligible</Tag> : <Tag tone="orange">Review Criteria</Tag>}
              </div>
            </div>

            <p className="mt-5 max-w-[720px] text-sm leading-6 text-[#66736a]">{job.description}</p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#edf0ec] pt-4">
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <span key={skill} className={`rounded-md px-2 py-1 text-[10px] font-mono ${job.matchedSkills.includes(skill) ? "bg-[#e7f5d0] text-[#4c6e3d]" : "bg-[#fff0de] text-[#a75b18]"}`}>
                    {job.matchedSkills.includes(skill) ? "✓ " : "→ "}{skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={job.applied}
                  onClick={() => setEvalModalJobId(job.id)}
                  className="rounded-xl bg-[#12201b] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#20332b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {job.applied ? "Application Submitted" : "Evaluate Resume & Apply"}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* RESUME & JD EVALUATION MODAL */}
      {evalModalJobId && evalQuery.data && (
        <Modal title={`Resume & JD Evaluation: ${evalQuery.data.job.title}`} onClose={() => setEvalModalJobId(null)}>
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-[#12201b] text-white flex items-center justify-between">
              <div>
                <TinyLabel>Resume-JD Candidate Match</TinyLabel>
                <div className="mt-1 font-display text-4xl font-bold text-[#d7fb61]">
                  {evalQuery.data.evaluation.matchScore}%
                </div>
                <div className="mt-1 text-xs text-[#aebcb0]">Skill Alignment Ratio: {evalQuery.data.evaluation.skillMatchPercentage}%</div>
              </div>
              <Tag tone={evalQuery.data.evaluation.eligible ? "lime" : "orange"}>
                {evalQuery.data.evaluation.eligible ? "Eligible Candidate" : "Academic Waiver Review"}
              </Tag>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f5f5f1] border border-[#dce2da] text-xs text-[#66736a] leading-5">
              <span className="font-bold text-[#12201b]">Evaluation Summary: </span>
              {evalQuery.data.evaluation.summary}
            </div>

            <div>
              <div className="text-xs font-mono uppercase text-[#78847b] mb-2">Required Skills Breakdown</div>
              <div className="flex flex-wrap gap-2">
                {evalQuery.data?.job.requiredSkills.map((sk: string) => {
                  const matched = evalQuery.data?.evaluation.matchedSkills.includes(sk) ?? false;
                  return (
                    <span key={sk} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${matched ? "bg-[#e7f5d0] text-[#29422e]" : "bg-[#fff0de] text-[#a75b18]"}`}>
                      {matched ? "✓ Matched: " : "⚠ Missing: "}{sk}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#dce2da] flex gap-3">
              <button
                onClick={() => setEvalModalJobId(null)}
                className="w-1/3 py-2.5 rounded-xl border border-[#dce2da] text-xs font-semibold text-[#66736a]"
              >
                Close
              </button>
              <button
                disabled={apply.isPending}
                onClick={() => apply.mutate({ jobId: evalModalJobId })}
                className="w-2/3 py-2.5 rounded-xl bg-[#d7fb61] text-[#12201b] text-xs font-bold hover:bg-[#c8ee4d]"
              >
                {apply.isPending ? "Submitting..." : "Confirm & Submit Application"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ApplicationsPage() {
  const applications = trpc.omen.applications.useQuery();
  return <div><PageHeader eyebrow="Application trail" title="Keep every step visible." copy="OMEN records your application timestamp and the status changes you can see. It is a student workspace, not an ATS." action={<Tag tone="blue">{applications.data?.length ?? 0} active applications</Tag>} /><div className="space-y-4">{(applications.data ?? []).map((application) => application.job && <Card key={application.id}><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div><div className="text-xs font-semibold text-[#6b78f7]">{application.job.company}</div><h2 className="mt-1 text-xl font-semibold">{application.job.title}</h2><div className="mt-2 flex flex-wrap gap-3 text-xs text-[#78847b]"><span>{application.job.location}</span><span>{application.job.ctc}</span></div></div><Tag tone={application.status === "SHORTLISTED" ? "lime" : "blue"}>{application.status.replaceAll("_", " ")}</Tag></div><div className="mt-8 grid grid-cols-4 gap-2">{application.timeline.map((step, index) => <div key={step.label} className="relative"><div className={`h-2 rounded-full ${step.done ? "bg-[#6b78f7]" : "bg-[#e7ece6]"}`} /><div className={`mt-2 text-xs ${step.done ? "font-semibold" : "text-[#9aa59c]"}`}>{step.label}</div><div className="mt-1 font-mono text-[10px] text-[#89948c]">{step.date}</div>{index < application.timeline.length - 1 && <div className="absolute right-[-4px] top-[-2px] h-3 w-3 rounded-full border-2 border-white bg-[#dce2da]" />}</div>)}</div><div className="mt-6 flex items-center gap-2 border-t border-[#edf0ec] pt-4 text-xs text-[#78847b]"><ClipboardCheck size={14} className="text-[#6b78f7]" /> Status history is advisory until confirmed by the placement team.</div></Card>)}</div></div>;
}

function NotificationsPage() {
  const notifications = trpc.omen.notifications.useQuery();
  const mark = trpc.omen.markNotificationRead.useMutation({ onSuccess: () => notifications.refetch() });
  return <div><PageHeader eyebrow="Notifications" title="Stay in the loop." copy="Opportunities, application changes, learning nudges, and project review updates — all in one place." action={<Tag tone="orange">{notifications.data?.filter((item) => item.unread).length ?? 0} unread</Tag>} /><Card><div className="divide-y divide-[#edf0ec]">{(notifications.data ?? []).map((item) => <div key={item.id} className={`flex gap-4 py-5 first:pt-0 last:pb-0 ${item.unread ? "" : "opacity-65"}`}><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.type === "Shortlist" ? "bg-[#d7fb61]" : item.type === "Opportunity" ? "bg-[#dfe5ff]" : "bg-[#eef1ec]"}`}>{item.type === "Shortlist" ? <Award size={17} /> : item.type === "Opportunity" ? <BriefcaseBusiness size={17} /> : <BookOpen size={17} />}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-semibold">{item.title}{item.unread && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#f7b267]" />}</div><div className="mt-1 text-sm leading-6 text-[#6f7b72]">{item.body}</div></div><span className="shrink-0 font-mono text-[10px] text-[#89948c]">{item.time}</span></div>{item.unread && <button onClick={() => mark.mutate({ id: item.id })} className="mt-3 text-xs font-semibold text-[#6b78f7]">Mark as read</button>}</div></div>)}</div></Card></div>;
}

function ProfilePage() {
  const dashboard = trpc.omen.dashboard.useQuery();
  const utils = trpc.useUtils();
  const updateResumeMut = trpc.omen.updateResume.useMutation({
    onSuccess: (data) => {
      toast.success("Resume uploaded & parsed successfully!", {
        description: `File: ${data.student.resumeFilename}`,
      });
      utils.omen.dashboard.invalidate();
    },
  });

  const [tab, setTab] = useState("Overview");
  const [showPreview, setShowPreview] = useState(false);
  const [localResumeBlob, setLocalResumeBlob] = useState<string | null>(null);

  const [githubUrlInput, setGithubUrlInput] = useState("https://github.com/aaravmehta");
  const [linkedinUrlInput, setLinkedinUrlInput] = useState("https://linkedin.com/in/aaravmehta");
  const [realRepos, setRealRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [repoStatusMsg, setRepoStatusMsg] = useState<string>("");

  const saveProfileMut = trpc.omen.saveStudentProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile & developer links updated successfully!");
      utils.omen.dashboard.invalidate();
    },
  });

  useEffect(() => {
    if (dashboard.data?.student) {
      const s = dashboard.data.student as any;
      if (s.githubUrl) setGithubUrlInput(s.githubUrl);
      if (s.linkedinUrl) setLinkedinUrlInput(s.linkedinUrl);
    }
  }, [dashboard.data]);

  const fetchGithubRepos = async (urlStr: string) => {
    if (!urlStr) return;
    setLoadingRepos(true);
    setRepoStatusMsg("Fetching repositories from GitHub...");
    try {
      let username = urlStr.trim().replace(/\/$/, "");
      if (username.includes("github.com/")) {
        username = username.split("github.com/")[1]?.split("/")[0] || "";
      }
      if (!username) {
        setRepoStatusMsg("Invalid GitHub URL or username.");
        setRealRepos([]);
        return;
      }

      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRealRepos(data);
          setRepoStatusMsg(`Loaded ${data.length} public repositories from @${username}`);
        } else {
          setRealRepos([]);
          setRepoStatusMsg(`No public repositories found for @${username}`);
        }
      } else {
        setRealRepos([]);
        setRepoStatusMsg(`Could not fetch @${username} (${res.status === 404 ? "User not found" : "Rate limited"})`);
      }
    } catch {
      setRealRepos([]);
      setRepoStatusMsg("Network error fetching GitHub repositories.");
    } finally {
      setLoadingRepos(false);
    }
  };

  useEffect(() => {
    if (githubUrlInput) {
      fetchGithubRepos(githubUrlInput);
    }
  }, []);

  if (!dashboard.data) return <LoadingState label="Loading your profile" />;
  const student = dashboard.data.student;

  const handleSaveProfile = () => {
    saveProfileMut.mutate({
      department: student.department,
      branch: student.branch,
      semester: student.semester,
      cgpa: Number(student.cgpa),
      backlogs: student.backlogs,
      targetRoles: ["Full Stack Engineer"],
      skills: (student.skills ? Object.values(student.skills) : []).map((s: any) => ({ name: s?.name || String(s), proficiency: s?.proficiency || 75 })),
      githubUrl: githubUrlInput,
      linkedinUrl: linkedinUrlInput,
    });
    fetchGithubRepos(githubUrlInput);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Career DNA"
        title="Institutional Student Profile."
        copy="This is the context OMEN uses to understand your readiness. Your uploaded resume is stored and parsed to evaluate candidate role matches."
        action={
          <button
            onClick={handleSaveProfile}
            disabled={saveProfileMut.isPending}
            className="rounded-xl bg-[#12201b] px-4 py-3 text-sm font-bold text-white hover:bg-[#21352d]"
          >
            {saveProfileMut.isPending ? "Saving..." : "Save Profile & Sync Links"}
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
        <Card className="bg-[#12201b] text-white">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#6b78f7] font-display text-xl font-bold">
              {student.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <div className="mt-1 text-xs text-[#aebcb0]">
                {student.studentId} · {student.branch} · Semester {student.semester}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#aebcb0]">CGPA</span>
              <span className="font-bold text-[#d7fb61]">{student.cgpa}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#aebcb0]">Backlogs</span>
              <span className="font-bold">{student.backlogs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#aebcb0]">Internship</span>
              <span className="font-bold">{student.internshipMonths} months</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#aebcb0]">Verified Projects</span>
              <span className="font-bold">{student.projectCount}</span>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-white/10 p-3.5 text-xs text-[#bdc9bf] leading-5">
            <ShieldCheck className="mb-2 text-[#d7fb61]" size={18} />
            Your private profile and resume documents are securely stored in Supabase Storage and accessible only to authorized TPO staff.
          </div>
        </Card>

        <Card>
          <div className="flex gap-2 border-b border-[#edf0ec] pb-2 overflow-x-auto">
            {["Overview", "Skills", "GitHub Repositories", "LinkedIn Signal", "Resume"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  tab === item ? "bg-[#12201b] text-white" : "text-[#5c6b61] hover:bg-[#f5f5f1]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-[#12201b]">
                  Full Name
                  <input
                    value={student.name}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-3.5 py-2.5 text-sm text-[#12201b]"
                  />
                </label>
                <label className="text-xs font-bold text-[#12201b]">
                  Student ID / Roll No.
                  <input
                    value={student.studentId}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-3.5 py-2.5 text-sm text-[#12201b]"
                  />
                </label>
                <label className="text-xs font-bold text-[#12201b]">
                  Department
                  <input
                    value={student.department}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-3.5 py-2.5 text-sm text-[#12201b]"
                  />
                </label>
                <label className="text-xs font-bold text-[#12201b]">
                  Branch & Semester
                  <input
                    value={`${student.branch} (Sem ${student.semester})`}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-3.5 py-2.5 text-sm text-[#12201b]"
                  />
                </label>
                <label className="text-xs font-bold text-[#12201b]">
                  GitHub Profile URL / Handle
                  <input
                    type="text"
                    value={githubUrlInput}
                    onChange={(e) => setGithubUrlInput(e.target.value)}
                    placeholder="https://github.com/your-username"
                    className="mt-2 w-full rounded-xl border border-[#dce2da] bg-white px-3.5 py-2.5 text-sm text-[#6b78f7] font-mono focus:border-[#6b78f7] focus:outline-none"
                  />
                </label>
                <label className="text-xs font-bold text-[#12201b]">
                  LinkedIn Profile URL
                  <input
                    type="text"
                    value={linkedinUrlInput}
                    onChange={(e) => setLinkedinUrlInput(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="mt-2 w-full rounded-xl border border-[#dce2da] bg-white px-3.5 py-2.5 text-sm text-[#0a66c2] font-mono focus:border-[#0a66c2] focus:outline-none"
                  />
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="rounded-xl bg-[#12201b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#21352d]"
                >
                  Save Profile & Sync GitHub Repos
                </button>
              </div>
            </div>
          )}

          {tab === "Skills" && (
            <div className="mt-6">
              <SkillsList />
            </div>
          )}

          {tab === "GitHub Repositories" && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf0ec] pb-3">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6b78f7]">GitHub Live Developer Signal</div>
                  <div className="text-sm font-bold text-[#12201b] mt-0.5">
                    Profile:{" "}
                    <a
                      href={githubUrlInput.startsWith("http") ? githubUrlInput : `https://github.com/${githubUrlInput}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#6b78f7] hover:underline font-mono"
                    >
                      {githubUrlInput}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => fetchGithubRepos(githubUrlInput)}
                  className="px-3 py-1.5 rounded-lg border border-[#dce2da] bg-white text-xs font-bold text-[#12201b] hover:bg-[#edf0ec] flex items-center gap-1.5"
                >
                  Sync Repos 🔄
                </button>
              </div>

              {repoStatusMsg && (
                <div className="text-xs text-[#5c6b61] font-mono bg-[#f5f5f1] p-2.5 rounded-xl border border-[#dce2da]">
                  {repoStatusMsg}
                </div>
              )}

              {loadingRepos ? (
                <div className="py-8 text-center text-xs text-[#78847b]">Fetching public repositories from GitHub API...</div>
              ) : realRepos.length > 0 ? (
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {realRepos.map((repo) => (
                    <div key={repo.id || repo.name} className="p-4 rounded-2xl border border-[#dce2da] bg-[#f5f5f1] hover:border-[#aab7aa] transition-colors flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-sm text-[#12201b] font-mono flex items-center gap-1.5 truncate">
                            <Code2 size={15} className="text-[#6b78f7] shrink-0" /> {repo.name}
                          </div>
                          {repo.language && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#e2e7e1] text-[#334237] shrink-0">
                              {repo.language}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-[#5c6b61] leading-4 line-clamp-2">
                          {repo.description || "Public GitHub repository project."}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#e2e7e1] text-xs">
                        <div className="flex items-center gap-3 text-[11px] font-mono text-[#6c7b70]">
                          <span>⭐ {repo.stargazers_count ?? 0}</span>
                          <span>🍴 {repo.forks_count ?? 0}</span>
                        </div>
                        <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#12201b] hover:text-[#6b78f7] flex items-center gap-1">
                          View Code ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-[#b9c4ba] text-center">
                  <div className="text-sm font-bold text-[#12201b]">No public repositories loaded yet</div>
                  <div className="mt-1 text-xs text-[#78847b]">Enter your valid GitHub URL above (e.g. https://github.com/your-username) and click Sync.</div>
                </div>
              )}
            </div>
          )}

          {tab === "LinkedIn Signal" && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf0ec] pb-3">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#0a66c2]">Verified Professional Signal</div>
                  <div className="text-sm font-bold text-[#12201b] mt-0.5">
                    Profile:{" "}
                    <a
                      href={linkedinUrlInput.startsWith("http") ? linkedinUrlInput : `https://linkedin.com/in/${linkedinUrlInput}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0a66c2] hover:underline font-mono"
                    >
                      {linkedinUrlInput}
                    </a>
                  </div>
                </div>
                <Tag tone="lime">Identity Verified</Tag>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-[#f5f5f1] border border-[#dce2da] p-4 flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#12201b]">Software Engineering Candidate</div>
                    <div className="mt-0.5 text-xs text-[#5c6b61]">LinkedIn Verified Signal · {student.branch} Cohort</div>
                    <div className="mt-2 text-xs text-[#445248] leading-5">Candidate background verified against active institutional placement roster.</div>
                  </div>
                  <Tag tone="blue">Verified Candidate</Tag>
                </div>
              </div>
            </div>
          )}

          {tab === "Resume" && (() => {
            const activePreviewUrl = localResumeBlob || (student.resumeUrl && !student.resumeUrl.includes("dummy.pdf") && !student.resumeUrl.includes("supabase.co/storage") ? student.resumeUrl : null);
            return (
              <div className="mt-6 space-y-5">
                <div className="p-5 rounded-2xl border border-[#dce2da] bg-[#f5f5f1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#12201b] text-white">
                      <FileText size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#12201b]">
                        {(student as any).resumeFilename || "Upload_Resume.pdf"}
                      </div>
                      <div className="mt-1 text-xs text-[#5c6b61] flex items-center gap-2">
                        <span>Uploaded: {(student as any).resumeUploadedAt || "Just now"}</span>
                        <Tag tone={activePreviewUrl ? "lime" : "orange"}>
                          {activePreviewUrl ? "Parsed & Preview Ready" : "Pending PDF Upload"}
                        </Tag>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="rounded-xl border border-[#dce2da] bg-white px-3.5 py-2.5 text-xs font-bold text-[#12201b] hover:bg-[#edf0ec] flex items-center gap-1.5"
                    >
                      <Eye size={14} /> {showPreview ? "Hide Preview" : "👁 View Resume Preview"}
                    </button>

                    <label className="rounded-xl bg-[#12201b] px-3.5 py-2.5 text-xs font-bold text-white hover:bg-[#20332b] cursor-pointer flex items-center gap-1.5">
                      <Upload size={14} /> Upload / Update PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const localBlobUrl = URL.createObjectURL(file);
                            setLocalResumeBlob(localBlobUrl);
                            updateResumeMut.mutate({ resumeUrl: localBlobUrl, filename: file.name });
                            setShowPreview(true);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {showPreview && (
                  <div className="p-4 rounded-2xl border border-[#dce2da] bg-white space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#5c6b61]">
                      <span className="font-bold text-[#12201b]">PDF Document Preview</span>
                      {activePreviewUrl && (
                        <a
                          href={activePreviewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#6b78f7] font-bold hover:underline flex items-center gap-1"
                        >
                          Open Fullscreen PDF <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    {activePreviewUrl ? (
                      <iframe
                        src={activePreviewUrl}
                        title="Resume Preview"
                        className="w-full h-[480px] rounded-xl border border-[#edf0ec] bg-[#f8f9fa]"
                      />
                    ) : (
                      <div className="p-8 rounded-xl border border-dashed border-[#b9c4ba] bg-[#f8f9fa] text-center space-y-3">
                        <FileText size={36} className="mx-auto text-[#78847b]" />
                        <div className="text-sm font-bold text-[#12201b]">No PDF Document Uploaded Yet</div>
                        <p className="text-xs text-[#5c6b61] max-w-sm mx-auto">
                          Click the <strong>Upload / Update PDF</strong> button above to attach your PDF resume. OMEN will parse your skills and render your document preview instantly.
                        </p>
                        <label className="inline-flex rounded-xl bg-[#12201b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20332b] cursor-pointer items-center gap-1.5">
                          <Upload size={14} /> Select PDF File
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const localBlobUrl = URL.createObjectURL(file);
                                setLocalResumeBlob(localBlobUrl);
                                updateResumeMut.mutate({ resumeUrl: localBlobUrl, filename: file.name });
                                setShowPreview(true);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4 rounded-xl border border-[#edf0ec] bg-white text-xs text-[#5c6b61] leading-5">
                  <div className="font-bold text-[#12201b] mb-1">Extracted Resume Context</div>
                  <div>
                    OMEN automatically parses skills, experience timelines, and academic scores from your uploaded resume to calculate candidate-JD match scores for live TPO placement opportunities.
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>
      </div>
    </div>
  );
}

function SkillsList() { const skills = trpc.omen.skills.useQuery(); return <div className="grid gap-3 sm:grid-cols-2">{(skills.data ?? []).map((skill) => <div key={skill.id} className="rounded-xl border border-[#edf0ec] p-3"><div className="flex items-center justify-between text-sm font-semibold"><span>{skill.name}</span><span className="font-mono text-xs text-[#89948c]">{skill.proficiency}%</span></div><div className="mt-2 h-1.5 rounded-full bg-[#e7ece6]"><div className="h-1.5 rounded-full bg-[#6b78f7]" style={{ width: `${skill.proficiency}%` }} /></div><div className="mt-2 flex items-center justify-between text-[10px] text-[#89948c]"><span>{skill.category}</span>{skill.verified && <span className="flex items-center gap-1 text-[#4d7459]"><ShieldCheck size={11} /> verified</span>}</div></div>)}</div>; }

function TpoDashboard() {
  const tpo = trpc.omen.tpoDashboard.useQuery();
  if (!tpo.data) return <LoadingState label="Loading institutional intelligence" />;
  const pie = [{ name: "Ready", value: 38, color: "#d7fb61" }, { name: "Building", value: 47, color: "#6b78f7" }, { name: "Needs intervention", value: 15, color: "#f7b267" }];
  return <div><PageHeader eyebrow="TPO command center" title="Make the next intervention count." copy="A live view of readiness, market demand, opportunities, and the cohorts that need a more targeted nudge." action={<div className="flex items-center gap-2"><Tag tone="lime">Institutional view</Tag><button onClick={() => tpo.refetch()} className="rounded-xl border border-[#dce2da] bg-white p-2.5"><RefreshCw size={16} /></button></div>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[["Students", tpo.data.metrics.students.toLocaleString(), "tracked profiles", "#6b78f7"], ["Avg readiness", `${tpo.data.metrics.averageReadiness}/100`, "+4 vs. last snapshot", "#d7fb61"], ["Needs intervention", tpo.data.metrics.needsIntervention, "respectful cohort signal", "#f7b267"], ["Active roles", tpo.data.metrics.activeOpportunities, "published opportunities", "#6b78f7"], ["Placement rate", `${tpo.data.metrics.placementRate}%`, "development aggregate", "#d7fb61"]].map(([label, value, note, accent]) => <Metric key={String(label)} label={String(label)} value={String(value)} note={String(note)} accent={String(accent)} />)}</div><div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><Card><div className="flex items-center justify-between"><div><TinyLabel>Institutional readiness</TinyLabel><div className="mt-1 text-lg font-semibold">Which cohorts need a sharper signal?</div></div><Tag tone="blue">By graduating cohort</Tag></div><div className="mt-5 h-[240px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={tpo.data.cohorts} layout="vertical" margin={{ left: 18, right: 18 }}><CartesianGrid horizontal={false} stroke="#edf0ec" /><XAxis type="number" domain={[0, 100]} hide /><YAxis type="category" dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#657268" }} width={100} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dce2da", fontSize: 12 }} /><Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={25} fill="#6b78f7" /></BarChart></ResponsiveContainer></div><div className="flex flex-wrap gap-4 text-xs text-[#78847b]">{tpo.data.cohorts.map((cohort) => <span key={cohort.label}><strong className="text-[#12201b]">{cohort.students}</strong> {cohort.label}</span>)}</div></Card><Card><div className="flex items-center justify-between"><div><TinyLabel>Readiness mix</TinyLabel><div className="mt-1 text-lg font-semibold">At a glance</div></div><Users size={17} className="text-[#6b78f7]" /></div><div className="mt-3 h-[195px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pie} innerRadius={58} outerRadius={82} dataKey="value" strokeWidth={0}>{pie.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dce2da", fontSize: 12 }} /></PieChart></ResponsiveContainer></div><div className="space-y-2">{pie.map((item) => <div key={item.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.name}</span><span className="font-mono">{item.value}%</span></div>)}</div></Card></div><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]"><Card><div className="flex items-center justify-between"><div><TinyLabel>Market ↔ institution</TinyLabel><div className="mt-1 text-lg font-semibold">Opportunity gaps to act on</div></div><Link href="/tpo/outcomes" className="text-xs font-semibold text-[#6b78f7]">View intelligence <ArrowRight className="ml-1 inline" size={13} /></Link></div><div className="mt-5 space-y-4">{tpo.data.skillGaps.map((gap) => <div key={gap.skill}><div className="flex items-center justify-between text-sm"><span className="font-semibold">{gap.skill}</span><span className="font-mono text-xs text-[#a75b18]">{gap.gap} pt gap</span></div><div className="mt-2 flex h-2 gap-1"><div className="rounded-l-full bg-[#6b78f7]" style={{ width: `${gap.demand}%` }} /><div className="rounded-r-full bg-[#d7fb61]" style={{ width: `${gap.coverage}%` }} /></div><div className="mt-1 flex justify-between text-[10px] text-[#89948c]"><span>Market demand {gap.demand}</span><span>Institution coverage {gap.coverage}</span></div></div>)}</div></Card><Card><div className="flex items-center justify-between"><div><TinyLabel>Recent opportunity activity</TinyLabel><div className="mt-1 text-lg font-semibold">Keep the pipeline moving</div></div><Link href="/tpo/opportunities" className="rounded-lg bg-[#12201b] px-3 py-2 text-xs font-semibold text-white">Manage roles</Link></div><div className="mt-5 space-y-3">{tpo.data.recentJobs.map((job) => <div key={job.id} className="flex items-center gap-3 rounded-xl bg-[#f5f5f1] p-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white font-display font-bold">{job.company.slice(0, 1)}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{job.title}</div><div className="mt-1 text-xs text-[#78847b]">{job.company} · closes {new Date(job.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div></div><Tag tone="lime">Live</Tag></div>)}</div></Card></div><div className="mt-5 rounded-2xl border border-[#e7d8c4] bg-[#fff8ee] p-4 text-xs text-[#815d34]"><CircleAlert className="mr-2 inline" size={14} /> Institutional metrics and outcome aggregates in this preview are development data. Use approved data sources before making cohort decisions.</div></div>;
}

function TpoOpportunities() {
  const jobs = trpc.omen.jobs.useQuery();
  const create = trpc.omen.createOpportunity.useMutation({
    onSuccess: () => {
      toast.success("Opportunity published");
      jobs.refetch();
      setOpen(false);
    },
  });
  const editMut = trpc.omen.editOpportunity.useMutation({
    onSuccess: () => {
      toast.success("Opportunity updated successfully");
      jobs.refetch();
      setEditJob(null);
    },
  });

  const deleteMut = trpc.omen.deleteOpportunity.useMutation({
    onSuccess: () => {
      toast.success("Opportunity deleted");
      jobs.refetch();
      setConfirmDeleteId(null);
    },
  });

  const [open, setOpen] = useState(false);
  const [editJob, setEditJob] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ company: "", title: "", location: "", ctc: "", deadline: "2026-10-31", requiredSkills: "SQL, Python" });
  const [editForm, setEditForm] = useState({ id: "", company: "", title: "", location: "", ctc: "", deadline: "", requiredSkills: "", status: "Published" });

  const handleStartEdit = (job: any) => {
    setEditJob(job);
    setEditForm({
      id: job.id,
      company: job.company,
      title: job.title,
      location: job.location,
      ctc: job.ctc,
      deadline: job.deadline ? job.deadline.split("T")[0] : "2026-10-31",
      requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(", ") : "SQL, Python",
      status: job.status || "Published",
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="TPO · opportunities"
        title="Create & Edit Roles with Clarity."
        copy="Publish and edit job requirements, compensation packages, application deadlines, and skill prerequisites for candidate match calculations."
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-[#12201b] px-4 py-3 text-sm font-semibold text-white cursor-pointer hover:bg-[#20332b]"
          >
            <Plus className="mr-2 inline" size={15} />
            Create opportunity
          </button>
        }
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#edf0ec] text-xs uppercase tracking-wide text-[#89948c]">
              <tr>
                <th className="pb-3 font-mono font-normal">Role</th>
                <th className="pb-3 font-mono font-normal">Company</th>
                <th className="pb-3 font-mono font-normal">Deadline</th>
                <th className="pb-3 font-mono font-normal">Applicants</th>
                <th className="pb-3 font-mono font-normal">Status</th>
                <th className="pb-3 text-right font-mono font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(jobs.data ?? []).map((job) => (
                <tr key={job.id} className="border-b border-[#edf0ec] last:border-none">
                  <td className="py-4 font-semibold text-[#12201b]">{job.title}</td>
                  <td className="py-4 text-[#6b756e]">{job.company}</td>
                  <td className="py-4 text-[#6b756e]">
                    {new Date(job.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </td>
                  <td className="py-4 text-[#6b756e]">
                    {job.id === "job-northstar" ? 82 : job.id === "job-arc" ? 54 : 38}
                  </td>
                  <td className="py-4">
                    <Tag tone="lime">{job.status}</Tag>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(job)}
                        className="rounded-lg border border-[#dce2da] bg-white px-3 py-1.5 text-xs font-bold text-[#12201b] hover:bg-[#edf0ec] cursor-pointer"
                      >
                        Edit
                      </button>
                      {confirmDeleteId === job.id ? (
                        <button
                          onClick={() => deleteMut.mutate({ id: job.id })}
                          disabled={deleteMut.isPending}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 cursor-pointer disabled:opacity-60"
                        >
                          Confirm?
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(job.id)}
                          onBlur={() => setTimeout(() => setConfirmDeleteId(null), 200)}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE OPPORTUNITY MODAL */}
      {open && (
        <Modal title="Publish an Opportunity" onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold">
                Company
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
                  placeholder="Northstar Labs"
                />
              </label>
              <label className="text-xs font-semibold">
                Role Title
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
                  placeholder="Software Engineer"
                />
              </label>
              <label className="text-xs font-semibold">
                Location
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
                  placeholder="Bengaluru · Hybrid"
                />
              </label>
              <label className="text-xs font-semibold">
                Compensation
                <input
                  value={form.ctc}
                  onChange={(e) => setForm({ ...form, ctc: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
                  placeholder="₹12–16 LPA"
                />
              </label>
            </div>
            <label className="text-xs font-semibold">
              Required Skills (comma-separated)
              <input
                value={form.requiredSkills}
                onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
              />
            </label>
            <label className="text-xs font-semibold">
              Application Deadline
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
              />
            </label>
            <button
              onClick={() =>
                create.mutate({
                  ...form,
                  requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full rounded-xl bg-[#12201b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#20332b]"
            >
              Publish Role <Send className="ml-2 inline" size={15} />
            </button>
          </div>
        </Modal>
      )}

      {/* EDIT OPPORTUNITY MODAL */}
      {editJob && (
        <Modal title={`Edit Opportunity: ${editJob.title}`} onClose={() => setEditJob(null)}>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold">
                Company
                <input
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
                />
              </label>
              <label className="text-xs font-semibold">
                Role Title
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
                />
              </label>
              <label className="text-xs font-semibold">
                Location
                <input
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
                />
              </label>
              <label className="text-xs font-semibold">
                Compensation (CTC)
                <input
                  value={editForm.ctc}
                  onChange={(e) => setEditForm({ ...editForm, ctc: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
                />
              </label>
            </div>
            <label className="text-xs font-semibold">
              Required Skills (comma-separated)
              <input
                value={editForm.requiredSkills}
                onChange={(e) => setEditForm({ ...editForm, requiredSkills: e.target.value })}
                className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
              />
            </label>
            <label className="text-xs font-semibold">
              Application Deadline
              <input
                type="date"
                value={editForm.deadline}
                onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                className="mt-2 w-full rounded-xl border border-[#dce2da] px-3 py-2.5 text-sm"
              />
            </label>
            <button
              disabled={editMut.isPending}
              onClick={() =>
                editMut.mutate({
                  id: editForm.id,
                  company: editForm.company,
                  title: editForm.title,
                  location: editForm.location,
                  ctc: editForm.ctc,
                  deadline: editForm.deadline,
                  requiredSkills: editForm.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full rounded-xl bg-[#12201b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#20332b]"
            >
              Save Opportunity Changes <Check className="ml-2 inline" size={15} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TpoOutcomes() {
  const tpo = trpc.omen.tpoDashboard.useQuery();
  const jobsQuery = trpc.omen.jobs.useQuery();
  const utils = trpc.useUtils();
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [csvText, setCsvText] = useState("");
  const [processedResult, setProcessedResult] = useState<any | null>(null);

  const processCsvMut = trpc.omen.processOutcomeCsv.useMutation({
    onSuccess: (data) => {
      toast.success(`Processed ${data.processedCount} outcome rows!`, {
        description: "Student notifications updated with official reasons or predicted metric diagnostics.",
      });
      setProcessedResult(data);
      setSelectedJob(null);
      utils.omen.applications.invalidate();
      utils.omen.notifications.invalidate();
    },
  });

  const generateSampleCsv = (jobTitle: string) => {
    return `student_id, student_email, outcome, feedback_reason\nstudent-01, student@university.edu, SELECTED, Outstanding performance in live coding and architecture round\nCS21B048, rahul.verma@university.edu, REJECTED, \nCS21B049, ananya.s@university.edu, SELECTED, Passed all technical evaluations cleanly`;
  };

  const handleOpenUploadModal = (job: any) => {
    setSelectedJob(job);
    setCsvText(generateSampleCsv(job.title));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TPO · Outcome Intelligence & Placement Result Sender"
        title="Published Placements & Result Delivery"
        copy="Manage published opportunities, upload placement result CSVs per role, and deliver instant notifications to candidates with official reasons or OMEN inferred metric diagnostics."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <TinyLabel>Active Roster</TinyLabel>
              <h2 className="mt-1 text-lg font-bold font-display text-[#12201b]">Published Placement Opportunities</h2>
            </div>
            <Tag tone="lime">{jobsQuery.data?.length || 0} Opportunities</Tag>
          </div>

          <div className="space-y-3">
            {(jobsQuery.data ?? []).map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#dce2da] bg-[#f5f5f1] hover:bg-white transition-all gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#12201b]">{job.title}</span>
                    <Tag tone="lime">Published</Tag>
                  </div>
                  <div className="text-xs text-[#5c6b61] mt-0.5">
                    {job.company} · {job.location} · <span className="font-semibold text-[#12201b]">{job.ctc}</span>
                  </div>
                  <div className="text-[11px] text-[#78847b] mt-1 font-mono">
                    Required: {job.requiredSkills.join(", ")}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenUploadModal(job)}
                  className="rounded-xl bg-[#12201b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20332b] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Upload size={14} /> Upload Results
                </button>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <TinyLabel>Stream Status</TinyLabel>
                <h2 className="mt-1 text-base font-bold text-[#12201b]">Latest Result Delivery Stream</h2>
              </div>
              <Tag tone="lime">Live</Tag>
            </div>
            <div className="mt-4 rounded-xl bg-[#f5f5f1] p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#78847b]">Processed Batches</span>
                <span className="font-bold">{processedResult ? `${processedResult.processedCount} candidates` : "2 candidates staged"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78847b]">Official Reason Delivery</span>
                <span className="text-[#4d7459] font-bold">Delivered</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78847b]">Inferred Metric Diagnostics</span>
                <span className="text-[#a75b18] font-bold">Active Fallback</span>
              </div>
            </div>
          </Card>

          <Card>
            <TinyLabel>Recurring Inferred Skill Gaps</TinyLabel>
            <h2 className="mt-1 text-base font-bold text-[#12201b]">Institutional Interventions</h2>
            <div className="mt-4 space-y-3">
              {(tpo.data?.skillGaps ?? []).slice(0, 3).map((gap) => (
                <div key={gap.skill} className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff0de] text-[#a75b18]">
                    <ArrowDownRight size={15} />
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="font-semibold text-[#12201b]">{gap.skill} coverage is {gap.coverage}%</div>
                    <div className="text-[#78847b]">Gap of {gap.gap} pts in cohort</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {selectedJob && (
        <Modal title={`Upload Results for ${selectedJob.title} (${selectedJob.company})`} onClose={() => setSelectedJob(null)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5c6b61]">Sample CSV format ready below:</span>
              <button
                type="button"
                onClick={() => {
                  setCsvText(generateSampleCsv(selectedJob.title));
                  toast.success("Sample CSV format loaded!");
                }}
                className="font-bold text-[#6b78f7] hover:underline cursor-pointer"
              >
                Reset to Sample CSV
              </button>
            </div>

            <div className="rounded-xl bg-[#edf0ec] p-3 text-[11px] font-mono text-[#12201b]">
              CSV Columns: <span className="font-bold text-[#6b78f7]">student_id, student_email, outcome, feedback_reason</span>
            </div>

            <textarea
              rows={7}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] p-3 text-xs font-mono text-[#12201b] focus:bg-white focus:outline-none focus:border-[#6b78f7]"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="w-1/3 rounded-xl border border-[#dce2da] bg-white py-3 text-xs font-bold text-[#12201b] hover:bg-[#edf0ec] cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={processCsvMut.isPending}
                onClick={() => processCsvMut.mutate({ jobId: selectedJob.id, csvText })}
                className="w-2/3 rounded-xl bg-[#12201b] py-3 text-xs font-bold text-white hover:bg-[#20332b] flex items-center justify-center gap-2 cursor-pointer"
              >
                {processCsvMut.isPending ? "Sending Results..." : "Upload & Send Results to Candidates"} <Send size={14} />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TpoBootcamps() {
  const bootcampsQuery = trpc.omen.bootcamps.useQuery();
  const pendingSubs = trpc.omen.getPendingProjectSubmissions.useQuery();
  const utils = trpc.useUtils();
  const verifyMut = trpc.omen.verifyStudentProject.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.omen.getPendingProjectSubmissions.invalidate();
      utils.omen.tpoDashboard.invalidate();
    },
  });

  const createBootcampMut = trpc.omen.createBootcamp.useMutation({
    onSuccess: () => {
      toast.success("Bootcamp successfully created & published to student dashboards!");
      setIsCreatingBootcamp(false);
      bootcampsQuery.refetch();
    },
  });

  const [isCreatingBootcamp, setIsCreatingBootcamp] = useState(false);
  const [bootcampTitle, setBootcampTitle] = useState("SQL & Cloud Placement Readiness");
  const [bootcampDesc, setBootcampDesc] = useState("Hands-on 2-week placement sprint covering query performance optimization, CTE window functions, and serverless Docker deployments.");
  const [bootcampType, setBootcampType] = useState<"Output-Driven" | "Demand-Driven">("Demand-Driven");
  const [option1, setOption1] = useState("Multi-Agent Workflow Engine (CrewAI / AutoGen / LangGraph)");
  const [option2, setOption2] = useState("Enterprise Knowledge Base & Hybrid Vector Search");
  const [option3, setOption3] = useState("Real-Time Voice AI Call Automation & Telephony");
  const [option4, setOption4] = useState("Production LLMOps, Tracing & Quantized Model Deployment");

  const handlePublishBootcamp = () => {
    createBootcampMut.mutate({
      title: bootcampTitle,
      description: bootcampDesc,
      type: bootcampType,
      category: bootcampType === "Demand-Driven" ? "Demand-Driven Poll" : "Output-Driven Sprint",
      workshopOptions: bootcampType === "Demand-Driven" ? [option1, option2, option3, option4] : undefined,
    });
  };

  if (isCreatingBootcamp) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsCreatingBootcamp(false)}
            className="rounded-xl border border-[#dce2da] bg-white px-4 py-2 text-xs font-bold text-[#12201b] hover:bg-[#edf0ec] flex items-center gap-2 cursor-pointer"
          >
            ← Back to Bootcamps Workspace
          </button>
          <Tag tone="lime">Bootcamp Creator Studio</Tag>
        </div>

        <PageHeader
          eyebrow="TPO · Institutional Interventions"
          title="Create New Institutional Bootcamp"
          copy="Select Output-Driven (fixed mandatory sprint for all candidates) or Demand-Driven (polling sprint with 4 workshop topic choices for students)."
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#12201b] mb-1.5">
                Bootcamp Title
              </label>
              <input
                type="text"
                value={bootcampTitle}
                onChange={(e) => setBootcampTitle(e.target.value)}
                className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-4 py-3 text-sm text-[#12201b] font-semibold focus:bg-white focus:outline-none focus:border-[#6b78f7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12201b] mb-1.5">
                Bootcamp Type & Execution Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBootcampType("Output-Driven")}
                  className={`p-3.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                    bootcampType === "Output-Driven"
                      ? "border-[#4d7459] bg-[#eff6df] font-bold text-[#2d4b1e]"
                      : "border-[#dce2da] bg-[#f5f5f1] text-[#5c6b61] hover:bg-white"
                  }`}
                >
                  <div className="font-bold text-sm mb-1">Output-Driven</div>
                  <div className="text-[11px] font-normal leading-normal">
                    Fixed mandatory sprint assigned directly to all students.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBootcampType("Demand-Driven")}
                  className={`p-3.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                    bootcampType === "Demand-Driven"
                      ? "border-[#6b78f7] bg-[#dfe5ff] font-bold text-[#12201b]"
                      : "border-[#dce2da] bg-[#f5f5f1] text-[#5c6b61] hover:bg-white"
                  }`}
                >
                  <div className="font-bold text-sm mb-1">Demand-Driven (Polling)</div>
                  <div className="text-[11px] font-normal leading-normal">
                    4-Option poll asked to students to choose workshop topic.
                  </div>
                </button>
              </div>
            </div>

            {bootcampType === "Demand-Driven" && (
              <div className="p-4 rounded-xl bg-[#dfe5ff]/40 border border-[#c3cefd] space-y-3">
                <label className="block text-xs font-bold text-[#12201b] flex items-center justify-between">
                  <span>Demand-Driven Polling: Provide 4 Workshop Topic Options</span>
                  <span className="text-[10px] text-[#6b78f7] font-mono font-bold">4 Options Required</span>
                </label>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#5c6b61] uppercase block mb-1">Option 1</span>
                    <input
                      type="text"
                      value={option1}
                      onChange={(e) => setOption1(e.target.value)}
                      className="w-full rounded-lg border border-[#dce2da] bg-white px-3 py-2 text-xs text-[#12201b] focus:outline-none focus:border-[#6b78f7]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5c6b61] uppercase block mb-1">Option 2</span>
                    <input
                      type="text"
                      value={option2}
                      onChange={(e) => setOption2(e.target.value)}
                      className="w-full rounded-lg border border-[#dce2da] bg-white px-3 py-2 text-xs text-[#12201b] focus:outline-none focus:border-[#6b78f7]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5c6b61] uppercase block mb-1">Option 3</span>
                    <input
                      type="text"
                      value={option3}
                      onChange={(e) => setOption3(e.target.value)}
                      className="w-full rounded-lg border border-[#dce2da] bg-white px-3 py-2 text-xs text-[#12201b] focus:outline-none focus:border-[#6b78f7]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5c6b61] uppercase block mb-1">Option 4</span>
                    <input
                      type="text"
                      value={option4}
                      onChange={(e) => setOption4(e.target.value)}
                      className="w-full rounded-lg border border-[#dce2da] bg-white px-3 py-2 text-xs text-[#12201b] focus:outline-none focus:border-[#6b78f7]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#12201b] mb-1.5">
                Description & Sprint Syllabus Notes
              </label>
              <textarea
                rows={4}
                value={bootcampDesc}
                onChange={(e) => setBootcampDesc(e.target.value)}
                className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] px-4 py-3 text-sm text-[#12201b] focus:bg-white focus:outline-none focus:border-[#6b78f7]"
              />
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-[#12201b] text-white">
              <TinyLabel>Publication Control</TinyLabel>
              <h3 className="text-base font-bold mt-2">Publish & Broadcast</h3>
              <p className="text-xs text-[#b9c7bb] mt-2 leading-relaxed">
                {bootcampType === "Demand-Driven"
                  ? "Publishing will render a 4-option poll in student sidebar module 'Bootcamps & Polls' for candidates to cast votes."
                  : "Publishing will assign a fixed mandatory placement sprint to all 284 candidate dashboards."}
              </p>

              <div className="mt-6 space-y-3">
                <button
                  disabled={createBootcampMut.isPending}
                  onClick={handlePublishBootcamp}
                  className="w-full rounded-xl bg-[#d7fb61] px-4 py-3 text-xs font-bold text-[#12201b] hover:bg-[#c6ee4c] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check size={15} /> Publish Bootcamp to Student Dashboards
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="TPO · Interventions & Verification"
        title="Institutional Placement Bootcamps"
        copy="Create Output-Driven fixed sprints or Demand-Driven polling bootcamps. Review capstone project submissions to grant verified skill points."
        action={
          <button
            onClick={() => setIsCreatingBootcamp(true)}
            className="rounded-xl bg-[#12201b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#21352d] cursor-pointer"
          >
            <Plus className="mr-2 inline" size={15} />
            Create Bootcamp
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {(bootcampsQuery.data ?? []).map((bc) => {
          const isDemand = bc.type === "Demand-Driven" || !!bc.workshopPoll;
          const poll = bc.workshopPoll;
          const totalVotes = poll ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
          const topOpt = poll ? [...poll.options].sort((a, b) => b.votes - a.votes)[0] : null;

          return (
            <Card key={bc.id} className="card-lift space-y-3">
              <div className="flex items-center justify-between">
                <Tag tone={isDemand ? "blue" : "lime"}>
                  {bc.type || bc.category}
                </Tag>
                <Tag tone="orange">{bc.status}</Tag>
              </div>
              <h2 className="font-display text-xl font-bold text-[#12201b]">{bc.title}</h2>
              <p className="text-xs text-[#6d796f] leading-relaxed">{bc.description}</p>

              {isDemand && poll ? (
                /* DEMAND-DRIVEN: Show live poll result bars */
                <div className="mt-1 p-3 rounded-xl bg-[#f5f5f1] border border-[#dce2da] space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#6b78f7] uppercase tracking-wider">Live Poll Results</span>
                    <span className="text-[10px] font-mono text-[#78847b]">{totalVotes} total votes</span>
                  </div>
                  {poll.options.map((opt) => {
                    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    const isTop = topOpt?.id === opt.id;
                    return (
                      <div key={opt.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-medium truncate max-w-[75%] ${isTop ? "text-[#12201b] font-bold" : "text-[#4d5950]"}`}>{opt.label}</span>
                          <span className={`font-mono font-bold ml-2 shrink-0 ${isTop ? "text-[#6b78f7]" : "text-[#89948c]"}`}>{pct}% · {opt.votes} votes</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#e2e7e0] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: isTop ? "#6b78f7" : "#c7d4c7" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {topOpt && (
                    <div className="mt-2 pt-2 border-t border-[#dce2da] text-[10px] text-[#4d5950]">
                      <span className="font-bold text-[#12201b]">Leading:</span> {topOpt.label}
                    </div>
                  )}
                </div>
              ) : (
                /* OUTPUT-DRIVEN: Show enrollment stats */
                <div className="mt-1 p-3 rounded-xl bg-[#eff6df] border border-[#c8e2a3] space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#4d7459] uppercase tracking-wider">
                    <Check size={12} /> Fixed Mandatory Sprint · Enrollment Status
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <div className="font-display text-2xl font-bold text-[#12201b]">{bc.enrolledCount}</div>
                      <div className="text-[10px] text-[#4d7459] font-mono">Students Enrolled</div>
                    </div>
                    <div className="flex-1 h-3 rounded-full bg-[#d2e5b2] overflow-hidden">
                      <div className="h-full rounded-full bg-[#4d7459]" style={{ width: `${Math.min(100, Math.round((bc.enrolledCount / 300) * 100))}%` }} />
                    </div>
                    <div className="text-[10px] text-[#4d7459] font-mono font-bold shrink-0">
                      {Math.min(100, Math.round((bc.enrolledCount / 300) * 100))}% of cohort
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#edf0ec] flex justify-between items-center text-xs text-[#78847b]">
                <span>{bc.enrolledCount} Students {isDemand ? "Participated" : "Enrolled"}</span>
                <span className="font-bold text-[#12201b]">Active</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <TinyLabel>Skill Point Verification Queue</TinyLabel>
              <h2 className="text-lg font-semibold mt-1">Pending Student Capstone Projects</h2>
            </div>
            <Tag tone="orange">{pendingSubs.data?.length ?? 0} Submissions Pending</Tag>
          </div>

          <div className="mt-5 space-y-4">
            {!pendingSubs.data || pendingSubs.data.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#78847b] border border-dashed border-[#dce2da] rounded-2xl">
                No pending capstone project submissions.
              </div>
            ) : (
              pendingSubs.data.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl border border-[#dce2da] bg-[#f5f5f1] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e7e0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#12201b]">{sub.studentName}</span>
                      <span className="text-xs text-[#78847b] font-mono">({sub.studentEmail})</span>
                      <Tag tone="blue">{sub.courseTitle}</Tag>
                    </div>
                    <span className="text-[11px] text-[#78847b] font-mono">
                      Submitted {new Date(sub.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#12201b]">{sub.projectTitle}</h3>
                    <p className="text-xs text-[#4d5950] mt-1.5 leading-relaxed bg-white p-3 rounded-xl border border-[#e2e7e0]">
                      <strong className="text-[#12201b]">What was built:</strong> {sub.notes || "No architectural description provided."}
                    </p>
                  </div>

                  {sub.skills && sub.skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-bold text-[#12201b] mr-1">Demonstrated Skills:</span>
                      {sub.skills.map((sk) => (
                        <span key={sk} className="px-2.5 py-0.5 rounded-md bg-[#12201b] text-white font-mono text-[10px] font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e2e7e0]">
                    <div className="flex items-center gap-3 text-xs">
                      {sub.githubUrl && (
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#dce2da] text-[#6b78f7] font-mono font-semibold flex items-center gap-1.5 hover:bg-[#edf0ec]"
                        >
                          <FolderGit2 size={13} /> Code Repository <ExternalLink size={11} />
                        </a>
                      )}
                      {sub.liveUrl && (
                        <a
                          href={sub.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#dce2da] text-[#4d7459] font-mono font-semibold flex items-center gap-1.5 hover:bg-[#edf0ec]"
                        >
                          <ExternalLink size={13} /> Live Demo URL <ExternalLink size={11} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={verifyMut.isPending}
                        onClick={() =>
                          verifyMut.mutate({
                            submissionId: sub.id,
                            approved: false,
                          })
                        }
                        className="rounded-xl border border-[#dce2da] bg-white px-3 py-2 text-xs font-bold text-[#a75b18] hover:bg-[#fff0de] cursor-pointer"
                      >
                        <X className="mr-1 inline" size={13} />
                        Request Rework
                      </button>
                      <button
                        disabled={verifyMut.isPending}
                        onClick={() =>
                          verifyMut.mutate({
                            submissionId: sub.id,
                            approved: true,
                            pointsToAward: 15,
                          })
                        }
                        className="rounded-xl bg-[#12201b] px-4 py-2 text-xs font-bold text-white hover:bg-[#20332b] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={14} />
                        Approve & Award +15 Verified Pts
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function TpoStudents() {
  const [query, setQuery] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("all");
  const tpoData = trpc.omen.tpoDashboard.useQuery();

  const candidates = tpoData.data?.candidates ?? [
    { id: "CS21B047", name: "Aarav Mehta", email: "aarav.mehta@university.edu", branch: "CSE", cohort: "2026", cgpa: 8.42, score: 74, target: "Full Stack Engineer", status: "Ready" },
  ];

  const filtered = candidates.filter(
    (s) =>
      (s.name.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase()) || s.id.toLowerCase().includes(query.toLowerCase())) &&
      (selectedCohort === "all" || s.cohort === selectedCohort)
  );

  return (
    <div>
      <PageHeader
        eyebrow="TPO · Student Intelligence"
        title="Institutional Candidate Profiles"
        copy="Search, filter, and review student employability scores, verified evidence strength, and target role alignments."
        action={
          <div className="flex items-center gap-2">
            <Tag tone="lime">{filtered.length} Students Tracked</Tag>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#89948c]" />
          <input
            type="text"
            placeholder="Search student by name, ID, or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-[#dce2da] bg-white pl-10 pr-4 py-2.5 text-xs text-[#12201b] focus:outline-none focus:border-[#6b78f7]"
          />
        </div>

        <select
          value={selectedCohort}
          onChange={(e) => setSelectedCohort(e.target.value)}
          className="rounded-xl border border-[#dce2da] bg-white px-3.5 py-2.5 text-xs font-medium text-[#12201b]"
        >
          <option value="all">All Cohorts (2026, 2027)</option>
          <option value="2026">2026 Cohort</option>
          <option value="2027">2027 Cohort</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[#edf0ec] text-xs uppercase tracking-wide font-mono text-[#89948c]">
              <tr>
                <th className="pb-3 font-normal">Student</th>
                <th className="pb-3 font-normal">Branch / Cohort</th>
                <th className="pb-3 font-normal">CGPA</th>
                <th className="pb-3 font-normal">Target Role</th>
                <th className="pb-3 font-normal">Score</th>
                <th className="pb-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-[#edf0ec] last:border-none">
                  <td className="py-4">
                    <div className="font-semibold text-[#12201b]">{s.name}</div>
                    <div className="text-xs text-[#78847b]">{s.id} · {s.email}</div>
                  </td>
                  <td className="py-4 text-[#6b756e]">{s.branch} · {s.cohort}</td>
                  <td className="py-4 font-mono font-semibold">{s.cgpa}</td>
                  <td className="py-4 text-[#12201b] font-medium">{s.target}</td>
                  <td className="py-4 font-mono font-bold text-[#6b78f7]">{s.score}/100</td>
                  <td className="py-4">
                    <Tag tone={s.status === "Ready" ? "lime" : s.status === "Building" ? "blue" : "orange"}>
                      {s.status}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function TpoCohorts() {
  const tpo = trpc.omen.tpoDashboard.useQuery();
  return (
    <div>
      <PageHeader
        eyebrow="TPO · Cohort Intelligence"
        title="Graduating Cohort Analysis"
        copy="Group student performance by department, semester, and target readiness to spot at-risk cohorts early."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <TinyLabel>Cohort Breakdown</TinyLabel>
              <h2 className="text-lg font-semibold mt-1">Readiness Distribution</h2>
            </div>
            <Tag tone="blue">2026 & 2027 Cohorts</Tag>
          </div>

          <div className="space-y-4">
            {(tpo.data?.cohorts ?? []).map((c) => (
              <div key={c.label} className="p-4 rounded-xl bg-[#f5f5f1] border border-[#dce2da]">
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span>{c.label}</span>
                  <span className="font-mono text-[#6b78f7]">{c.score}% Avg Readiness</span>
                </div>
                <div className="h-2 rounded-full bg-[#dce2da] overflow-hidden">
                  <div
                    className="h-full bg-[#6b78f7] rounded-full"
                    style={{ width: `${c.score}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-[#78847b]">
                  <span>{c.students} Students Enrolled</span>
                  <span>Primary Gap: Cloud & System Design</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <TinyLabel>At-Risk Cohort Signal</TinyLabel>
          <h2 className="text-lg font-semibold mt-1">Students Needing Intervention</h2>
          <p className="text-xs text-[#78847b] mt-2 leading-relaxed">
            124 students are currently below the target placement threshold (60/100).
          </p>

          <div className="mt-5 space-y-3">
            <div className="p-3 rounded-xl bg-[#fff0de] border border-[#f7b267]/30 text-xs">
              <div className="font-semibold text-[#a75b18]">Cloud Infrastructure Deficit</div>
              <div className="text-[#815d34] mt-1">87 students in ECE & IT need Docker & AWS verification.</div>
            </div>

            <div className="p-3 rounded-xl bg-[#dfe5ff] border border-[#6b78f7]/30 text-xs">
              <div className="font-semibold text-[#4f5cc1]">DSA & Algorithms</div>
              <div className="text-[#3b479d] mt-1">37 students are 1 level below company screening cutoffs.</div>
            </div>
          </div>

          <Link
            href="/tpo/bootcamps"
            className="mt-6 w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#12201b] text-white text-xs font-semibold"
          >
            Launch Targeted Bootcamp <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
}

function TpoSkillIntelligence() {
  const skillHeatmap = [
    { skill: "Python", demand: "HIGH", supply: "HIGH", gap: "LOW", gapVal: 12, status: "Healthy" },
    { skill: "SQL", demand: "HIGH", supply: "HIGH", gap: "LOW", gapVal: 15, status: "Healthy" },
    { skill: "Cloud (AWS)", demand: "HIGH", supply: "LOW", gap: "HIGH", gapVal: 46, status: "Intervention Required" },
    { skill: "Docker", demand: "HIGH", supply: "LOW", gap: "HIGH", gapVal: 42, status: "Intervention Required" },
    { skill: "Machine Learning", demand: "HIGH", supply: "MEDIUM", gap: "MEDIUM", gapVal: 28, status: "Building" },
    { skill: "System Design", demand: "HIGH", supply: "LOW", gap: "HIGH", gapVal: 39, status: "Intervention Required" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="TPO · Flagship Feature"
        title="Institutional Skill Heatmap"
        copy="Compare real-time industry market demand against institutional student supply and verified project evidence."
      />

      <div className="grid gap-5">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <TinyLabel>Market ↔ Institution Alignment</TinyLabel>
              <h2 className="text-lg font-semibold mt-1">Skill Gap Heatmap</h2>
            </div>
            <Tag tone="orange">14% Institutional Readiness Deficit</Tag>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-[#edf0ec] text-xs uppercase font-mono text-[#89948c]">
                <tr>
                  <th className="pb-3">Skill</th>
                  <th className="pb-3">Market Demand</th>
                  <th className="pb-3">Student Supply</th>
                  <th className="pb-3">Institutional Gap</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {skillHeatmap.map((item) => (
                  <tr key={item.skill} className="border-b border-[#edf0ec] last:border-none">
                    <td className="py-4 font-bold text-[#12201b]">{item.skill}</td>
                    <td className="py-4 font-mono font-semibold text-[#6b78f7]">{item.demand}</td>
                    <td className="py-4 font-mono text-[#6b756e]">{item.supply}</td>
                    <td className="py-4 font-mono font-bold text-[#a75b18]">{item.gapVal}% Deficit</td>
                    <td className="py-4">
                      <Tag tone={item.gap === "HIGH" ? "orange" : item.gap === "MEDIUM" ? "blue" : "lime"}>
                        {item.status}
                      </Tag>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href="/tpo/bootcamps"
                        className="rounded-lg border border-[#dce2da] px-3 py-1.5 text-xs font-semibold hover:bg-[#f5f5f1]"
                      >
                        Create Sprint
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TpoApplications() {
  const applicationsQuery = trpc.omen.applications.useQuery();
  const funnelQuery = trpc.omen.placementFunnel.useQuery();

  const fData = funnelQuery.data || {
    totalApplications: 84,
    eligibleCandidates: 66,
    shortlisted: 18,
    interviewsScheduled: 9,
    offersExtended: 3,
    shortlistToInterviewRate: "50%",
    interviewToOfferRate: "33%",
    bottleneckNote: "Primary bottleneck: Advanced Technical Round System Design & Window Functions.",
  };

  const funnel = [
    { stage: "Applications Received", count: fData.totalApplications, rate: "100%" },
    { stage: "Eligible Students", count: fData.eligibleCandidates, rate: `${Math.round((fData.eligibleCandidates / Math.max(fData.totalApplications, 1)) * 100)}%` },
    { stage: "Shortlisted by TPO", count: fData.shortlisted, rate: `${Math.round((fData.shortlisted / Math.max(fData.totalApplications, 1)) * 100)}%` },
    { stage: "Interviews Scheduled", count: fData.interviewsScheduled, rate: fData.shortlistToInterviewRate },
    { stage: "Offers Extended", count: fData.offersExtended, rate: fData.interviewToOfferRate },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="TPO · Application Intelligence"
        title="Institutional Placement Funnel & Candidate Applications"
        copy="Monitor candidate conversion from application to offer and evaluate candidate resume match scores."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <TinyLabel>Hiring Pipeline Funnel</TinyLabel>
          <h2 className="text-lg font-semibold mt-1">Stage-by-Stage Conversion</h2>

          <div className="mt-6 space-y-4">
            {funnel.map((item, idx) => (
              <div key={item.stage} className="p-4 rounded-xl bg-[#f5f5f1] border border-[#dce2da]">
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span>
                    {idx + 1}. {item.stage}
                  </span>
                  <span className="font-mono text-[#6b78f7]">{item.count} Candidates ({item.rate})</span>
                </div>
                <div className="h-2 rounded-full bg-[#dce2da] overflow-hidden">
                  <div
                    className="h-full bg-[#12201b] rounded-full"
                    style={{ width: item.rate }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <TinyLabel>Funnel Bottleneck Analysis</TinyLabel>
          <h2 className="text-lg font-semibold mt-1">Key Insights</h2>

          <div className="mt-4 space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#dfe5ff] text-[#3b479d]">
              <strong>Shortlist → Interview: {fData.shortlistToInterviewRate}</strong>
              <p className="mt-1">Students with verified project evidence have 2.4x higher interview conversion.</p>
            </div>

            <div className="p-3 rounded-xl bg-[#fff0de] text-[#815d34]">
              <strong>Interview → Offer: {fData.interviewToOfferRate}</strong>
              <p className="mt-1">{fData.bottleneckNote}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <TinyLabel>Live Student Submissions</TinyLabel>
              <h2 className="text-lg font-semibold mt-1">Submitted Applications & Candidate Evaluations</h2>
            </div>
            <Tag tone="lime">{applicationsQuery.data?.length ?? 0} Applications Received</Tag>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#edf0ec] text-xs uppercase tracking-wide font-mono text-[#89948c]">
                <tr>
                  <th className="pb-3 font-normal">Candidate</th>
                  <th className="pb-3 font-normal">Opportunity / Company</th>
                  <th className="pb-3 font-normal">Resume-JD Match Score</th>
                  <th className="pb-3 font-normal">Missing Skills</th>
                  <th className="pb-3 font-normal">Resume</th>
                  <th className="pb-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!applicationsQuery.data || applicationsQuery.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#78847b]">
                      No student applications submitted yet.
                    </td>
                  </tr>
                ) : (
                  applicationsQuery.data.map((app) => (
                    <tr key={app.id} className="border-b border-[#edf0ec] last:border-none">
                      <td className="py-4">
                        <div className="font-semibold text-sm">{app.studentName}</div>
                        <div className="text-xs text-[#78847b]">{app.studentEmail}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-semibold text-sm">{app.job?.title || "Role"}</div>
                        <div className="text-xs text-[#78847b]">{app.job?.company || "Company"}</div>
                      </td>
                      <td className="py-4 font-mono font-bold">
                        <Tag tone={app.matchScore >= 80 ? "lime" : app.matchScore >= 60 ? "blue" : "orange"}>
                          {app.matchScore}% Match
                        </Tag>
                      </td>
                      <td className="py-4 text-xs text-[#78847b]">
                        {app.missingSkills && app.missingSkills.length > 0 ? (
                          <span className="text-[#a75b18]">{app.missingSkills.join(", ")}</span>
                        ) : (
                          <span className="text-[#4d7459] font-medium">None (Full Match)</span>
                        )}
                      </td>
                      <td className="py-4">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6b78f7] hover:underline"
                        >
                          <ExternalLink size={13} /> View Resume
                        </a>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => toast.success(`Candidate ${app.studentName} shortlisted for ${app.job?.title}`)}
                          className="rounded-lg border border-[#dce2da] px-3 py-1.5 text-xs font-semibold hover:bg-[#f5f5f1]"
                        >
                          Shortlist
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// STUDENT MODULE: BOOTCAMPS & WORKSHOP POLLS
function StudentBootcampsPage() {
  const bootcamps = trpc.omen.bootcamps.useQuery();
  const utils = trpc.useUtils();
  const voteMut = trpc.omen.voteBootcampWorkshop.useMutation({
    onSuccess: () => {
      toast.success("Your choice for the workshop topic has been published!");
      bootcamps.refetch();
    },
  });

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student OS · Bootcamps & Live Workshop Polls"
        title="Institutional Placement Bootcamps & Topic Selection"
        copy="Access fixed mandatory placement sprints or publish your choice in live demand-driven workshop polls."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {(bootcamps.data ?? []).map((bc) => {
          const isDemand = bc.type === "Demand-Driven" || !!bc.workshopPoll;
          const poll = bc.workshopPoll;
          const totalVotes = poll ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
          const currentSelection = poll
            ? selectedOptions[bc.id] || poll.userVotedOptionId || poll.options[0]?.id
            : "";

          return (
            <Card key={bc.id} className="card-lift space-y-4">
              <div className="flex items-center justify-between">
                <Tag tone={isDemand ? "blue" : "lime"}>
                  {bc.category || (isDemand ? "Demand-Driven Poll" : "Output-Driven Sprint")}
                </Tag>
                <Tag tone="lime">{bc.status}</Tag>
              </div>

              <h2 className="text-xl font-bold text-[#12201b] font-display">{bc.title}</h2>
              <p className="text-xs text-[#6d796f] leading-relaxed">{bc.description}</p>

              {isDemand && poll ? (
                /* DEMAND-DRIVEN WORKSHOP POLL (4 OPTIONS) */
                <div className="p-4 rounded-2xl bg-[#f5f5f1] border border-[#dce2da] space-y-3">
                  <div className="text-xs font-bold text-[#12201b] flex items-center gap-1.5">
                    <MessageCircle size={14} className="text-[#6b78f7]" /> {poll.question}
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((opt) => {
                      const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      const isSelected = currentSelection === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedOptions({ ...selectedOptions, [bc.id]: opt.id })}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "border-[#6b78f7] bg-white text-[#12201b] font-semibold shadow-sm"
                              : "border-[#dce2da] bg-[#edf0ec] text-[#4d5950] hover:bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span>{opt.label}</span>
                            <span className="font-mono text-[11px] font-bold text-[#6b78f7]">
                              {pct}% ({opt.votes} votes)
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#dce2da] overflow-hidden">
                            <div className="h-full bg-[#6b78f7] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={voteMut.isPending}
                    onClick={() =>
                      voteMut.mutate({
                        bootcampId: bc.id,
                        optionId: currentSelection,
                      })
                    }
                    className="mt-2 w-full py-2.5 bg-[#12201b] text-white text-xs font-bold rounded-xl hover:bg-[#20332b] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check size={14} /> Publish Choice & Cast Vote
                  </button>
                </div>
              ) : (
                /* OUTPUT-DRIVEN FIXED SPRINT */
                <div className="p-4 rounded-2xl bg-[#eff6df] border border-[#d2e5b2] space-y-2">
                  <div className="text-xs font-bold text-[#2d4b1e] flex items-center gap-1.5">
                    <Check size={14} className="text-[#4d7459]" /> Fixed Mandatory Placement Sprint
                  </div>
                  <p className="text-[11px] text-[#4d5950] leading-relaxed">
                    {bc.description || "This output-driven sprint is assigned to all students in the current cohort."}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <div>
                      <div className="font-display text-xl font-bold text-[#12201b]">{bc.enrolledCount}</div>
                      <div className="text-[10px] text-[#4d7459] font-mono">Students Enrolled</div>
                    </div>
                    <div className="flex-1 h-2.5 rounded-full bg-[#c8e2a3] overflow-hidden">
                      <div className="h-full rounded-full bg-[#4d7459]" style={{ width: `${Math.min(100, Math.round((bc.enrolledCount / 300) * 100))}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success(`Enrolled in mandatory sprint: ${bc.title}!`)}
                    className="w-full py-2.5 bg-[#12201b] text-white text-xs font-bold rounded-xl hover:bg-[#20332b] flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    Enroll / View Mandatory Sprint Syllabus →
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[#edf0ec] pt-3 text-xs text-[#78847b]">
                <span>{bc.enrolledCount} Students Enrolled</span>
                <span className="font-mono text-[11px] font-semibold text-[#6b78f7]">{bc.status}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// STUDENT MODULE: AI RESUME MOCK INTERVIEW STUDIO
function MockInterviewPage() {
  const questionsQuery = trpc.omen.mockInterviewQuestions.useQuery();
  const utils = trpc.useUtils();
  const [activeQuestionId, setActiveQuestionId] = useState("q-1");
  const [answerText, setAnswerText] = useState("");
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const questions = questionsQuery.data ?? [];
  const currentQ = questions.find((q) => q.id === activeQuestionId) || questions[0];

  const evalMut = trpc.omen.evaluateMockInterviewAnswer.useMutation({
    onSuccess: (data) => {
      setEvaluation(data);
      toast.success(`Answer evaluated! Score: ${data.score}/100`);
    },
  });

  const refreshMut = trpc.omen.refreshMockInterviewQuestions.useMutation({
    onSuccess: () => {
      setIsRefreshing(true);
      utils.omen.mockInterviewQuestions.invalidate().then(() => {
        setActiveQuestionId("q-1");
        setAnswerText("");
        setEvaluation(null);
        setIsRefreshing(false);
        toast.success("Fresh set of resume-based questions generated!");
      });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student OS · AI Resume Mock Interview Studio"
        title="Interactive Resume-Trained Mock Interviewer"
        copy="Practice technical & behavioral interview questions generated directly from your uploaded resume skills, projects, and target roles."
        action={
          <button
            onClick={() => refreshMut.mutate()}
            disabled={refreshMut.isPending || isRefreshing}
            className="flex items-center gap-2 rounded-xl bg-[#12201b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20332b] disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={14} className={refreshMut.isPending || isRefreshing ? "animate-spin" : ""} />
            Generate New Questions
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* QUESTIONS SELECTION SIDEBAR */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <TinyLabel>Generated Question Bank</TinyLabel>
              <h2 className="text-base font-bold text-[#12201b] mt-1">Resume-Derived Questions</h2>
            </div>
            <span className="font-mono text-[10px] text-[#89948c] bg-[#f5f5f1] px-2 py-1 rounded-lg">{questions.length} questions</span>
          </div>

          <div className="space-y-2">
            {questions.map((q, idx) => {
              const isActive = q.id === (currentQ?.id || activeQuestionId);
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionId(q.id);
                    setAnswerText("");
                    setEvaluation(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "border-[#12201b] bg-[#12201b] text-white font-bold"
                      : "border-[#dce2da] bg-[#f5f5f1] text-[#12201b] hover:bg-[#edf0ec]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] opacity-75">Question #{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-[#dce2da] text-[#12201b]"}`}>
                      {q.category}
                    </span>
                  </div>
                  <div className="line-clamp-2 leading-relaxed">{q.question}</div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#edf0ec] text-center">
            <button
              onClick={() => refreshMut.mutate()}
              disabled={refreshMut.isPending || isRefreshing}
              className="w-full py-2.5 rounded-xl border border-[#dce2da] bg-[#f5f5f1] text-xs font-semibold text-[#6b78f7] hover:bg-[#dfe5ff] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={13} className={refreshMut.isPending || isRefreshing ? "animate-spin" : ""} />
              Generate New Set
            </button>
          </div>
        </Card>

        {/* INTERVIEW WORKSPACE */}
        <div className="space-y-4">
          {currentQ && (
            <Card className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#edf0ec] pb-3">
                <Tag tone="blue">{currentQ.category}</Tag>
                <span className="font-mono text-xs text-[#6b78f7] font-semibold">{currentQ.context}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#12201b] leading-snug">{currentQ.question}</h3>
                <div className="mt-3 p-3 rounded-xl bg-[#eff6df] border border-[#c8e2a3] text-xs text-[#29422e] space-y-1">
                  <strong>Key Architectural Expectations:</strong>
                  <ul className="list-disc list-inside space-y-0.5 mt-1 text-[11px]">
                    {currentQ.keyExpectations.map((exp: string) => (
                      <li key={exp}>{exp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12201b] mb-1.5 flex items-center justify-between">
                  <span>Your Answer (Text or Speech Response)</span>
                  <span className="font-mono text-[10px] text-[#78847b]">State tradeoffs & metrics</span>
                </label>
                <textarea
                  rows={6}
                  placeholder="Type your response or dictate your architectural explanation here..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full rounded-xl border border-[#dce2da] bg-[#f5f5f1] p-3 text-xs text-[#12201b] focus:bg-white focus:outline-none focus:border-[#6b78f7]"
                />
              </div>

              <button
                disabled={answerText.trim().length < 5 || evalMut.isPending}
                onClick={() =>
                  evalMut.mutate({
                    questionId: currentQ.id,
                    answer: answerText,
                  })
                }
                className="w-full py-3 bg-[#12201b] text-white text-xs font-bold rounded-xl hover:bg-[#20332b] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {evalMut.isPending ? "Evaluating Response with AI..." : "Submit Answer for AI Evaluation"} <Send size={14} />
              </button>
            </Card>
          )}

          {/* AI EVALUATION CARD */}
          {evaluation && (
            <Card className="bg-[#12201b] text-white space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <TinyLabel>AI Evaluation & Score Card</TinyLabel>
                <div className="px-3 py-1 rounded-xl bg-[#d7fb61] text-[#12201b] font-display text-sm font-bold">
                  Score: {evaluation.score}/100
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-[#d7fb61] font-bold">Key Strengths:</div>
                <ul className="list-disc list-inside space-y-1 text-[#b9c7bb]">
                  {evaluation.strengths.map((str: string, i: number) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>

                <div className="text-[#f7b267] font-bold mt-3">Areas for Improvement / Missing Points:</div>
                <ul className="list-disc list-inside space-y-1 text-[#e2cfb8]">
                  {evaluation.missingPoints.map((mp: string, i: number) => (
                    <li key={i}>{mp}</li>
                  ))}
                </ul>

                <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/10 text-xs leading-relaxed text-[#d1dad3]">
                  <strong className="text-white">Sample Model Answer Strategy:</strong>
                  <p className="mt-1">{evaluation.modelAnswer}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// EXTERNAL JOBS MODULE — Off-Campus Placement Portal
const EXTERNAL_JOBS = [
  {
    id: "ext-1",
    company: "Google",
    title: "Software Engineer, New Grad 2026",
    location: "Bengaluru · Hybrid",
    ctc: "₹28–35 LPA",
    deadline: "2026-10-20",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/",
    applyUrl: "https://careers.google.com/jobs/",
    description: "Join Google's engineering team to build systems used by billions of people. Focused on distributed systems, backend infrastructure, and cloud-native applications.",
    requiredSkills: ["Python", "Data Structures", "SQL", "System Design"],
    category: "Tech Giant",
    posted: "2 days ago",
  },
  {
    id: "ext-2",
    company: "Razorpay",
    title: "Backend Engineer — Payments Core",
    location: "Bengaluru · On-site",
    ctc: "₹18–24 LPA",
    deadline: "2026-10-05",
    source: "AngelList",
    sourceUrl: "https://angel.co/jobs",
    applyUrl: "https://razorpay.com/jobs/",
    description: "Work on Razorpay's core payment gateway infrastructure handling ₹2L Cr+ in annualised TPV. Strong Go/Python, distributed systems, and financial product experience preferred.",
    requiredSkills: ["Python", "SQL", "FastAPI", "Git"],
    category: "Fintech",
    posted: "1 day ago",
  },
  {
    id: "ext-3",
    company: "Zepto",
    title: "Data Analyst — Growth & Retention",
    location: "Mumbai · Hybrid",
    ctc: "₹12–16 LPA",
    deadline: "2026-09-30",
    source: "Naukri",
    sourceUrl: "https://www.naukri.com/",
    applyUrl: "https://www.naukri.com/zepto-jobs",
    description: "Drive Zepto's hyperlocal commerce analytics. Build cohort analyses, funnel models, and growth experiments using SQL and Python. Work directly with product and growth leadership.",
    requiredSkills: ["SQL", "Python", "Communication"],
    category: "Startup",
    posted: "3 days ago",
  },
  {
    id: "ext-4",
    company: "CRED",
    title: "Frontend Engineer — Design Systems",
    location: "Bengaluru · Hybrid",
    ctc: "₹16–22 LPA",
    deadline: "2026-10-10",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/",
    applyUrl: "https://careers.cred.club/",
    description: "Build CRED's component library and design system used across iOS, Android, and Web. React, TypeScript, and Storybook expertise essential. Pixel-perfect taste required.",
    requiredSkills: ["React", "TypeScript", "Git"],
    category: "Fintech",
    posted: "Today",
  },
  {
    id: "ext-5",
    company: "Sarvam AI",
    title: "AI/ML Engineer — Indic Language Models",
    location: "Bengaluru · On-site",
    ctc: "₹20–28 LPA",
    deadline: "2026-10-15",
    source: "AngelList",
    sourceUrl: "https://angel.co/jobs",
    applyUrl: "https://sarvam.ai/careers",
    description: "Build state-of-the-art LLMs for Indic languages. Work on pre-training, fine-tuning, RLHF, and production deployment of multi-lingual transformer models.",
    requiredSkills: ["Python", "Machine Learning", "FastAPI"],
    category: "AI/ML",
    posted: "5 days ago",
  },
  {
    id: "ext-6",
    company: "Internshala",
    title: "Software Developer Intern (6 months → PPO)",
    location: "Remote · India",
    ctc: "₹30–50k/month",
    deadline: "2026-09-28",
    source: "Internshala",
    sourceUrl: "https://internshala.com/",
    applyUrl: "https://internshala.com/internships/",
    description: "6-month SDE internship with Pre-Placement Offer. Work on full-stack features used by 15M+ students. React, Node.js, and PostgreSQL stack.",
    requiredSkills: ["React", "SQL", "Git"],
    category: "Internship + PPO",
    posted: "Yesterday",
  },
];

const SOURCE_COLORS: Record<string, string> = {
  LinkedIn: "bg-[#0a66c2] text-white",
  Naukri: "bg-[#f24e2c] text-white",
  AngelList: "bg-[#12201b] text-white",
  Internshala: "bg-[#00aeef] text-white",
};

function ExternalJobsPage() {
  const skillsQuery = trpc.omen.skills.useQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set());

  const studentSkills = useMemo(() => {
    return skillsQuery.data?.map((s) => s.name) ?? ["Python", "React", "SQL", "Git"];
  }, [skillsQuery.data]);

  const calcMatchScore = (requiredSkills: string[]) => {
    const matched = requiredSkills.filter((skill) =>
      studentSkills.some((s: string) => s.toLowerCase() === skill.toLowerCase())
    );
    return Math.round((matched.length / requiredSkills.length) * 100);
  };

  const categories = ["All", "Tech Giant", "Fintech", "Startup", "AI/ML", "Internship + PPO"];
  const filtered = EXTERNAL_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "All" || job.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Off-Campus · External Opportunities"
        title="Beyond Campus Placements."
        copy="Curated off-campus roles from LinkedIn, Naukri, AngelList, and Internshala — matched against your OMEN resume profile. Click Apply to go directly to the company portal."
        action={
          <div className="flex items-center gap-2">
            <Tag tone="blue">{filtered.length} Live Listings</Tag>
            <a href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-[#dce2da] bg-white px-3 py-2 text-xs font-semibold text-[#6b756e] hover:bg-[#edf0ec]">
              <Globe size={13} /> Browse All on LinkedIn
            </a>
          </div>
        }
      />

      {/* FILTERS */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#89948c]" />
          <input
            type="text"
            placeholder="Search role, company, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#dce2da] bg-white pl-10 pr-4 py-2.5 text-xs text-[#12201b] focus:outline-none focus:border-[#6b78f7]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${category === cat ? "bg-[#12201b] text-white" : "border border-[#dce2da] bg-white text-[#6b756e] hover:bg-[#edf0ec]"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((job) => {
          const score = calcMatchScore(job.requiredSkills);
          const matchedSkills = job.requiredSkills.filter((s) =>
            studentSkills.some((sk: string) => sk.toLowerCase() === s.toLowerCase())
          );
          const isTracked = trackedIds.has(job.id);
          const daysLeft = Math.max(0, Math.round((new Date(job.deadline).getTime() - Date.now()) / 86400000));

          return (
            <Card key={job.id} className="card-lift">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#12201b] font-display font-bold text-[#d7fb61] text-lg">
                    {job.company.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-[#6b78f7]">{job.company}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${SOURCE_COLORS[job.source] ?? "bg-[#eef1ec] text-[#5c6b61]"}`}>
                        {job.source}
                      </span>
                      <Tag tone="gray">{job.category}</Tag>
                    </div>
                    <h2 className="mt-1 text-xl font-semibold">{job.title}</h2>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#78847b]">
                      <span className="flex items-center gap-1"><MapPin size={13} />{job.location}</span>
                      <span className="flex items-center gap-1"><Award size={13} />{job.ctc}</span>
                      <span className="flex items-center gap-1"><BriefcaseBusiness size={13} />{daysLeft} days left · {job.posted}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="rounded-xl bg-[#eef1ec] px-4 py-2 text-center">
                    <div className={`font-display text-2xl font-bold ${score >= 70 ? "text-[#4d7459]" : score >= 40 ? "text-[#a75b18]" : "text-[#6b756e]"}`}>
                      {score}%
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-[.12em] text-[#78847b]">Resume Match</div>
                  </div>
                  {score >= 70 ? <Tag tone="lime">Strong Match</Tag> : score >= 40 ? <Tag tone="orange">Partial Match</Tag> : <Tag tone="gray">Skill Gap</Tag>}
                </div>
              </div>

              <p className="mt-5 max-w-[720px] text-sm leading-6 text-[#66736a]">{job.description}</p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#edf0ec] pt-4">
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span key={skill} className={`rounded-md px-2 py-1 text-[10px] font-mono ${matchedSkills.includes(skill) ? "bg-[#e7f5d0] text-[#4c6e3d]" : "bg-[#fff0de] text-[#a75b18]"}`}>
                      {matchedSkills.includes(skill) ? "✓ " : "→ "}{skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = new Set(trackedIds);
                      if (isTracked) next.delete(job.id); else next.add(job.id);
                      setTrackedIds(next);
                      toast.success(isTracked ? "Removed from tracker" : "Added to your application tracker!");
                    }}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${isTracked ? "border-[#4d7459] bg-[#eff6df] text-[#4d7459]" : "border-[#dce2da] bg-white text-[#6b756e] hover:bg-[#edf0ec]"}`}
                  >
                    {isTracked ? <><Check size={12} className="mr-1 inline" />Tracked</> : "Track Application"}
                  </button>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-[#12201b] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#20332b]"
                    onClick={() => toast.success(`Opening ${job.company} application portal...`)}
                  >
                    Apply Now <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-center py-16 text-sm text-[#78847b] border border-dashed border-[#dce2da] rounded-2xl">
          No external jobs match your search. <button onClick={() => { setSearch(""); setCategory("All"); }} className="text-[#6b78f7] font-semibold underline">Clear filters</button>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[#dce2da] bg-[#f5f5f1] p-5 flex items-start gap-4">
        <Globe size={22} className="text-[#6b78f7] shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-bold text-[#12201b]">More External Job Portals</div>
          <p className="mt-1 text-xs text-[#78847b] leading-relaxed">Explore additional platforms: <a href="https://www.naukri.com/" target="_blank" rel="noreferrer" className="text-[#6b78f7] font-semibold hover:underline">Naukri</a> · <a href="https://angel.co/jobs" target="_blank" rel="noreferrer" className="text-[#6b78f7] font-semibold hover:underline">AngelList</a> · <a href="https://internshala.com/" target="_blank" rel="noreferrer" className="text-[#6b78f7] font-semibold hover:underline">Internshala</a> · <a href="https://wellfound.com/" target="_blank" rel="noreferrer" className="text-[#6b78f7] font-semibold hover:underline">Wellfound</a> · <a href="https://www.instahyre.com/" target="_blank" rel="noreferrer" className="text-[#6b78f7] font-semibold hover:underline">InstaHyre</a>. Use your OMEN resume score to gauge your match before applying externally.</p>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-[#12201b]/30 p-4"><div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-3xl border border-[#dce2da] bg-white p-5 soft-shadow sm:p-7"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold tracking-[-.04em]">{title}</h2><button onClick={onClose} className="rounded-lg p-2 text-[#89948c] hover:bg-[#f5f5f1]" aria-label="Close"><X size={18} /></button></div><div className="mt-6">{children}</div></div></div>; }
function LoadingState({ label }: { label: string }) { return <div className="grid min-h-[60vh] place-items-center"><div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dce2da] border-t-[#6b78f7]" /><div className="mt-4 text-sm text-[#78847b]">{label}…</div></div></div>; }
