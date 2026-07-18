"use server";

import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

function isAllowedAdminEmail(email: string | undefined) {
  if (!email) return false;

  const allowlist = process.env.ADMIN_EMAILS?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!allowlist?.length) return true;
  return allowlist.includes(email.toLowerCase());
}

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; error: string };

export async function signInAdmin(
  email: string,
  password: string,
): Promise<AdminAuthResult> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return { ok: false, error: "Enter your email and password." };
  }

  if (!isAllowedAdminEmail(trimmedEmail)) {
    return { ok: false, error: "This account is not authorised for admin access." };
  }

  const supabase = await createSupabaseAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password: trimmedPassword,
  });

  if (error || !data.user) {
    return { ok: false, error: "Invalid email or password." };
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account is not authorised for admin access." };
  }

  return { ok: true };
}

export async function signOutAdmin() {
  const supabase = await createSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function requireAdminUser() {
  const supabase = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  return user;
}
