import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  GraduationCap,
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { OmenLogo } from "@/components/OmenShell";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { login, signup } = useAuth();

  // Mode: "login" or "signup"
  const [mode, setMode] = useState<"login" | "signup">("login");
  // Active Role: "student" or "tpo"
  const [role, setRole] = useState<"student" | "tpo">("student");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Switch role tab
  const handleRoleChange = (newRole: "student" | "tpo") => {
    setRole(newRole);
    setErrorMessage(null);
    if (mode === "login") {
      if (newRole === "student") {
        setEmail("aarav.mehta@university.edu");
        setPassword("password123");
      } else {
        setEmail("tpo@university.edu");
        setPassword("admin123");
      }
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const res = await login({
          email: email.trim(),
          password,
          role,
        });

        toast.success(`Welcome back, ${res.user.name}!`);
        setLocation(res.redirectUrl);
      } else {
        if (!name.trim()) {
          setErrorMessage("Please enter your full name.");
          setIsSubmitting(false);
          return;
        }

        const res = await signup({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });

        toast.success(`Account created! Welcome to OMEN, ${res.user.name}.`);
        setLocation(res.redirectUrl);
      }
    } catch (err: any) {
      const msg = err?.message || "Authentication failed. Please check your credentials.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Login Presets
  const fillDemoStudent = () => {
    setRole("student");
    setMode("login");
    setEmail("aarav.mehta@university.edu");
    setPassword("password123");
    setErrorMessage(null);
  };

  const fillDemoTPO = () => {
    setRole("tpo");
    setMode("login");
    setEmail("tpo@university.edu");
    setPassword("admin123");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f1] text-[#12201b] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Gradients & Mesh */}
      <div className="shell-grid absolute inset-0 opacity-70 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d7fb61]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6b78f7]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 mx-auto w-full max-w-[1240px] flex items-center justify-between px-5 py-5 sm:px-8">
        <OmenLogo />

        <Link
          href="/"
          className="text-xs font-semibold text-[#66736a] hover:text-[#12201b] transition-colors flex items-center gap-1"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[460px] bg-[#12201b] text-white border border-[#26352d] rounded-[28px] p-6 sm:p-8 soft-shadow relative">
          
          {/* OMEN Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#d7fb61] font-mono text-[11px] font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" /> OMEN Career Intelligence
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">
              {mode === "login" ? "Sign in to OMEN" : "Create your OMEN Account"}
            </h1>
            <p className="text-xs text-[#a9b8ac] mt-1.5 leading-relaxed">
              {mode === "login"
                ? "Enter your credentials to access your career workspace"
                : "Sign up to track skill readiness, role matches, and applications"}
            </p>
          </div>

          {/* Role Tabs (Student vs TPO) */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#0b1411] border border-[#23332a] rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                role === "student"
                  ? "bg-[#d7fb61] text-[#12201b] shadow-md shadow-[#d7fb61]/20 font-bold"
                  : "text-[#a9b8ac] hover:text-white hover:bg-white/5"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student Portal
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("tpo")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                role === "tpo"
                  ? "bg-[#6b78f7] text-white shadow-md shadow-[#6b78f7]/20 font-bold"
                  : "text-[#a9b8ac] hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 className="h-4 w-4" />
              TPO Officer
            </button>
          </div>

          {/* Error Message Notice */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#a9b8ac] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-[#6c7b70]" />
                  <input
                    type="text"
                    required
                    placeholder={role === "student" ? "e.g. Bhuvanesh Kumar" : "e.g. Dr. Rajesh Sharma"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1b2b23] border border-[#2b3c32] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#5a6a60] focus:outline-none focus:border-[#d7fb61] focus:ring-1 focus:ring-[#d7fb61] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#a9b8ac] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#6c7b70]" />
                <input
                  type="email"
                  required
                  placeholder={role === "student" ? "student@university.edu" : "tpo@university.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1b2b23] border border-[#2b3c32] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#5a6a60] focus:outline-none focus:border-[#d7fb61] focus:ring-1 focus:ring-[#d7fb61] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#a9b8ac] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#6c7b70]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1b2b23] border border-[#2b3c32] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#5a6a60] focus:outline-none focus:border-[#d7fb61] focus:ring-1 focus:ring-[#d7fb61] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#6c7b70] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-[10px] text-[#78887d] mt-1">
                  Must be at least 6 characters.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg ${
                role === "student"
                  ? "bg-[#d7fb61] text-[#12201b] shadow-[#d7fb61]/20 hover:bg-[#c9ef4f]"
                  : "bg-[#6b78f7] text-white shadow-[#6b78f7]/20 hover:bg-[#5b68e7]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-[#12201b]/30 border-t-[#12201b] rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login"
                    ? `Sign In as ${role === "student" ? "Student" : "TPO"}`
                    : `Create ${role === "student" ? "Student" : "TPO"} Account`}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Signup Mode */}
          <div className="mt-5 text-center text-xs text-[#a9b8ac]">
            {mode === "login" ? (
              <span>
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage(null);
                  }}
                  className="text-[#d7fb61] hover:underline font-bold"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                  }}
                  className="text-[#d7fb61] hover:underline font-bold"
                >
                  Log In
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-[#23332a]">
            <div className="text-[11px] font-mono text-[#78887d] mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#d7fb61]" /> Demo Quick Fill
              </span>
              <span className="text-[10px] text-[#5c6c61]">Click to auto-fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoStudent}
                className="py-2 px-3 rounded-xl bg-[#1b2b23] border border-[#2b3c32] hover:border-[#d7fb61]/50 text-left transition-all group"
              >
                <div className="font-semibold text-[#d7fb61] text-[11px]">Demo Student</div>
                <div className="text-[9px] text-[#78887d] truncate">aarav.mehta@university.edu</div>
              </button>

              <button
                type="button"
                onClick={fillDemoTPO}
                className="py-2 px-3 rounded-xl bg-[#1b2b23] border border-[#2b3c32] hover:border-[#6b78f7]/50 text-left transition-all group"
              >
                <div className="font-semibold text-[#6b78f7] text-[11px]">Demo TPO</div>
                <div className="text-[9px] text-[#78887d] truncate">tpo@university.edu</div>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 px-6 py-4 text-center text-xs text-[#7c887f] border-t border-[#dce2da]">
        OMEN Institutional Career Intelligence Platform • Connected to Supabase
      </footer>
    </div>
  );
}
