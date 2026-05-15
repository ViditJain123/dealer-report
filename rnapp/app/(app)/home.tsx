import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { useAuth } from "@/lib/auth/context";

/** Placeholder authenticated screen — confirms the dealer is signed in. */
export default function HomeScreen() {
  const { dealer, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <Screen>
      <View className="flex-1 justify-between p-6">
        <View className="gap-2 pt-8">
          <Text className="font-sans text-body text-muted-foreground">
            Signed in as
          </Text>
          <Text className="font-sans-bold text-title text-foreground">
            {dealer?.dealerName ?? "Dealer"}
          </Text>
          <Text className="font-sans text-body text-muted-foreground">
            Dealer code: {dealer?.dealerCode ?? "—"}
          </Text>
          <Text className="font-sans text-body text-muted-foreground">
            This device is approved for your account.
          </Text>
        </View>

        <Button
          label="Log out"
          variant="outline"
          loading={signingOut}
          onPress={() => {
            setSigningOut(true);
            void signOut();
          }}
        />
      </View>
    </Screen>
  );
}
