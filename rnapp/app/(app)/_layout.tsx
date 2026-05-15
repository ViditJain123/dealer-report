import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

import { useAuth } from "@/lib/auth/context";

/** Stack for the authenticated routes; bounces signed-out dealers to login. */
export default function AppLayout() {
  const { status } = useAuth();

  if (status === "loading") {
    return <View className="flex-1 bg-background" />;
  }
  if (status === "unauthenticated") {
    return <Redirect href="/login" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
