import { TRPCError } from "@trpc/server";
import { supabase } from "./supabase-client";

export type UserRole = "student" | "tpo";

export type AuthUser = {
  openId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
};

// In-memory cache for fast session verification & offline test fallback
const usersStore: Map<string, AuthUser> = new Map([
  [
    "aarav.mehta@university.edu",
    {
      openId: "student_01_openid",
      name: "Aarav Mehta",
      email: "aarav.mehta@university.edu",
      passwordHash: "password123",
      role: "student",
      createdAt: new Date().toISOString(),
    },
  ],
  [
    "tpo@university.edu",
    {
      openId: "tpo_01_openid",
      name: "Dr. Rajesh Sharma (TPO)",
      email: "tpo@university.edu",
      passwordHash: "admin123",
      role: "tpo",
      createdAt: new Date().toISOString(),
    },
  ],
]);

// Map openId -> email for fast lookup
const openIdMap: Map<string, string> = new Map([
  ["student_01_openid", "aarav.mehta@university.edu"],
  ["tpo_01_openid", "tpo@university.edu"],
]);

export async function loginUser({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role?: UserRole;
}) {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Try Supabase Auth DB sign-in
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (data?.user && !error) {
      const userMeta = data.user.user_metadata || {};
      const userRole: UserRole = (userMeta.role as UserRole) || (normalizedEmail.includes("tpo") ? "tpo" : "student");
      const userName = userMeta.name || (userRole === "tpo" ? "TPO Officer" : normalizedEmail.split("@")[0]);
      const openId = data.user.id;

      if (role && userRole !== role) {
        const targetTab = userRole === "tpo" ? "TPO Login" : "Student Login";
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `This email is registered as a ${userRole.toUpperCase()}. Please use the ${targetTab} tab.`,
        });
      }

      const cachedUser: AuthUser = {
        openId,
        name: userName,
        email: normalizedEmail,
        passwordHash: password,
        role: userRole,
        createdAt: data.user.created_at || new Date().toISOString(),
      };

      usersStore.set(normalizedEmail, cachedUser);
      openIdMap.set(openId, normalizedEmail);

      const redirectUrl = userRole === "tpo" ? "/tpo" : "/app";

      return {
        openId,
        name: userName,
        email: normalizedEmail,
        role: userRole,
        redirectUrl,
      };
    }
  } catch (err) {
    if (err instanceof TRPCError) throw err;
    console.warn("[Auth] Supabase signIn fallback notice:", String(err));
  }

  // 2. Fallback to pre-seeded / local database cache
  const localUser = usersStore.get(normalizedEmail);
  if (!localUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No account found with this email. Please sign up.",
    });
  }

  if (localUser.passwordHash !== password) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Incorrect password. Please try again.",
    });
  }

  if (role && localUser.role !== role) {
    const targetTab = localUser.role === "tpo" ? "TPO Login" : "Student Login";
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `This email is registered as a ${localUser.role.toUpperCase()}. Please use the ${targetTab} tab.`,
    });
  }

  const redirectUrl = localUser.role === "tpo" ? "/tpo" : "/app";

  return {
    openId: localUser.openId,
    name: localUser.name,
    email: localUser.email,
    role: localUser.role,
    redirectUrl,
  };
}

export async function signupUser({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  // 1. Check if user already exists locally
  if (usersStore.has(normalizedEmail)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "An account with this email already exists. Please log in.",
    });
  }

  let openId = `${role}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // 2. Persist to Supabase Database Auth
  try {
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        name: trimmedName,
        role,
      },
    });

    if (createError) {
      if (createError.message?.toLowerCase().includes("already registered") || createError.status === 422) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists in Supabase. Please log in.",
        });
      }
      console.warn("[Auth] Supabase createUser notice:", createError.message);
    } else if (createData?.user) {
      openId = createData.user.id;
    }
  } catch (err) {
    if (err instanceof TRPCError) throw err;
    console.warn("[Auth] Supabase signup fallback notice:", String(err));
  }

  // 3. Store in active application database session
  const newUser: AuthUser = {
    openId,
    name: trimmedName,
    email: normalizedEmail,
    passwordHash: password,
    role,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(normalizedEmail, newUser);
  openIdMap.set(openId, normalizedEmail);

  // 4. Also try saving profile into Supabase profiles table
  try {
    await supabase.from("profiles").upsert({
      id: openId,
      email: normalizedEmail,
      full_name: trimmedName,
      role,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    // Graceful fallback if table is not yet created
  }

  const redirectUrl = role === "tpo" ? "/tpo" : "/app";

  return {
    openId,
    name: trimmedName,
    email: normalizedEmail,
    role,
    redirectUrl,
  };
}

export function getUserByOpenId(openId: string): AuthUser | undefined {
  const email = openIdMap.get(openId);
  if (email) {
    const user = usersStore.get(email);
    if (user) return user;
  }
  return Array.from(usersStore.values()).find((u) => u.openId === openId);
}
