import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/lib/auth/context";

/** Stack for the signed-out routes; bounces signed-in dealers to the app. */
export default function AuthLayout() {
  const { status } = useAuth();

  if (status === "authenticated") {
    return <Redirect href="/home" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
