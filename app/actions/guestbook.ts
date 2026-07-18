"use server";

import { createSupabaseServerClient } from "@/lib/supabase";

export type GuestbookMessage = {
  id: string;
  authorName: string;
  location: string | null;
  message: string;
  createdAt: string;
};

export type GuestbookPayload = {
  authorName: string;
  location?: string;
  message: string;
};

export type GuestbookResult =
  | { ok: true; entry: GuestbookMessage }
  | { ok: false; error: string };

function mapRow(row: {
  id: string;
  author_name: string;
  location: string | null;
  message: string;
  created_at: string;
}): GuestbookMessage {
  return {
    id: row.id,
    authorName: row.author_name,
    location: row.location,
    message: row.message,
    createdAt: row.created_at,
  };
}

function friendlyNetworkError(error: unknown) {
  const text = error instanceof Error ? error.message : String(error);
  if (/fetch failed|network|ECONN|ETIMEDOUT|ENOTFOUND/i.test(text)) {
    return "Couldn’t reach the guestbook service. Please check your connection and try again.";
  }
  return text || "Unable to save your message right now.";
}

async function withRetry<T>(operation: () => Promise<T>, attempts = 2): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : "";
      const retryable = /fetch failed|network|ECONN|ETIMEDOUT/i.test(message);
      if (!retryable || attempt === attempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }

  throw lastError;
}

export async function getGuestbookMessages(): Promise<GuestbookMessage[]> {
  try {
    const data = await withRetry(async () => {
      const supabase = createSupabaseServerClient();
      const result = await supabase
        .from("guestbook_messages")
        .select("id, author_name, location, message, created_at")
        .order("created_at", { ascending: false })
        .limit(60);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data ?? [];
    });

    return data.map(mapRow);
  } catch {
    return [];
  }
}

export async function submitGuestbookMessage(
  payload: GuestbookPayload,
): Promise<GuestbookResult> {
  const authorName = payload.authorName.trim();
  const location = payload.location?.trim() || null;
  const message = payload.message.trim();

  if (!authorName) {
    return { ok: false, error: "Please enter your name." };
  }

  if (message.length < 8) {
    return { ok: false, error: "Please write a short message for Angela." };
  }

  if (message.length > 600) {
    return { ok: false, error: "Please keep your message under 600 characters." };
  }

  try {
    const data = await withRetry(async () => {
      const supabase = createSupabaseServerClient();
      const result = await supabase
        .from("guestbook_messages")
        .insert({
          author_name: authorName,
          location,
          message,
        })
        .select("id, author_name, location, message, created_at")
        .single();

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (!result.data) {
        throw new Error("Unable to save your message.");
      }

      return result.data;
    });

    return { ok: true, entry: mapRow(data) };
  } catch (error) {
    return { ok: false, error: friendlyNetworkError(error) };
  }
}
