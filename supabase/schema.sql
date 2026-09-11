-- OMEN Student OS & TPO Placement Intelligence — Supabase Relational Database Schema

-- 1. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'tpo')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    department TEXT DEFAULT 'Computer Science & Engineering',
    branch TEXT DEFAULT 'CSE',
    semester INTEGER DEFAULT 7,
    cgpa NUMERIC(4,2) DEFAULT 8.40,
    backlogs INTEGER DEFAULT 0,
    target_roles JSONB DEFAULT '["Full Stack Engineer", "Data Analyst"]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    resume_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Job Opportunities Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    ctc TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    required_skills JSONB DEFAULT '[]'::jsonb,
    min_cgpa NUMERIC(4,2) DEFAULT 7.00,
    allowed_branches JSONB DEFAULT '["CSE", "IT"]'::jsonb,
    max_backlogs INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Job Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    resume_url TEXT,
    match_score INTEGER DEFAULT 0,
    matched_skills JSONB DEFAULT '[]'::jsonb,
    missing_skills JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Applied',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow read/write for authenticated service role & public queries
CREATE POLICY "Allow service role full access on profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow service role full access on student_profiles" ON public.student_profiles FOR ALL USING (true);
CREATE POLICY "Allow public read access on jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Allow service role full access on applications" ON public.applications FOR ALL USING (true);
