import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // Upsert user profile from Google / OAuth metadata
      const profileTable = supabase.from("profiles") as unknown as {
        upsert: (values: Record<string, unknown>) => Promise<{ error: Error | null }>;
      };

      await profileTable.upsert({
        id: data.user.id,
        full_name:
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "Pengguna Safara",
        email: data.user.email || "",
        avatar_url:
          data.user.user_metadata?.avatar_url ||
          data.user.user_metadata?.picture ||
          null,
        kyc_status: "unverified",
      });

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // URL to redirect to after sign in failure
  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}
