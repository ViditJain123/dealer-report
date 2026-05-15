import "./global.css";

// Weight-specific subpath imports — pulls only the 5 fonts we use, not all 17.
import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import { GeistMono_400Regular } from "@expo-google-fonts/geist-mono/400Regular";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    GeistMono_400Regular,
  });

  // Hold the splash screen until fonts resolve, so no fallback-font flash.
  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View
      onLayout={onLayoutRootView}
      className="flex-1 items-center justify-center gap-8 bg-background p-8"
    >
      <View className="items-center gap-1.5">
        <Text className="font-sans-semibold text-display text-foreground">
          Dealer Report
        </Text>
        <Text className="font-sans text-body text-muted-foreground">
          Design system foundations are ready.
        </Text>
      </View>

      <View className="flex-row flex-wrap items-center justify-center gap-3">
        <View className="rounded-md bg-primary px-4 py-2">
          <Text className="font-sans-medium text-label text-primary-foreground">
            Primary
          </Text>
        </View>
        <View className="rounded-md border border-border bg-card px-4 py-2">
          <Text className="font-sans-medium text-label text-card-foreground">
            Card
          </Text>
        </View>
        <View className="rounded-md bg-secondary px-4 py-2">
          <Text className="font-sans-medium text-label text-secondary-foreground">
            Secondary
          </Text>
        </View>
        <View className="rounded-md bg-destructive px-4 py-2">
          <Text className="font-sans-medium text-label text-destructive-foreground">
            Destructive
          </Text>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
