import { Text, View } from "react-native";

/** A small inline error banner. */
export function ErrorMessage({ message }: { message: string }) {
  return (
    <View className="rounded-md bg-destructive/10 px-3 py-2">
      <Text className="font-sans text-caption text-destructive">{message}</Text>
    </View>
  );
}
