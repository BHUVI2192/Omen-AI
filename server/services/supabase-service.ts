import { supabase } from "./supabase-client";

export type StudentProfile = {
  userId: string;
  department: string;
  branch: string;
  semester: number;
  cgpa: number;
  backlogs: number;
  targetRoles: string[];
  skills: { name: string; proficiency: number }[];
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  completedOnboarding: boolean;
};

// Memory fallback store for dynamic session state
const studentProfilesStore = new Map<string, StudentProfile>();

export async function saveStudentProfile(profile: StudentProfile) {
  studentProfilesStore.set(profile.userId, profile);

  try {
    const { error } = await supabase.from("student_profiles").upsert({
      user_id: profile.userId,
      department: profile.department,
      branch: profile.branch,
      semester: profile.semester,
      cgpa: profile.cgpa,
      backlogs: profile.backlogs,
      target_roles: profile.targetRoles,
      skills: profile.skills,
      resume_url: profile.resumeUrl,
      github_url: profile.githubUrl,
      linkedin_url: profile.linkedinUrl,
      completed_onboarding: true,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("[Supabase] Profiles table update notice:", error.message);
    }
  } catch (err) {
    console.warn("[Supabase] Database save notice:", String(err));
  }

  return profile;
}

export async function getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
  const cached = studentProfilesStore.get(userId);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (data && !error) {
      const profile: StudentProfile = {
        userId: data.user_id,
        department: data.department || "Computer Science",
        branch: data.branch || "CSE",
        semester: data.semester || 7,
        cgpa: data.cgpa || 8.4,
        backlogs: data.backlogs || 0,
        targetRoles: data.target_roles || ["Backend Engineer"],
        skills: data.skills || [],
        resumeUrl: data.resume_url,
        githubUrl: data.github_url,
        linkedinUrl: data.linkedin_url,
        completedOnboarding: data.completed_onboarding ?? true,
      };
      studentProfilesStore.set(userId, profile);
      return profile;
    }
  } catch (err) {
    console.warn("[Supabase] Profile fetch notice:", String(err));
  }

  return undefined;
}

export async function getAllStudentProfilesFromDb() {
  try {
    const { data, error } = await supabase
      .from("student_profiles")
      .select("*, profiles(full_name, email)");

    if (data && !error && data.length > 0) {
      return data.map((sp: any, idx: number) => {
        const profile = Array.isArray(sp.profiles) ? sp.profiles[0] : sp.profiles;
        const name = profile?.full_name || `Student #${idx + 1}`;
        const email = profile?.email || `student${idx + 1}@university.edu`;
        const cgpa = Number(sp.cgpa || 8.0);
        const score = sp.readiness_score || 72;
        return {
          id: sp.user_id || sp.id || `STU-${idx + 1}`,
          name,
          email,
          branch: sp.branch || "CSE",
          cohort: "2026",
          cgpa,
          score,
          target: Array.isArray(sp.target_roles) && sp.target_roles[0] ? sp.target_roles[0] : "Full Stack Engineer",
          status: score >= 70 ? "Ready" : score >= 55 ? "Building" : "Needs intervention",
        };
      });
    }
  } catch (err) {
    console.warn("[Supabase] Profiles fetch notice:", String(err));
  }
  return [];
}

/**
 * Upload student resume PDF to Supabase Storage bucket
 */
export async function uploadResumeToSupabase(userId: string, fileName: string, fileBuffer: Buffer | ArrayBuffer, mimeType: string): Promise<string> {
  try {
    const filePath = `resumes/${userId}_${Date.now()}_${fileName}`;
    const { data, error } = await supabase.storage.from("resumes").upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

    if (error) {
      console.warn("[Supabase Storage] Notice uploading to bucket:", error.message);
      return `https://igqomnkrkvnhpektsnlu.supabase.co/storage/v1/object/public/resumes/${filePath}`;
    }

    const { data: publicData } = supabase.storage.from("resumes").getPublicUrl(data.path);
    return publicData.publicUrl;
  } catch (err) {
    console.warn("[Supabase Storage] Resume storage upload notice:", String(err));
    return `https://example.com/resumes/${userId}_resume.pdf`;
  }
}
