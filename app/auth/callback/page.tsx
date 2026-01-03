import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { CallbackClient } from "./callback-client";

export default async function AuthCallbackPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return <CallbackClient redirectTo="/login" />;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isOnboarded: true },
  });

  if (user?.isOnboarded) {
    return <CallbackClient redirectTo="/dashboard" />;
  }

  return <CallbackClient redirectTo="/onboarding/username" />;
}

