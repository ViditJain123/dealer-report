import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

import { cn } from "@/lib/utils";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

/** Labelled text input with a focus ring and an optional error message. */
export function TextField({ label, error, className, ...props }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1.5">
      <Text className="font-sans-medium text-label text-foreground">{label}</Text>
      <TextInput
        placeholderTextColor="#737373"
        className={cn(
          "h-12 rounded-md border bg-card px-3 font-sans text-body text-foreground",
          error ? "border-destructive" : focused ? "border-ring" : "border-input",
          className,
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error ? (
        <Text className="font-sans text-caption text-destructive">{error}</Text>
      ) : null}
    </View>
  );
}
