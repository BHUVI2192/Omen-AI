import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  applyToJob,
  createOpportunity,
  enrollCourse,
  getApplications,
  getCourses,
  getDashboard,
  getGaps,
  getJobs,
  getNotifications,
  getProjects,
  getRole,
  getRoles,
  getSkills,
  getTpoDashboard,
  markNotificationRead,
  saveRole,
  simulateWhatIf,
  submitProject,
  updateApplicationStatus,
  evaluateJobApplication,
  submitCourseProject,
  getPendingProjectSubmissions,
  verifyStudentProject,
  updateResume,
  updateStudentProfile,
  editOpportunity,
  deleteOpportunity,
  getPlacementFunnel,
  processOutcomeCsv,
  getBootcamps,
  voteBootcampWorkshop,
  createBootcamp,
  getMockInterviewQuestions,
  evaluateMockInterviewAnswer,
  refreshMockInterviewQuestions,
} from "./services/omen-data";

import { sdk } from "./_core/sdk";
import { loginUser, signupUser } from "./services/auth-service";
import { saveStudentProfile } from "./services/supabase-service";

import { getMarketIntelligence } from "./services/market-trends";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
          role: z.enum(["student", "tpo"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await loginUser(input);
        const token = await sdk.createSessionToken(user.openId, { name: user.name });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
        return { success: true, user, redirectUrl: user.redirectUrl };
      }),
    signup: publicProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          password: z.string().min(6),
          role: z.enum(["student", "tpo"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await signupUser(input);
        const token = await sdk.createSessionToken(user.openId, { name: user.name });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
        const redirectUrl = user.role === "student" ? "/onboarding" : "/tpo";
        return { success: true, user, redirectUrl };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, cookieOptions);
      return { success: true } as const;
    }),
  }),
  omen: router({
    dashboard: publicProcedure.query((opts) => getDashboard(opts.ctx.user || undefined)),
    marketTrends: publicProcedure.query(() => getMarketIntelligence()),
    skills: publicProcedure.query(() => getSkills()),
    roles: publicProcedure.query(() => getRoles()),
    role: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => getRole(input.id)),
    gaps: publicProcedure.query(() => getGaps()),
    courses: publicProcedure.query(() => getCourses()),
    projects: publicProcedure.query(() => getProjects()),
    jobs: publicProcedure.query(() => getJobs()),
    applications: publicProcedure.query(() => getApplications()),
    notifications: publicProcedure.query((opts) => getNotifications(opts.ctx.user?.role)),
    tpoDashboard: publicProcedure.query(async (opts) => await getTpoDashboard(opts.ctx.user || undefined)),
    whatIf: publicProcedure.input(z.object({ skillName: z.string().min(1), current: z.number().min(0).max(100), target: z.number().min(0).max(100) })).query(({ input }) => simulateWhatIf(input.skillName, input.current, input.target)),
    applyToJob: publicProcedure.input(z.object({ jobId: z.string() })).mutation(({ input, ctx }) => applyToJob(input.jobId, ctx.user || undefined)),
    saveRole: publicProcedure.input(z.object({ roleId: z.string() })).mutation(({ input }) => saveRole(input.roleId)),
    enrollCourse: publicProcedure.input(z.object({ courseId: z.string() })).mutation(({ input }) => enrollCourse(input.courseId)),
    submitProject: publicProcedure
      .input(
        z.object({
          title: z.string().min(2),
          description: z.string().min(10),
          githubUrl: z.string().optional(),
          liveUrl: z.string().optional(),
          skills: z.array(z.string()).optional(),
        })
      )
      .mutation(({ input, ctx }) => submitProject(input, ctx.user || undefined)),
    markNotificationRead: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => markNotificationRead(input.id)),
    createOpportunity: publicProcedure.input(z.object({ company: z.string().min(2), title: z.string().min(2), location: z.string().min(2), ctc: z.string().min(2), deadline: z.string(), requiredSkills: z.array(z.string()).min(1), description: z.string().optional() })).mutation(({ input }) => createOpportunity(input)),
    updateApplicationStatus: publicProcedure.input(z.object({ applicationId: z.string(), status: z.string() })).mutation(({ input }) => updateApplicationStatus(input.applicationId, input.status)),
    evaluateJobApplication: publicProcedure.input(z.object({ jobId: z.string() })).query(({ input }) => evaluateJobApplication(input.jobId)),
    submitCourseProject: publicProcedure.input(z.object({ courseId: z.string(), projectTitle: z.string(), githubUrl: z.string(), liveUrl: z.string().optional(), notes: z.string().optional() })).mutation(({ input, ctx }) => submitCourseProject(input, ctx.user || undefined)),
    getPendingProjectSubmissions: publicProcedure.query(() => getPendingProjectSubmissions()),
    verifyStudentProject: publicProcedure.input(z.object({ submissionId: z.string(), approved: z.boolean(), pointsToAward: z.number().optional() })).mutation(({ input }) => verifyStudentProject(input.submissionId, input.approved, input.pointsToAward)),
    updateResume: publicProcedure.input(z.object({ resumeUrl: z.string(), filename: z.string().optional() })).mutation(({ input }) => updateResume(input.resumeUrl, input.filename)),
    saveStudentProfile: publicProcedure
      .input(
        z.object({
          department: z.string(),
          branch: z.string(),
          semester: z.number(),
          cgpa: z.number(),
          backlogs: z.number(),
          targetRoles: z.array(z.string()),
          skills: z.array(z.object({ name: z.string(), proficiency: z.number() })),
          resumeUrl: z.string().optional(),
          githubUrl: z.string().optional(),
          linkedinUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.openId || "student-01";
        const profile = await saveStudentProfile({
          userId,
          ...input,
          completedOnboarding: true,
        });
        updateStudentProfile(input);
        return { success: true, profile };
      }),
    editOpportunity: publicProcedure
      .input(
        z.object({
          id: z.string(),
          company: z.string().optional(),
          title: z.string().optional(),
          location: z.string().optional(),
          ctc: z.string().optional(),
          deadline: z.string().optional(),
          requiredSkills: z.array(z.string()).optional(),
          status: z.string().optional(),
        })
      )
      .mutation(({ input }) => editOpportunity(input)),
    deleteOpportunity: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => deleteOpportunity(input.id)),
    placementFunnel: publicProcedure.query(() => getPlacementFunnel()),
    processOutcomeCsv: publicProcedure
      .input(z.object({ csvText: z.string(), jobId: z.string().optional() }))
      .mutation(({ input }) => processOutcomeCsv(input.csvText, input.jobId)),
    bootcamps: publicProcedure.query(() => getBootcamps()),
    voteBootcampWorkshop: publicProcedure
      .input(z.object({ bootcampId: z.string(), optionId: z.string() }))
      .mutation(({ input }) => voteBootcampWorkshop(input.bootcampId, input.optionId)),
    createBootcamp: publicProcedure
      .input(
        z.object({
          title: z.string().min(2),
          description: z.string().min(5),
          category: z.string().optional(),
          type: z.enum(["Output-Driven", "Demand-Driven"]),
          workshopOptions: z.array(z.string()).optional(),
        })
      )
      .mutation(({ input }) => createBootcamp(input)),
    mockInterviewQuestions: publicProcedure.query(() => getMockInterviewQuestions()),
    evaluateMockInterviewAnswer: publicProcedure.input(z.object({ questionId: z.string(), answer: z.string().min(2) })).mutation(({ input }) => evaluateMockInterviewAnswer(input.questionId, input.answer)),
    refreshMockInterviewQuestions: publicProcedure.mutation(() => refreshMockInterviewQuestions()),
  }),
});

export type AppRouter = typeof appRouter;
