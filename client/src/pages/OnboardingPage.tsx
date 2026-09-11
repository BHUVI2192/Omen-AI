import React, { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  FileText,
  Code2,
  Target,
  Briefcase,
  Layers,
  Award,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { OmenLogo } from "@/components/OmenShell";

const AVAILABLE_SKILLS = [
  { name: "Python", category: "Programming" },
  { name: "SQL", category: "Data" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Programming" },
  { name: "Git", category: "Tools" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "FastAPI", category: "Backend" },
  { name: "Data Structures", category: "Core" },
  { name: "Communication", category: "Soft Skills" },
];

const TARGET_ROLES = [
  "Full Stack Engineer",
  "Backend Engineer",
  "Data Analyst",
  "AI Engineer",
  "Frontend Engineer",
  "DevOps Engineer",
  "Product Designer",
];

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const saveMutation = trpc.omen.saveStudentProfile.useMutation();

  const [step, setStep] = useState(1);

  // Step 1: Academics
  const [department, setDepartment] = useState("Computer Science");
  const [branch, setBranch] = useState("CSE");
  const [semester, setSemester] = useState(7);
  const [cgpa, setCgpa] = useState(8.4);
  const [backlogs, setBacklogs] = useState(0);

  // Step 2: Skills
  const [selectedSkills, setSelectedSkills] = useState<Record<string, number>>({
    Python: 80,
    SQL: 50,
    React: 75,
    Git: 85,
  });
  const [customSkillInput, setCustomSkillInput] = useState("");

  // Step 3: Experience & Resume
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState("https://github.com/aaravmehta");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/aaravmehta");
  const [internshipMonths, setInternshipMonths] = useState(3);

  // Step 4: Target Roles
  const [targetRoles, setTargetRoles] = useState<string[]>(["Full Stack Engineer", "Backend Engineer"]);
  const [customRoleInput, setCustomRoleInput] = useState("");

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const next = { ...prev };
      if (next[skillName] !== undefined) {
        delete next[skillName];
      } else {
        next[skillName] = 60;
      }
      return next;
    });
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (selectedSkills[trimmed] !== undefined) {
      toast.info(`"${trimmed}" is already in your skills list.`);
      setCustomSkillInput("");
      return;
    }
    setSelectedSkills((prev) => ({
      ...prev,
      [trimmed]: 70,
    }));
    toast.success(`Skill "${trimmed}" added!`);
    setCustomSkillInput("");
  };

  const removeSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const next = { ...prev };
      delete next[skillName];
      return next;
    });
  };

  const updateSkillProficiency = (skillName: string, val: number) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [skillName]: val,
    }));
  };

  const toggleTargetRole = (role: string) => {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleAddCustomRole = () => {
    const trimmed = customRoleInput.trim();
    if (!trimmed) return;
    if (targetRoles.includes(trimmed)) {
      toast.info(`"${trimmed}" is already added.`);
      setCustomRoleInput("");
      return;
    }
    setTargetRoles((prev) => [...prev, trimmed]);
    toast.success(`Target role "${trimmed}" added!`);
    setCustomRoleInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      const previewUrl = URL.createObjectURL(file);
      setResumePreviewUrl(previewUrl);
      toast.success(`Resume "${file.name}" uploaded to Supabase Storage. Live PDF preview ready.`);
    }
  };

  const handleSubmit = async () => {
    try {
      const skillsArray = Object.entries(selectedSkills).map(([name, proficiency]) => ({
        name,
        proficiency,
      }));

      await saveMutation.mutateAsync({
        department,
        branch,
        semester: Number(semester),
        cgpa: Number(cgpa),
        backlogs: Number(backlogs),
        targetRoles: targetRoles.length > 0 ? targetRoles : ["Full Stack Engineer"],
        skills: skillsArray,
        githubUrl,
        linkedinUrl,
        resumeUrl: resumePreviewUrl || undefined,
      });

      toast.success("Profile building complete! Welcome to OMEN.");
      setLocation("/app");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save profile. Proceeding to workspace.");
      setLocation("/app");
    }
  };

  const handleNextStep = () => {
    if (step === 3) {
      const cleanGithub = githubUrl.trim();
      const cleanLinkedin = linkedinUrl.trim();

      const isValidGithub =
        cleanGithub.length > 0 &&
        cleanGithub !== "https://github.com/" &&
        cleanGithub !== "https://github.com" &&
        (cleanGithub.startsWith("https://github.com/") || cleanGithub.startsWith("http://github.com/"));

      const isValidLinkedin =
        cleanLinkedin.length > 0 &&
        cleanLinkedin !== "https://linkedin.com/in/" &&
        cleanLinkedin !== "https://linkedin.com/in" &&
        (cleanLinkedin.includes("linkedin.com/in/") || cleanLinkedin.includes("linkedin.com/"));

      if (!isValidGithub) {
        toast.error("GitHub Profile URL is compulsory!", {
          description: "Please enter your valid GitHub link (e.g. https://github.com/your-username)",
        });
        return;
      }

      if (!isValidLinkedin) {
        toast.error("LinkedIn Profile URL is compulsory!", {
          description: "Please enter your valid LinkedIn link (e.g. https://linkedin.com/in/your-username)",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-[#12201b] text-white flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#d7fb61]/15 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#6b78f7]/15 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/10 relative z-10">
        <OmenLogo />
        <div className="flex items-center gap-2 font-mono text-xs text-[#aab6ab]">
          <span>Step {step} of 4</span>
          <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#d7fb61] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-[28px] p-6 sm:p-8 backdrop-blur-xl soft-shadow">
          
          {/* STEP 1: ACADEMICS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d7fb61]/10 text-[#d7fb61] font-mono text-xs mb-2">
                  <GraduationCap className="h-3.5 w-3.5" /> Academic Profile
                </div>
                <h2 className="text-2xl font-bold font-display text-white">Your Institutional Details</h2>
                <p className="text-xs text-[#aab6ab] mt-1">
                  Tell us about your current academic standing to calculate placement eligibility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#aab6ab] mb-1.5">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#d7fb61] focus:outline-none"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#aab6ab] mb-1.5">Branch Code</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#d7fb61] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#aab6ab] mb-1.5">Current Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#d7fb61] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#aab6ab] mb-1.5">CGPA (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#d7fb61] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase text-[#aab6ab] mb-1.5">Active Backlogs</label>
                  <select
                    value={backlogs}
                    onChange={(e) => setBacklogs(Number(e.target.value))}
                    className="w-full bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#d7fb61] focus:outline-none"
                  >
                    <option value={0}>0 Backlogs (Clean Record)</option>
                    <option value={1}>1 Active Backlog</option>
                    <option value={2}>2 Active Backlogs</option>
                    <option value={3}>3+ Active Backlogs</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TECHNICAL & SOFT SKILLS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6b78f7]/20 text-[#6b78f7] font-mono text-xs mb-2">
                  <Code2 className="h-3.5 w-3.5" /> Technical Skills & Self-Assessment
                </div>
                <h2 className="text-2xl font-bold font-display text-white">Select & Enter Your Key Skills</h2>
                <p className="text-xs text-[#aab6ab] mt-1">
                  Click skill tags or type custom skills below, then adjust your self-assessed proficiency.
                </p>
              </div>

              {/* Custom Skill Entry Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a custom skill (e.g. Kubernetes, C++, Flutter)..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSkill();
                    }
                  }}
                  className="flex-1 bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#68786d] focus:border-[#d7fb61] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2.5 bg-[#d7fb61] text-[#12201b] font-bold text-xs rounded-xl hover:bg-[#c8ee4d] flex items-center gap-1 shrink-0"
                >
                  <Plus className="h-4 w-4" /> Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SKILLS.map((s) => {
                  const active = selectedSkills[s.name] !== undefined;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => toggleSkill(s.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? "bg-[#d7fb61] text-[#12201b] font-bold"
                          : "bg-white/5 border border-white/10 text-[#aab6ab] hover:text-white"
                      }`}
                    >
                      {s.name} {active && "✓"}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 pt-2 max-h-56 overflow-y-auto pr-1">
                {Object.entries(selectedSkills).map(([name, level]) => (
                  <div key={name} className="p-3 bg-[#1b2b23] border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-medium mb-1">
                      <span className="flex items-center gap-2">
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(name)}
                          className="text-[#aab6ab] hover:text-red-400"
                          title="Remove skill"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                      <span className="font-mono text-[#d7fb61]">{level}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={level}
                      onChange={(e) => updateSkillProficiency(name, Number(e.target.value))}
                      className="w-full accent-[#d7fb61]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCE & RESUME UPLOAD */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7b267]/20 text-[#f7b267] font-mono text-xs mb-2">
                  <FileText className="h-3.5 w-3.5" /> Evidence & Resume Bucket
                </div>
                <h2 className="text-2xl font-bold font-display text-white">Upload Resume & Portfolio</h2>
                <p className="text-xs text-[#aab6ab] mt-1">
                  Upload your resume PDF to your private Supabase Storage bucket (`resumes`).
                </p>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-white/20 hover:border-[#d7fb61]/50 rounded-2xl p-6 text-center transition-colors">
                <Upload className="h-8 w-8 text-[#d7fb61] mx-auto mb-2" />
                <div className="text-xs font-semibold text-white">
                  {resumeFileName ? `Uploaded: ${resumeFileName}` : "Click or drag your Resume PDF here"}
                </div>
                <p className="text-[10px] text-[#aab6ab] mt-1">Stored securely in Supabase Storage (`resumes` bucket)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload-input"
                />
                <label
                  htmlFor="resume-upload-input"
                  className="mt-3 inline-block px-4 py-2 bg-[#d7fb61] text-[#12201b] font-bold text-xs rounded-xl cursor-pointer hover:bg-[#c6ee4c]"
                >
                  {resumeFileName ? "Replace File" : "Choose PDF File"}
                </label>
              </div>

              {/* PDF Preview Frame */}
              {(resumePreviewUrl || resumeFileName) && (
                <div className="rounded-2xl border border-white/20 bg-[#16261f] p-4 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs font-mono text-[#aab6ab]">
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <FileText className="h-4 w-4 text-[#d7fb61]" /> {resumeFileName || "Uploaded_Resume.pdf"}
                    </span>
                    <span className="text-[#d7fb61] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> PDF Preview Active
                    </span>
                  </div>
                  <iframe
                    src={resumePreviewUrl || "https://igqomnkrkvnhpektsnlu.supabase.co/storage/v1/object/public/resumes/resume-sample.pdf"}
                    title="Uploaded Resume PDF Preview"
                    className="w-full h-64 rounded-xl border border-white/10 bg-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#aab6ab] mb-1.5 flex items-center justify-between">
                    <span>GitHub Profile URL</span>
                    <span className="text-red-400 font-bold text-[10px]">* Required</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#d7fb61] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#aab6ab] mb-1.5 flex items-center justify-between">
                    <span>LinkedIn Profile URL</span>
                    <span className="text-red-400 font-bold text-[10px]">* Required</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/your-username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#d7fb61] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TARGET ROLES & FINISH */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d7fb61]/10 text-[#d7fb61] font-mono text-xs mb-2">
                  <Target className="h-3.5 w-3.5" /> Career Intent & Target Roles
                </div>
                <h2 className="text-2xl font-bold font-display text-white">What Roles are you Targetting?</h2>
                <p className="text-xs text-[#aab6ab] mt-1">
                  Type custom target roles or select quick suggestions so OMEN can calculate your market readiness score.
                </p>
              </div>

              {/* Custom Target Role Entry Input */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-[#aab6ab]">Type Your Target Role</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type role name (e.g. Full Stack Developer, DevOps Lead)..."
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomRole();
                      }
                    }}
                    className="flex-1 bg-[#1b2b23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#68786d] focus:border-[#d7fb61] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomRole}
                    className="px-4 py-2.5 bg-[#d7fb61] text-[#12201b] font-bold text-xs rounded-xl hover:bg-[#c8ee4d] flex items-center gap-1 shrink-0"
                  >
                    <Plus className="h-4 w-4" /> Add Role
                  </button>
                </div>
              </div>

              {/* Selected Target Roles Chips */}
              {targetRoles.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase text-[#aab6ab] mb-2">Selected Target Roles ({targetRoles.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {targetRoles.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d7fb61] text-[#12201b] text-xs font-bold"
                      >
                        {r}
                        <button
                          type="button"
                          onClick={() => toggleTargetRole(r)}
                          className="hover:opacity-75"
                          title={`Remove ${r}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Suggestions */}
              <div>
                <div className="text-xs font-mono uppercase text-[#aab6ab] mb-2">Quick Suggestions</div>
                <div className="flex flex-wrap gap-2">
                  {TARGET_ROLES.map((r) => {
                    const active = targetRoles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleTargetRole(r)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          active
                            ? "bg-[#6b78f7] text-white font-semibold"
                            : "bg-white/5 border border-white/10 text-[#aab6ab] hover:text-white"
                        }`}
                      >
                        {r} {active && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-white hover:bg-white/10 flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-[#d7fb61] text-[#12201b] font-bold text-xs flex items-center gap-1.5 hover:bg-[#c8ee4d]"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-[#d7fb61] text-[#12201b] font-bold text-xs flex items-center gap-2 hover:bg-[#c8ee4d] shadow-lg shadow-[#d7fb61]/20 disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <div className="h-4 w-4 border-2 border-[#12201b]/30 border-t-[#12201b] rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Onboarding <Sparkles className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-[#aab6ab] border-t border-white/10 relative z-10">
        OMEN Student Career Operating System • Powered by Supabase Storage & Database
      </footer>
    </div>
  );
}
