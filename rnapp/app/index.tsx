import { Redirect } from "expo-router";
import { View } from "react-native";

import { useAuth } from "@/lib/auth/context";

/** Entry route — routes the dealer to the app or the sign-in screen. */
export default function Index() {
  const { status } = useAuth();

  if (status === "loading") {
    return <View className="flex-1 bg-background" />;
  }
  if (status === "authenticated") {
    return <Redirect href="/home" />;
  }
  return <Redirect href="/login" />;
}
