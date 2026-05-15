import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { dealerLogin } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";
import { getDeviceId, getDeviceLabel } from "@/lib/device";

type FormState = "idle" | "submitting" | "device_pending";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dealerCode, setDealerCode] = useState("");
  const [password, setPassword] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setFormState("submitting");
    try {
      const result = await dealerLogin({
        phoneNumber: phoneNumber.trim(),
        dealerCode: dealerCode.trim(),
        password,
        deviceId: await getDeviceId(),
        deviceLabel: getDeviceLabel(),
      });

      if (result.ok) {
        // The (auth) layout redirects to /home once the status flips.
        await signIn(result.token, result.dealer);
        return;
      }
      if (result.status === "device_pending") {
        setFormState("device_pending");
        return;
      }
      setError(result.error);
      setFormState("idle");
    } catch {
      setError("Something went wrong. Please try again.");
      setFormState("idle");
    }
  }

  if (formState === "device_pending") {
    return (
      <Screen>
        <View className="flex-1 justify-center gap-4 p-6">
          <Text className="font-sans-bold text-title text-foreground">
            Device approval needed
          </Text>
          <Text className="font-sans text-body text-muted-foreground">
            This phone is not yet approved for your account. Your distributor can
            approve it from their dashboard — once they do, sign in again.
          </Text>
          <Button
            label="Back to sign in"
            variant="outline"
            onPress={() => setFormState("idle")}
          />
        </View>
      </Screen>
    );
  }

  const submitting = formState === "submitting";

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            gap: 24,
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-1.5">
            <Text className="font-sans-bold text-display text-foreground">
              Dealer sign in
            </Text>
            <Text className="font-sans text-body text-muted-foreground">
              Enter the details your distributor gave you.
            </Text>
          </View>

          {error ? <ErrorMessage message={error} /> : null}

          <View className="gap-4">
            <TextField
              label="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+91XXXXXXXXXX"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoComplete="tel"
              editable={!submitting}
            />
            <TextField
              label="Dealer code"
              value={dealerCode}
              onChangeText={setDealerCode}
              placeholder="Your dealer code"
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!submitting}
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              autoCapitalize="none"
              editable={!submitting}
            />
          </View>

          <Button label="Sign in" onPress={handleSubmit} loading={submitting} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
