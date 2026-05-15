import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

/** Full-screen container with safe-area insets and the app background. */
export function Screen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SafeAreaView className={cn("flex-1 bg-background", className)}>
      {children}
    </SafeAreaView>
  );
}
