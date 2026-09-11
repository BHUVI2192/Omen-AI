import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type CookieSetCall = {
  name: string;
  val: string;
  options: Record<string, unknown>;
};

function createMockContext() {
  const setCookies: CookieSetCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, val: string, options: Record<string, unknown>) => {
        setCookies.push({ name, val, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, setCookies };
}

describe("auth.login and auth.signup", () => {
  it("allows student login with valid credentials and sets session cookie", async () => {
    const { ctx, setCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      email: "aarav.mehta@university.edu",
      password: "password123",
      role: "student",
    });

    expect(result.success).toBe(true);
    expect(result.user.role).toBe("student");
    expect(result.redirectUrl).toBe("/app");
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe(COOKIE_NAME);
    expect(setCookies[0]?.val).toBeDefined();
  });

  it("allows TPO login with valid credentials and redirects to /tpo", async () => {
    const { ctx, setCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      email: "tpo@university.edu",
      password: "admin123",
      role: "tpo",
    });

    expect(result.success).toBe(true);
    expect(result.user.role).toBe("tpo");
    expect(result.redirectUrl).toBe("/tpo");
    expect(setCookies).toHaveLength(1);
  });

  it("rejects login with invalid password", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: "aarav.mehta@university.edu",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Incorrect password");
  });

  it("allows new user signup as student and logs them in", async () => {
    const { ctx, setCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const newEmail = `test.student.${Date.now()}@university.edu`;
    const result = await caller.auth.signup({
      name: "New Student",
      email: newEmail,
      password: "newpassword123",
      role: "student",
    });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe(newEmail);
    expect(result.user.role).toBe("student");
    expect(result.redirectUrl).toBe("/onboarding");
    expect(setCookies).toHaveLength(1);
  });
});
